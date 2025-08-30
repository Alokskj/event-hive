// Components
export { ProtectedRoute, withAuth } from './components/ProtectedRoute';

// Pages
export { LoginPage } from './pages/LoginPage';
export { RegisterPage } from './pages/RegisterPage';
export { VerifyEmailPage } from './pages/VerifyEmailPage';
export { EmailVerificationWaitingPage } from './pages/EmailVerificationWaitingPage';

// Hooks
export { useAuth } from './hooks/useAuth';
export {
  useLogin,
  useRegister,
  useLogout,
  useVerifyEmail,
  useResendVerification,
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
