import { Model } from 'mongoose';

export type ICategory = {
     name: string;
     type: 'USER' | 'CATEGORY' | 'GENRE';
     isActive: boolean;
     isDeleted: boolean;
};

export type CategoryModel = Model<ICategory, Record<string, unknown>>;
