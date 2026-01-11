import bcrypt from 'bcrypt';
import { model, Query, Schema } from 'mongoose';
import config from '../../../config';
import { USER_ROLES } from '../../../enums/user';
import { IUser, UserModel } from './user.interface';

const userSchema = new Schema<IUser, UserModel>(
  {
    name: { type: String, required: true },
    userName: { type: String, required: false, trim: true },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        // Password is only required for non-OAuth users
        return !this.oauthProvider;
      },
      select: false, // Security: Password field default hide thakbe
      minlength: 8,
    },
    image: { type: String, default: '' },
    status: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    stripeCustomerId: { type: String, default: '' },
    birthday: { type: Date, required: false },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: false,
    },
    googleId: { type: String, sparse: true },
    oauthProvider: { type: String, enum: ['google'] },
    country: { type: String, required: false },
    location: { type: String, required: false },
    interest: { type: [String], required: false },
    stripeConnectAccount: {
      accountId: { type: String, default: '' },
      accountStatus: {
        type: String,
        enum: ['pending', 'active', 'rejected'],
        default: 'pending',
      },
      onboardingComplete: { type: Boolean, default: false },
      loginUrl: { type: String },
      bankAccountInfo: {
        accountNumber: { type: String },
        routingNumber: { type: String },
        accountHolderName: { type: String },
        bankName: { type: String },
      },
      payoutEnabled: { type: Boolean, default: false },
      chargesEnabled: { type: Boolean, default: false },
      lastUpdated: { type: Date, default: Date.now },
    },
    authentication: {
      isResetPassword: { type: Boolean, default: false },
      oneTimeCode: { type: Number, default: null },
      expireAt: { type: Date, default: null },
    },
    onlineStatus: {
      isOnline: { type: Boolean, default: false },
      lastSeen: { type: Date, default: Date.now },
      lastHeartbeat: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// --- Static Methods ---
userSchema.statics.isExistUserById = async function (id: string) {
  return await this.findById(id);
};

userSchema.statics.isExistUserByEmail = async function (email: string) {
  return await this.findOne({ email });
};

userSchema.statics.isMatchPassword = async function (password: string, hashPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashPassword);
};

// --- Online Status Methods ---
userSchema.statics.setUserOnline = async function (userId: string) {
  await this.findByIdAndUpdate(userId, {
    'onlineStatus.isOnline': true,
    'onlineStatus.lastSeen': new Date(),
    'onlineStatus.lastHeartbeat': new Date(),
  });
};

userSchema.statics.setUserOffline = async function (userId: string) {
  await this.findByIdAndUpdate(userId, {
    'onlineStatus.isOnline': false,
    'onlineStatus.lastSeen': new Date(),
  });
};

// --- Pre-Save Hook (Unified) ---
userSchema.pre('save', async function (next) {
  const user = this;

  // 1. Password Hashing (Only if modified)
  if (user.isModified('password') && user.password) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds)
    );
  }

  // 2. OAuth Verification
  if (user.oauthProvider && !user.isVerified) {
    user.isVerified = true;
  }

  next();
});

// --- Query Middleware to filter deleted users ---
userSchema.pre(/^find/, function (this: Query<any, any>, next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

// Aggregate Middleware
userSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// --- Indexes ---
userSchema.index({ 'onlineStatus.isOnline': 1 });
userSchema.index({ 'onlineStatus.lastHeartbeat': 1 });

export const User = model<IUser, UserModel>('User', userSchema);