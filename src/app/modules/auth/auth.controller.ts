import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AuthService } from './auth.service';
import { User } from '../user/user.model';
import AppError from '../../../errors/AppError';
import config from '../../../config';
import passport from 'passport';
import { jwtHelper } from '../../../helpers/jwtHelper';
import { USER_ROLES } from '../../../enums/user';

const login = catchAsync(async (req, res) => {
  const { ...loginData } = req.body;
  const result = await AuthService.loginUserFromDB(loginData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User login successfully',
    data: result,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const email = req.body.email;
  const result = await AuthService.forgetPasswordToDB(email);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Please check your email, we send a OTP!',
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
     const token = req.headers.token as string;
     await AuthService.resetPasswordToDB(token!, req.body);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Password reset successfully',
     });
});

const changePassword = catchAsync(async (req, res) => {
     const user: any = req.user;
     const result = await AuthService.changePasswordToDB(user, req.body);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Password changed successfully',
          data: result,
     });
});

// Google OAuth
const googleAuth = passport.authenticate('google', {
     scope: ['profile', 'email'],
});

const googleAuthCallback = catchAsync(async (req, res) => {
     const user = req.user as any;

     if (!user) {
          return res.redirect(`${config.frontend_url}/login?error=authentication_failed`);
     }

     const jwtPayload = {
          userId: user._id,
          role: user.role,
     };

     const accessToken = jwtHelper.createToken(jwtPayload, config.jwt.jwt_secret as string, config.jwt.jwt_refresh_expire_in as string);

     const refreshToken = jwtHelper.createToken(jwtPayload, config.jwt.jwt_refresh_secret as string, config.jwt.jwt_refresh_expire_in as string);

     res.redirect(`${config.frontend_url}/auth/callback?token=${accessToken}&refresh=${refreshToken}`);
});

// Facebook OAuth
const facebookAuth = passport.authenticate('facebook', {
     scope: ['email'],
});

const facebookAuthCallback = catchAsync(async (req, res) => {
     const user = req.user as any;

     if (!user) {
          return res.redirect(`${config.frontend_url}/login?error=authentication_failed`);
     }

     const jwtPayload = {
          userId: user._id,
          role: user.role,
     };

     const accessToken = jwtHelper.createToken(jwtPayload, config.jwt.jwt_secret as string, config.jwt.jwt_refresh_expire_in as string);

     const refreshToken = jwtHelper.createToken(jwtPayload, config.jwt.jwt_refresh_secret as string, config.jwt.jwt_refresh_expire_in as string);

     res.redirect(`${config.frontend_url}/auth/callback?token=${accessToken}&refresh=${refreshToken}`);
});

const verifyOtp = catchAsync(async (req, res) => {
     const result = await AuthService.verifyEmailToDB(req.body);

     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Account verified successfully',
          data: result,
     });
});



// Email-only registration
const emailOnlyRegistration = catchAsync(async (req, res) => {
     const { email , role} = req.body;
     const result = await AuthService.emailOnlyRegistrationToDB(email, role);

     sendResponse(res, {
          statusCode: StatusCodes.CREATED,
          success: true,
          message: result.message,
          data: result,
     });
});

// resend Otp
const resendOtp = catchAsync(async (req, res) => {
     const { email } = req.body;
     await AuthService.resendOtpFromDb(email);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'OTP sent successfully again',
     });
});

const refreshToken = catchAsync(async (req, res) => {
     const { refreshToken } = req.body;
     const result = await AuthService.refreshToken(refreshToken);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Access token retrieved successfully',
          data: result,
     });
});

export const AuthController = {
     login,
     verifyOtp,
     resendOtp,
     emailOnlyRegistration,
     forgetPassword,
     resetPassword,
     changePassword,
     refreshToken,
     googleAuth,
     googleAuthCallback,
     facebookAuth,
     facebookAuthCallback,
};
