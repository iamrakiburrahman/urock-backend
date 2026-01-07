import { StatusCodes } from 'http-status-codes';
import { JwtPayload, Secret } from 'jsonwebtoken';
import { USER_ROLES } from '../../../enums/user';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import unlinkFile from '../../../shared/unlinkFile';
import { IUser } from './user.interface';
import { User } from './user.model';
import AppError from '../../../errors/AppError';
import generateOTP from '../../../utils/generateOTP';
import { EmailQueueHelper } from '../../../helpers/bullMQ/bullHelper';
import { CACHE_TTL, createCacheHelper } from '../../builder/RedisCacheHelper';
import { jwtHelper } from '../../../helpers/jwtHelper';
import config from '../../../config';


const userCache = createCacheHelper('user');

// create user
const createUserToDB = async (payload: IUser): Promise<IUser> => {
     //set role
     const user = await User.isExistUserByEmail(payload.email);
     if (user) {
          throw new AppError(StatusCodes.CONFLICT, 'Email already exists');
     }
     payload.role = USER_ROLES.USER;
     const createUser = await User.create(payload);
     if (!createUser) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create user');
     }
     //send email
     const otp = generateOTP(Number(config.otp.length));
     await EmailQueueHelper.sendWelcomeEmail(createUser.email!, createUser.name, otp);

     //save to DB
     const authentication = {
          oneTimeCode: otp,
          expireAt: new Date(Date.now() + Number(config.otp.expire_time)),
     };
     await User.findOneAndUpdate({ _id: createUser._id }, { $set: { authentication } });
     await userCache.clearLists();
     return createUser;
};

// create Admin
const createAdminToDB = async (payload: Partial<IUser>): Promise<IUser> => {
     //set role
     payload.role = USER_ROLES.ADMIN;
     const createAdmin = await User.create(payload);
     if (!createAdmin) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create admin');
     }

     //send email
     const otp = generateOTP(Number(config.otp.length));
     const values = {
          name: createAdmin.name,
          otp: otp,
          email: createAdmin.email!,
     };
     const createAccountTemplate = emailTemplate.createAccount(values);
     emailHelper.sendEmail(createAccountTemplate);

     //save to DB
     const authentication = {
          oneTimeCode: otp,
          expireAt: new Date(Date.now() + Number(config.otp.expire_time)),
     };
     await User.findOneAndUpdate({ _id: createAdmin._id }, { $set: { authentication } });
     await userCache.clearLists();
     return createAdmin;
};

// get user profile
const getUserProfileFromDB = async (user: JwtPayload): Promise<Partial<IUser>> => {
     return await userCache.wrapSingle(
          user.id,
          async () => {
               const { id } = user;
               const isExistUser = await User.findById(id).select(
                    'name userName email image platforms connectedPlatforms totalSocialFollowers role status isVerified birthday bio gender tiktokUserName instagramUserName youtubeUserName tiktokFollowers instagramFollowers youtubeFollowers contentTypes totalFollowers country location rating engagement ',
               );

               if (!isExistUser) {
                    throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
               }
               return isExistUser;
          },
          CACHE_TTL.MEDIUM,
     );
};

// update user profile
const updateProfileToDB = async (user: JwtPayload, payload: Partial<IUser>) => {
     const { id } = user;
     const isExistUser = await User.isExistUserById(id);
     if (!isExistUser) {
          throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist");
     }

     if (payload.image && isExistUser.image) {
          unlinkFile(isExistUser.image);
     }
     const updatedUser = await User.findByIdAndUpdate(id, payload, { new: true });
     if (!updatedUser) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to update user');
     }

     await userCache.clearAfterUpdate(id);

     return updatedUser;
};

const verifyUserPassword = async (userId: string, password: string) => {
     const user = await User.findById(userId).select('+password');
     if (!user) {
          throw new AppError(StatusCodes.NOT_FOUND, 'User not found.');
     }
     const isPasswordValid = User.isMatchPassword(password, user.password || '');
     return isPasswordValid;
};

const deleteUser = async (id: string) => {
     const isExistUser = await User.isExistUserById(id);
     if (!isExistUser) {
          throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
     }

     await User.findByIdAndUpdate(id, {
          $set: { isDeleted: true },
     });
     await userCache.clearAfterUpdate(id);
     return true;
};

const checkFieldAvailability = async (query: Record<string, any>): Promise<{ isAvailable: boolean }> => {
     const existingUser = await User.findOne(query);
     return { isAvailable: !existingUser };
};

// Register user
const registerUser = async (payload: any) => {
  const createUser = await User.create(payload);
  if (!createUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create user');
  }

  //send email
  const otp = generateOTP();
  const values = {
    name: createUser.name,
    otp: otp,
    email: createUser.email!,
  };

  const createAccountTemplate = emailTemplate.createAccount(values);
  emailHelper.sendEmail(createAccountTemplate);

  //save to DB
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 3 * 60000),
  };

  await User.findOneAndUpdate(
    { _id: createUser._id },
    { $set: { authentication } },
  );

  const createToken = jwtHelper.createToken(
    {
      id: createUser._id,
      email: createUser.email,
      role: createUser.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expire_in as string,
  );

  const result = {
    token: createToken,
    user: createUser,
  };

  // website a thakbe left side a nicher dike ja kon user signup korse

  return result;
};

// Complete user registration
const completeRegistration = async (userId: string, payload: Partial<IUser>) => {
     const isExistUser = await User.isExistUserById(userId);
     if (!isExistUser) {
          throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
     }
     if (payload.image && isExistUser.image) {
          unlinkFile(isExistUser.image);
     }
     const result = await User.findByIdAndUpdate(userId, payload, {
          new: true,
     });
     return result;
};

const toggleUserRoleIntoDB = async (id: string) => {
     const isExistUser = await User.isExistUserById(id);
     if (!isExistUser) {
          throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
     }

     // const oldRole = isExistUser.role;
     const newRole = isExistUser.role === 'CREATOR' ? 'PROMOTER' : 'CREATOR';
     const result = await User.findByIdAndUpdate(id, { role: newRole }, { new: true });

     const jwtData = {
          id: isExistUser._id,
          role: newRole,
          email: isExistUser.email,
     };

     const accessToken = jwtHelper.createToken(jwtData, config.jwt.jwt_secret as Secret, config.jwt.jwt_expire_in as string);
     await userCache.clearAfterUpdate(id);
     const data = {
          result,
          accessToken,
     };

     return data;
};

const deleteUserFromDB = async (id: string) => {
     const isExistUser = await User.isExistUserById(id);
     if (!isExistUser) {
          throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
     }
     const timestamps = new Date();
     await User.findByIdAndUpdate(id, {
          $set: { isDeleted: true, email: `${id}-deleted@example.com-${timestamps}` },
     });
     await userCache.clearAfterUpdate(id);
     return true;
};

export const UserService = {
     createUserToDB,
     getUserProfileFromDB,
     updateProfileToDB,
     createAdminToDB,
     deleteUser,
     verifyUserPassword,
     checkFieldAvailability,
     registerUser,
     completeRegistration,
     toggleUserRoleIntoDB,
     deleteUserFromDB,
};
