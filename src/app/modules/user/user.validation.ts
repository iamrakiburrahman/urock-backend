import { string, z } from 'zod';

export const createUserZodSchema = z.object({
     body: z.object({
          name: z.string({ required_error: 'Name is required' }).min(2, 'Name must be at least 2 characters long'),
          email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
          password: z.string({ required_error: 'Password is required' }).min(8, 'Password must be at least 8 characters long'),
          phone: string().default('').optional(),
          profile: z.string().optional(),
     }),
});

const createBusinessUserZodSchema = z.object({
     body: z.object({
          name: z.string({ required_error: 'Name is required' }),
          phone: z.string({ required_error: 'Contact is required' }),
          email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
          password: z.string({ required_error: 'Password is required' }).min(8, 'Password must be at least 8 characters long'),
          profile: z.string().optional(),
     }),
});

const updateUserZodSchema = z.object({
     body: z.object({
          location: z.string().optional(),
          country: z.string().optional(),
          bio: z.string().optional(),
          instagramUserName: z.string().optional(),
          instagramFollowers: z.string().optional(),
          tiktokUserName: z.string().optional(),
          tiktokFollowers: z.string().optional(),
          youtubeUserName: z.string().optional(),
          youtubeFollowers: z.string().optional(),
          contentTypes: z.array(z.string()).optional(),
     }),
});
const completeRegistrationZodSchema = z.object({
     body: z.object({
          userName: z.string({ required_error: 'User name is required' }),
          birthday: z.string({ required_error: 'Birthday is required' }),
          businessName: z.string({ required_error: 'Business name is required' }),
          country: z.string({ required_error: 'Country is required' }),
     }),
});
export const UserValidation = {
     createUserZodSchema,
     updateUserZodSchema,
     createBusinessUserZodSchema,
     completeRegistrationZodSchema,
};
