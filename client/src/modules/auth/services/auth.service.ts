import { api } from '@/utils/api';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  User,
} from '../types';

export class AuthService {
  static async login(data: LoginRequest) {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response;
  }

  static async register(data: RegisterRequest) {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response;
  }

  static async verifyEmail(data: VerifyEmailRequest) {
    const response = await api.post<{ message: string }>('/auth/verify-email', data);
    return response;
  }

  static async resendVerification(email: string) {
    const response = await api.post<{ message: string }>('/auth/resend-verification', { email });
    return response;
  }


  static async getProfile() {
    const response = await api.get<{ user: User }>('/auth/profile');
    return response;
  }

  static async updateProfile(data: Partial<User>) {
    const response = await api.put<{ user: User }>('/auth/profile', data);
    return response;
  }


  static async logout() {
    const response = await api.post<{ message: string }>('/auth/logout');
    return response;
  }

  static async checkAuth() {
    const response = await api.get<{ user: User }>('/auth/profile');
    return response;
  }
}
