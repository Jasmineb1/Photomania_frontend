import { z, ZodType } from 'zod';

import { LoginUser, Users } from '../types';

const acceptedImage = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const postSchema = z.object({
  image: z
    .instanceof(File, { message: 'Image is required and must be a file' })
    .optional()
    .refine(
      (file) => file && acceptedImage.includes(file.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    ),
  caption: z.string().min(1, 'The caption cannot be empty'),
  description: z.string().min(1, 'The description cannot be empty').max(50)
});

export const postUpdateSchema = z.object({
  caption: z.string().min(1, 'The caption cannot be empty'),
  description: z.string().min(1, 'The description cannot be empty').max(50)
});
export const loginSchema: ZodType<LoginUser> = z.object({
  email: z
    .string()
    .min(1, { message: 'Fields cannot be empty' })
    .email({ message: 'Email not valid' }),
  password: z.string().min(6, { message: 'Password must be atleast 6 characters' }).max(15)
});

export const signupSchema: ZodType<Users> = z.object({
  username: z
    .string({ message: 'Username must be a string' })
    .min(4, { message: 'Username must contain atleast 4 characters' }),
  email: z
    .string()
    .min(1, { message: 'Fields cannot be empty' })
    .email({ message: 'Email not valid' }),
  password: z.string().min(6, { message: 'Password must be atleast 6 characters' }).max(15),
  firstName: z
    .string({ message: 'First name must be a string' })
    .min(3, { message: 'First name must contain atleast 4 characters' }),
  lastName: z
    .string({ message: 'Last name must be a string' })
    .min(2, { message: 'Last name must contain atleast 4 characters' })
});

export type PostData = z.infer<typeof postSchema>;
