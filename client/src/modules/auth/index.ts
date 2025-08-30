// Components
export { ProtectedRoute, AdminRoute, ModeratorRoute, CitizenRoute, withAuth } from './components/ProtectedRoute';

// Pages
export { LoginPage } from './pages/LoginPage';
export { RegisterPage } from './pages/RegisterPage';
export { VerifyEmailPage } from './pages/VerifyEmailPage';
export { EmailVerificationWaitingPage } from './pages/EmailVerificationWaitingPage';

// Hooks
export { useAuth } from './hooks/useAuth';
export { useAuthStore } from './hooks/useAuthStore';
export {
  useLogin,
  useRegister,
  useLogout,
  useVerifyEmail,
  useResendVerification,
  useForgotPassword,
  useResetPassword,
  useChangePassword,
  useUpdateProfile,
} from './hooks/useAuth';

// Services
export { AuthService } from './services/auth.service';

// Types
export type {
  User,
  UserRole,
  AuthState,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  AuthContextType,
} from './types';
