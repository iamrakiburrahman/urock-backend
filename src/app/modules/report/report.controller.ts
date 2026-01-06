import catchAsync from '../../../shared/catchAsync';
import { ReportService } from './report.service';
import sendResponse from '../../../shared/sendResponse';

const createReport = catchAsync(async (req, res) => {
     const { id }: any = req.user;
     const payload = {
          userId: id,
          ...req.body,
     };
     const result = await ReportService.createReportToDB(payload);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Report Created Successfully',
          data: result,
     });
});
const getReports = catchAsync(async (req, res) => {
     const result = await ReportService.getReportsFromDB(req.query);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Reports Retrieved Successfully',
          data: result.reports,
          meta: result.meta,
     });
});

const takeActionOnReport = catchAsync(async (req, res) => {
     const { reportId } = req.params;
     const { action } = req.body;
     const result = await ReportService.takeActionOnReport(reportId, action);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Report Action Taken Successfully',
          data: result,
     });
});
const disableCampaign = catchAsync(async (req, res) => {
     const { reportId } = req.params;
     const result = await ReportService.disableCampaign(reportId);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Campaign Disabled Successfully',
          data: result,
     });
});
const deleteReport = catchAsync(async (req, res) => {
     const { reportId } = req.params;
     const result = await ReportService.deleteReportFromDB(reportId);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Report Deleted Successfully',
          data: result,
     });
});
export const ReportController = {
     createReport,
     getReports,
     takeActionOnReport,
     disableCampaign,
     deleteReport,
};
