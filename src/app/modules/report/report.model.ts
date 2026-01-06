import { model, Schema } from 'mongoose';
import { IReport, ReportModel } from './report.interface';

const reportSchema = new Schema<IReport, ReportModel>(
     {
          userId: {
               type: Schema.Types.ObjectId,
               required: true,
               ref: 'User',
          },
          campaignId: {
               type: Schema.Types.ObjectId,
               required: true,
               ref: 'Campaign',
          },
          status: {
               type: String,
               required: true,
               default: 'pending',
          },
          reason: {
               type: String,
               required: true,
          },
     },
     { timestamps: true },
);

export const Report = model<IReport, ReportModel>('Report', reportSchema);
