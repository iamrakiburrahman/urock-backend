import { StatusCodes } from 'http-status-codes';
import { ICategory } from './category.interface';
import { Category } from './category.model';
import AppError from '../../../errors/AppError';
import { CACHE_TTL, createCacheHelper } from '../../builder/RedisCacheHelper';
import QueryBuilder from '../../builder/QueryBuilder';



const categoryCache = createCacheHelper('category');


const createCategoryToDB = async (payload: ICategory) => {
     const { name } = payload;
     const isExistName = await Category.findOne({ name: name });
     if (isExistName) {
          throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'This Category Name Already Exist');
     }
     const createCategory: any = await Category.create(payload);
     if (!createCategory) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create Category');
     }
     await categoryCache.clearLists();
     return createCategory;
};

const getCategoriesFromDB = async (query: Record<string, unknown>) => {
     const result = await categoryCache.wrapList(
          query,
          async () => {
               const queryBuilder = new QueryBuilder(Category.find(), query);
               const result = await queryBuilder.search(['name']).filter().sort().paginate().fields().modelQuery.exec();
               const meta = await queryBuilder.countTotal();
               return {
                    meta,
                    result,
               };
          },
          CACHE_TTL.MEDIUM,
     );

     return result;
};

const getCategoriesForUserFromDB = async (query: Record<string, unknown>) => {
     const result = await categoryCache.wrapList(
          query,
          async () => {
               const queryBuilder = new QueryBuilder(Category.find({ isActive: true, isDeleted: false }), query);

               const result = await queryBuilder.search(['name']).filter().sort().paginate().fields().modelQuery.exec();
               const meta = await queryBuilder.countTotal();
               return {
                    meta,
                    result,
               };
          },
          CACHE_TTL.MEDIUM,
     );

     return result;
};

const updateCategoryToDB = async (id: string, payload: ICategory) => {
     const isExistCategory: any = await Category.findById(id);
     if (!isExistCategory) {
          throw new AppError(StatusCodes.BAD_REQUEST, "Category doesn't exist");
     }
     const updateCategory = await Category.findOneAndUpdate({ _id: id }, payload, {
          new: true,
     });
     await categoryCache.clearAfterUpdate(id);
     return updateCategory;
};

const deleteCategoryToDB = async (id: string): Promise<ICategory | null> => {
     const deleteCategory = await Category.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
     if (!deleteCategory) {
          throw new AppError(StatusCodes.BAD_REQUEST, "Category doesn't exist");
     }
     await categoryCache.clearAfterUpdate(id);
     return deleteCategory;
};

export const CategoryService = {
     createCategoryToDB,
     getCategoriesFromDB,
     updateCategoryToDB,
     deleteCategoryToDB,
     getCategoriesForUserFromDB,
};
