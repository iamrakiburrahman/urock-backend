import { Model, Types } from 'mongoose';

export type IReport = {
     userId: Types.ObjectId;
     campaignId: Types.ObjectId;
     status: 'pending' | 'resolved';
     reason: string;
};

export type ReportModel = Model<IReport, Record<string, unknown>>;
