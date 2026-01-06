import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import AppError from '../../../errors/AppError';
import { CACHE_TTL, createCacheHelper } from '../../builder/RedisCacheHelper';
import { Business } from './business.model';
import { IBusiness } from './business.interface';
const businessCache = createCacheHelper('business');

const createBusinessToDB = async (userId: string, name: string): Promise<IBusiness> => {
     const createBusiness = await Business.create({ name, userId });
     if (!createBusiness) {
          throw new AppError(StatusCodes.OK, 'Failed to create business');
     }
     await businessCache.clearLists();
     return createBusiness;
};

// const getAllBusinessFromDB = async (): Promise<IBusiness[]> => {
//      return await businessCache.wrapList(
//           {},
//           async () => {
//                return await Business.find({});
//           },
//           CACHE_TTL.VERY_LONG,
//      );
// };

// const updateBusinessToDB = async (id: string, payload: IBusiness): Promise<IBusiness | {}> => {
//      if (!mongoose.Types.ObjectId.isValid(id)) {
//           throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'Invalid ');
//      }
//      const business = await Business.findOneAndUpdate({ _id: id }, payload, { new: true });
//      if (!business) {
//           throw new AppError(StatusCodes.OK, 'Failed to update business');
//      }
//      await businessCache.clearAfterUpdate(id);
//      return business;
// };

// const deleteBusinessToDB = async (id: string): Promise<IBusiness | undefined> => {
//      if (!mongoose.Types.ObjectId.isValid(id)) {
//           throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'Invalid ');
//      }

//      const isBusinessExist: any = await Business.findById({ _id: id });
//      if (!isBusinessExist) {
//           throw new AppError(StatusCodes.OK, 'Business not found');
//      }

//      //delete from database
//      await Business.findByIdAndDelete(id);
//      await businessCache.clearAfterUpdate(id);
//      return;
// };

export const BusinessService = {
     createBusinessToDB,
     // getAllBusinessFromDB,
     // updateBusinessToDB,
     // deleteBusinessToDB,
};
