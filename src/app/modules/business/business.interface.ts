import { Model, Types } from 'mongoose';

export type IBusiness = {
     userId: Types.ObjectId;
     name: string;
};

export type BusinessModel = Model<IBusiness>;
