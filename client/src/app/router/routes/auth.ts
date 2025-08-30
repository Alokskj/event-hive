import { lazy } from 'react';
import { RouteObject } from 'react-router';

// Lazy load auth pages
const LoginPage = lazy(() => 
  import('@/modules/auth').then(module => ({ default: module.LoginPage }))
);

const RegisterPage = lazy(() => 
  import('@/modules/auth').then(module => ({ default: module.RegisterPage }))
);

const VerifyEmailPage = lazy(() => 
  import('@/modules/auth').then(module => ({ default: module.VerifyEmailPage }))
);

const EmailVerificationWaitingPage = lazy(() => 
  import('@/modules/auth').then(module => ({ default: module.EmailVerificationWaitingPage }))
);

const authRoutes: RouteObject[] = [
  {
    path: 'login',
    Component: LoginPage,
  },
  {
    path: 'register',
    Component: RegisterPage,
  },
  {
    path: 'verify-email',
    Component: VerifyEmailPage,
  },
  {
    path: 'verification-waiting',
    Component: EmailVerificationWaitingPage,
  },
];

export default authRoutes;
