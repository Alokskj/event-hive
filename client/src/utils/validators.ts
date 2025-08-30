import { z } from "zod";

export const usernameSchema = z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(30, 'Username must be less than 30 characters long')
    .regex(
        /^[a-zA-Z0-9_]+$/,
        'Username can only contain letters, numbers, and underscores',
    );
export const emailSchema = z.string().email('Invalid email format');
export const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .refine((val) => /[a-z]/.test(val), {
        message: 'Password must contain at least one lowercase letter',
    })
    .refine((val) => /[A-Z]/.test(val), {
        message: 'Password must contain at least one uppercase letter',
    })
    .refine((val) => /\d/.test(val), {
        message: 'Password must contain at least one number',
    })
    .refine((val) => /[^a-zA-Z0-9]/.test(val), {
        message: 'Password must contain at least one special character',
    });