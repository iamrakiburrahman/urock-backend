import { model, Schema } from 'mongoose';
import { ICategory, CategoryModel } from './category.interface';

const categorySchema = new Schema<ICategory, CategoryModel>(
     {
          name: {
               type: String,
               required: true,
               unique: true,
          },
          type: {
               type: String,
               enum: ['USER', 'CATEGORY', 'GENRE'],
               required: true,
          },
          isActive: {
               type: Boolean,
               default: true,
          },
          isDeleted: {
               type: Boolean,
               default: false,
          },
     },
     { timestamps: true },
);
// Query Middleware
categorySchema.pre('find', function (next) {
     this.find({ isDeleted: { $ne: true } });
     next();
});

categorySchema.pre('findOne', function (next) {
     this.find({ isDeleted: { $ne: true } });
     next();
});

categorySchema.pre('aggregate', function (next) {
     this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
     next();
});
export const Category = model<ICategory, CategoryModel>('Category', categorySchema);
