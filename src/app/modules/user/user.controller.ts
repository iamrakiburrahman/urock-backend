import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';
import config from '../../../config';
import bcrypt from 'bcrypt';

const createUser = catchAsync(async (req, res) => {
     const { ...userData } = req.body;
     const result = await UserService.createUserToDB(userData);

     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'User created successfully',
          data: result,
     });
});

const createAdmin = catchAsync(async (req, res) => {
     const { ...userData } = req.body;
     const result = await UserService.createAdminToDB(userData);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Admin created successfully',
          data: result,
     });
});

const getUserProfile = catchAsync(async (req, res) => {
     const user: any = req.user;
     const result = await UserService.getUserProfileFromDB(user);

     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Profile data retrieved successfully',
          data: result,
     });
});

//update profile
const updateProfile = catchAsync(async (req, res) => {
     const user: any = req.user;
     if ('role' in req.body) {
          delete req.body.role;
     }
     if ('userName' in req.body) {
          delete req.body.userName;
     }
     // If password is provided
     if (req.body.password) {
          req.body.password = await bcrypt.hash(req.body.password, Number(config.bcrypt_salt_rounds));
     }

     const result = await UserService.updateProfileToDB(user, req.body);

     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Profile updated successfully',
          data: result,
     });
});

//delete profile
const deleteProfile = catchAsync(async (req, res) => {
     const { id }: any = req.user;
     const { password } = req.body;
     const isUserVerified = await UserService.verifyUserPassword(id, password);
     if (!isUserVerified) {
          return sendResponse(res, {
               success: false,
               statusCode: StatusCodes.UNAUTHORIZED,
               message: 'Incorrect password. Please try again.',
          });
     }

     const result = await UserService.deleteUser(id);

     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Profile deleted successfully',
          data: result,
     });
});

const checkFieldAvailability = catchAsync(async (req, res) => {
     const result = await UserService.checkFieldAvailability(req.query);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Field check result',
          data: result,
     });
});

// Register user
const registerUser = catchAsync(async (req, res) => {
     const { ...userData } = req.body;
     const result = await UserService.registerUser(userData);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'User registered successfully',
          data: result,
     });
});

// Complete user registration
const completeRegistration = catchAsync(async (req, res) => {
     const { id } = req.user as { id: string };
     const { ...registrationData } = req.body;
     const result = await UserService.completeRegistration(id, registrationData);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'User registration completed successfully',
          data: result,
     });
});

const toggleUserRole = catchAsync(async (req, res) => {
     const { id } = req.user as { id: string };
     const result = await UserService.toggleUserRoleIntoDB(id);

     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'User role switched successfully',
          data: result,
     });
});

// Delete user account
const deleteAccount = catchAsync(async (req, res) => {
     const { id } = req.user as { id: string };
     const { password } = req.body;
     const isUserVerified = await UserService.verifyUserPassword(id, password);
     if (!isUserVerified) {
          return sendResponse(res, {
               success: false,
               statusCode: StatusCodes.UNAUTHORIZED,
               message: 'Incorrect password. Please try again.',
          });
     }
     const result = await UserService.deleteUser(id);

     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'User account deleted successfully',
          data: result,
     });
});




export const UserController = {
     createUser,
     getUserProfile,
     updateProfile,
     createAdmin,
     deleteProfile,
     checkFieldAvailability,
     registerUser,
     completeRegistration,
     toggleUserRole,
     deleteAccount,

};
