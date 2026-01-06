import { model, Schema } from 'mongoose';
import { BusinessModel, IBusiness } from './business.interface';

const businessSchema = new Schema<IBusiness, BusinessModel>(
     {
          userId: {
               type: Schema.Types.ObjectId,
               ref: 'User',
               required: true,
          },
          name: {
               type: String,
               required: true,
          },
     },
     { timestamps: true },
);

export const Business = model<IBusiness, BusinessModel>('Business', businessSchema);
