import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/AppError';
import { ISlider } from './slider.interface';
import { SliderModel } from './slider.model';
import { CACHE_TTL, createCacheHelper } from '../../builder/RedisCacheHelper';
import QueryBuilder from '../../builder/QueryBuilder';

const createSliderCache = createCacheHelper('sliderCache');

const createSlider = async (payload: ISlider) => {
     const result = await SliderModel.create(payload);
     if (!result) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Slider creation failed');
     }

     await createSliderCache.clearLists();
     return result;
};
const getSliders = async () => {
     return await createSliderCache.wrapList(
          {},
          async () => {
               const result = await SliderModel.find();
               return result;
          },
          CACHE_TTL.VERY_LONG,
     );
};

const getSliderById = async (id: string) => {
     return await createSliderCache.wrapSingle(
          id,
          async () => {
               const result = await SliderModel.findById(id);
               return result;
          },
          CACHE_TTL.VERY_LONG,
     );
};
const updateSlider = async (id: string, payload: ISlider) => {
     const result = await SliderModel.findByIdAndUpdate(id, payload, {
          new: true,
     });
     if (!result) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Slider update failed');
     }
     await createSliderCache.clearAfterUpdate(id);
     return result;
};
const deleteSlider = async (id: string) => {
     const result = await SliderModel.findByIdAndDelete(id);
     if (!result) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Slider delete failed');
     }
     await createSliderCache.clearAfterUpdate(id);
     return result;
};
const getAllSliders = async (query: Record<string, unknown>) => {
     return await createSliderCache.wrapList(
          query,
          async () => {
               const queryBuilder = new QueryBuilder(SliderModel.find(), query);
               const result = await queryBuilder.filter().fields().search(['name']).paginate().modelQuery.exec();
               const meta = await queryBuilder.countTotal();
               return {
                    meta,
                    data: result,
               };
          },
          CACHE_TTL.VERY_LONG,
     );
};
export const SliderService = {
     createSlider,
     getSliders,
     getSliderById,
     updateSlider,
     deleteSlider,
     getAllSliders,
};
