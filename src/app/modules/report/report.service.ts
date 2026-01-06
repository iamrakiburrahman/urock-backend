import { StatusCodes } from 'http-status-codes';
import { IReport } from './report.interface';
import { Report } from './report.model';
import AppError from '../../../errors/AppError';
import { createCacheHelper } from '../../builder/RedisCacheHelper';
import QueryBuilder from '../../builder/QueryBuilder';

const reportCache = createCacheHelper('reportCache');
const createReportToDB = async (payload: IReport): Promise<IReport> => {
     const report = await Report.create(payload);
     if (!report) throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to created Report ');
     await reportCache.clearLists();
     return report;
};
const getReportsFromDB = async (query: Record<string, unknown>) => {
     return await reportCache.wrapList(query, async () => {
          const queryBuilder = new QueryBuilder(Report.find().populate('userId', 'name email').populate('campaignId', 'title'), query);
          const reports = await queryBuilder.fields().filter().sort().paginate().modelQuery;
          const meta = await queryBuilder.countTotal();
          return {
               meta,
               reports,
          };
     });
};
const takeActionOnReport = async (reportId: string, action: string) => {
     const report = await Report.findById(reportId);
     if (!report) throw new AppError(StatusCodes.NOT_FOUND, 'Report not found');
     if (report.status !== 'pending') {
          throw new AppError(StatusCodes.BAD_REQUEST, 'This report is already resolved');
     }

     report.status = action as 'resolved';
     await report.save();
     await reportCache.clearAfterUpdate(reportId);
     return report;
};
const disableCampaign = async (reportId: string) => {
     const report = await Report.findById(reportId);
     if (!report) throw new AppError(StatusCodes.NOT_FOUND, 'Report not found');
     if (report.status !== 'pending') {
          throw new AppError(StatusCodes.BAD_REQUEST, 'This report is already resolved');
     }

     await reportCache.clearAfterUpdate(reportId);
     return report;
};
const deleteReportFromDB = async (reportId: string) => {
     const report = await Report.findById(reportId);
     if (!report) throw new AppError(StatusCodes.NOT_FOUND, 'Report not found');
     await report.deleteOne();
     await reportCache.clearAfterUpdate(reportId);
     return report;
};
export const ReportService = {
     createReportToDB,
     getReportsFromDB,
     takeActionOnReport,
     disableCampaign,
     deleteReportFromDB,
};
