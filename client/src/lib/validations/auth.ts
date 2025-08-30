import { z } from 'zod';

// Base validation schemas
export const emailSchema = z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address');

export const passwordSchema = z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one lowercase letter, one uppercase letter, and one number',
    );

// Login form schema
export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required'),
});

// Registration form schema
export const registrationSchema = z
    .object({
        firstName: z
            .string()
            .min(1, 'First name is required')
            .min(2, 'First name must be at least 2 characters'),
        lastName: z
            .string()
            .min(1, 'Last name is required')
            .min(2, 'Last name must be at least 2 characters'),

        email: emailSchema,
        password: passwordSchema,
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

// Forgot password schema
export const forgotPasswordSchema = z.object({
    email: emailSchema,
});

// Reset password schema
export const resetPasswordSchema = z
    .object({
        password: passwordSchema,
        confirmPassword: z.string().min(1, 'Please confirm your password'),
        token: z.string().min(1, 'Reset token is required'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

// Email verification schema
export const emailVerificationSchema = z.object({
    token: z.string().min(1, 'Verification token is required'),
});

// Change password schema
export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, 'Current password is required'),
        password: passwordSchema,
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

// Update profile schema
export const updateProfileSchema = z.object({
    firstName: z
        .string()
        .min(1, 'First name is required')
        .min(2, 'First name must be at least 2 characters'),
    lastName: z
        .string()
        .min(1, 'Last name is required')
        .min(2, 'Last name must be at least 2 characters'),
    username: z
        .string()
        .min(1, 'Username is required')
        .min(3, 'Username must be at least 3 characters')
        .regex(
            /^[a-zA-Z0-9_]+$/,
            'Username can only contain letters, numbers, and underscores',
        ),
    phone: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
        .optional()
        .or(z.literal('')),
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegistrationFormData = z.infer<typeof registrationSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type EmailVerificationFormData = z.infer<typeof emailVerificationSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
