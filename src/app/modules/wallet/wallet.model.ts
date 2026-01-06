import { Schema, model } from 'mongoose';
import { Currency, IWallet } from './wallet.interface';

const walletSchema = new Schema<IWallet>(
     {
          userId: {
               type: Schema.Types.ObjectId,
               ref: 'User',
               required: true,
               unique: true,
               index: true,
          },
          balance: {
               type: Number,
               default: 0,
               min: 0,
               required: true,
          },
          totalPayout: {
               type: Number,
               default: 0,
               min: 0,
               required: true,
          },
          currency: {
               type: String,
               enum: Object.values(Currency),
               default: Currency.USD,
          },
          stripeCustomerId: {
               type: String,
               unique: true,
               sparse: true,
          },
          stripeAccountId: {
               type: String,
               unique: true,
               sparse: true,
          },
          isActive: {
               type: Boolean,
               default: true,
          },
     },
     {
          timestamps: true,
     },
);

export const Wallet = model<IWallet>('Wallets', walletSchema);
