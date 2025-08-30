import { User, UserRole } from '@prisma/client';
import {
    RegisterInput,
    LoginInput,
    ForgotPasswordInput,
    ResetPasswordInput,
    ChangePasswordInput,
    UpdateProfileInput,
    VerifyEmailInput,
} from '../schemas/auth.schema';
import { generateToken, verifyToken } from '../lib/utils/jwt';
import { hashPassword, comparePassword } from '../lib/utils/hashing';
import { auditService } from './audit.service';
import prisma from '../config/prisma';
import {
    BadRequestException,
    ConflictException,
    UnauthorizedException,
    InternalServerException,
} from '@lib/error-handling';
import { emailService } from './email.service';

export class AuthService {
    /**
     * Register a new user
     */
    async register(
        data: RegisterInput,
        ipAddress?: string,
        userAgent?: string,
    ): Promise<{
        user: Omit<User, 'password'>;
        accessToken: string;
        refreshToken: string;
    }> {
        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: data.email },
                    ...(data.username ? [{ username: data.username }] : []),
                ],
            },
        });

        if (existingUser) {
            if (existingUser.email === data.email) {
                throw new ConflictException(
                    'User with this email already exists',
                );
            }
            if (existingUser.username === data.username) {
                throw new ConflictException('Username is already taken');
            }
        }

        // Hash password
        const hashedPassword = await hashPassword(data.password);

        // Create user
        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.username,
                phone: data.phone,
                role: UserRole.USER,
            },
        });

        // Generate tokens
        const { accessToken, refreshToken } = this.generateTokens(
            user.id,
            user.email,
            user.role,
        );

        // Generate email verification token
        const verificationToken = generateToken(
            { userId: user.id, email: user.email },
            'email',
            '24h',
        );

        // Send welcome email with verification
        try {
            await emailService.sendWelcomeEmail(
                user.email,
                user.firstName || undefined,
                verificationToken,
                user.id,
            );
        } catch (error) {
            console.error('Failed to send welcome email:', error);
        }

        // Remove password from response
        const { password, ...userWithoutPassword } = user;

        // Create audit log
        await auditService.logAuth(
            user.id,
            'USER_REGISTERED',
            { email: user.email },
            ipAddress,
            userAgent,
        );

        return {
            user: userWithoutPassword,
            accessToken,
            refreshToken,
        };
    }

    /**
     * Login user
     */
    async login(
        data: LoginInput,
        ipAddress?: string,
        userAgent?: string,
    ): Promise<{
        user: Omit<User, 'password'>;
        accessToken: string;
        refreshToken: string;
    }> {
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // Check if user is active
        if (!user.isActive) {
            throw new BadRequestException('Account is deactivated');
        }

        // Verify password
        const isPasswordValid = await comparePassword(
            data.password,
            user.password,
        );
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // Generate tokens
        const { accessToken, refreshToken } = this.generateTokens(
            user.id,
            user.email,
            user.role,
        );

        // Remove password from response
        const { password, ...userWithoutPassword } = user;

        // Create audit log
        await auditService.logAuth(
            user.id,
            'USER_LOGIN',
            undefined,
            ipAddress,
            userAgent,
        );

        return {
            user: userWithoutPassword,
            accessToken,
            refreshToken,
        };
    }

    /**
     * Refresh access token
     */
    async refreshToken(
        refreshToken: string,
    ): Promise<{ accessToken: string; refreshToken: string }> {
        try {
            const payload = verifyToken(refreshToken, 'refresh') as any;

            // Verify user still exists and is active
            const user = await prisma.user.findUnique({
                where: { id: payload.userId },
            });

            if (!user || !user.isActive) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            // Generate new tokens
            const tokens = this.generateTokens(user.id, user.email, user.role);

            return tokens;
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    /**
     * Change user password
     */
    async changePassword(
        userId: string,
        data: ChangePasswordInput,
    ): Promise<void> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        // Verify current password
        const isCurrentPasswordValid = await comparePassword(
            data.currentPassword,
            user.password,
        );
        if (!isCurrentPasswordValid) {
            throw new BadRequestException('Current password is incorrect');
        }

        // Hash new password
        const hashedNewPassword = await hashPassword(data.newPassword);

        // Update password
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });

        // Create audit log
        await auditService.logAuth(userId, 'PASSWORD_CHANGED');
    }

    /**
     * Update user profile
     */
    async updateProfile(
        userId: string,
        data: UpdateProfileInput,
    ): Promise<Omit<User, 'password'>> {
        // Check if username is taken (if provided)
        if (data.username) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    username: data.username,
                    id: { not: userId },
                },
            });

            if (existingUser) {
                throw new ConflictException('Username is already taken');
            }
        }

        const oldUser = await prisma.user.findUnique({ where: { id: userId } });

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.username,
                phone: data.phone,
            },
        });

        // Create audit log
        await auditService.logProfileUpdate(userId, oldUser, updatedUser);

        // Remove password from response
        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }

    /**
     * Get user profile
     */
    async getProfile(userId: string): Promise<Omit<User, 'password'>> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    /**
     * Verify email
     */
    async verifyEmail(data: VerifyEmailInput): Promise<void> {
        try {
            const payload = verifyToken(data.token, 'email') as any;

            await prisma.user.update({
                where: { id: payload.userId },
                data: { isVerified: true },
            });

            // Create audit log
            await auditService.logAuth(payload.userId, 'EMAIL_VERIFIED');
        } catch (error) {
            throw new BadRequestException(
                'Invalid or expired verification token',
            );
        }
    }

    /**
     * Resend email verification
     */
    async resendEmailVerification(email: string): Promise<void> {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Don't reveal if email exists or not
            return;
        }

        if (user.isVerified) {
            throw new BadRequestException('Email is already verified');
        }

        // Generate email verification token
        const verificationToken = generateToken(
            { userId: user.id, email: user.email },
            'email',
            '24h',
        );

        // Send email verification
        try {
            await emailService.sendEmailVerification(
                user.email,
                user.firstName || undefined,
                verificationToken,
                user.id,
            );
        } catch (error) {
            console.error('Failed to send verification email:', error);
            throw new InternalServerException(
                'Failed to send verification email',
            );
        }

        // Create audit log
        await auditService.logAuth(user.id, 'EMAIL_VERIFIED');
    }

    /**
     * Send password reset email
     */
    async forgotPassword(data: ForgotPasswordInput): Promise<void> {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (!user) {
            // Don't reveal if email exists or not
            return;
        }

        // Generate reset token
        const resetToken = generateToken(
            { userId: user.id, email: user.email },
            'password-reset',
            '1h',
        );

        // Send password reset email
        try {
            await emailService.sendPasswordResetEmail(
                user.email,
                user.firstName || undefined,
                resetToken,
                user.id,
            );
        } catch (error) {
            console.error('Failed to send password reset email:', error);
        }

        // Create audit log
        await auditService.logAuth(user.id, 'PASSWORD_RESET_REQUESTED');
    }

    /**
     * Reset password with token
     */
    async resetPassword(data: ResetPasswordInput): Promise<void> {
        try {
            const payload = verifyToken(data.token, 'password-reset') as any;

            // Get user details for email
            const user = await prisma.user.findUnique({
                where: { id: payload.userId },
                select: { email: true, firstName: true },
            });

            if (!user) {
                throw new BadRequestException('User not found');
            }

            // Hash new password
            const hashedPassword = await hashPassword(data.password);

            await prisma.user.update({
                where: { id: payload.userId },
                data: { password: hashedPassword },
            });

            // Send password changed confirmation email
            try {
                await emailService.sendPasswordChangedEmail(
                    user.email,
                    user.firstName || undefined,
                    payload.userId,
                );
            } catch (error) {
                console.error('Failed to send password changed email:', error);
            }

            // Create audit log
            await auditService.logAuth(payload.userId, 'PASSWORD_RESET');
        } catch (error) {
            throw new BadRequestException('Invalid or expired reset token');
        }
    }

    /**
     * Logout user
     */
    async logout(userId: string): Promise<void> {
        // Create audit log
        await auditService.logAuth(userId, 'USER_LOGOUT');
    }

    /**
     * Generate access and refresh tokens
     */
    private generateTokens(userId: string, email: string, role: UserRole) {
        const accessToken = generateToken(
            { userId, email, role },
            'access',
            '7d',
        );

        const refreshToken = generateToken(
            { userId, email, role },
            'refresh',
            '7d',
        );

        return { accessToken, refreshToken };
    }
}

export const authService = new AuthService();
