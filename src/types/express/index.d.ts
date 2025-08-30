import { Auth, Session, UserProfile, UserRole } from '@prisma/client';
import { TokenPayload } from '../../lib/utils/jwt';

// Define the auth user type
export type AuthUser = TokenPayload & {
    userId: string;
    email: string;
    role?: UserRole;
};

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}

export {};
