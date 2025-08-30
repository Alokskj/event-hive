import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '../types';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  hasLocationAccess: boolean;
  accessToken: string | null;
  setUser: (user: User) => void;
  setAuth: (user: User, accessToken: string | null) => void;
  updateUser: (userData: Partial<User>) => void;
  clearUser: () => void;
  clearAuth: () => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setHasLocationAccess: (hasAccess: boolean) => void;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  isAdmin: () => boolean;
  isModerator: () => boolean;
  canModerate: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      hasLocationAccess: false,
      accessToken: null,

      setUser: (user) => set({ user, isAuthenticated: true }),

      setAuth: (user: User, accessToken: string | null) => {
        set({ 
          user, 
          accessToken, 
          isAuthenticated: true 
        });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ 
            user: { ...currentUser, ...userData } 
          });
        }
      },

      clearUser: () => set({ user: null, isAuthenticated: false }),

      clearAuth: () => {
        set({ 
          user: null, 
          accessToken: null, 
          isAuthenticated: false 
        });
      },

      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

      setHasLocationAccess: (hasLocationAccess) => set({ hasLocationAccess }),

      hasRole: (role: UserRole): boolean => {
        const user = get().user;
        return user?.role === role;
      },

      hasAnyRole: (roles: UserRole[]): boolean => {
        const user = get().user;
        return user ? roles.includes(user.role) : false;
      },

      isAdmin: (): boolean => {
        return get().hasRole('ADMIN');
      },

      isModerator: (): boolean => {
        return get().hasRole('MODERATOR');
      },

      canModerate: (): boolean => {
        return get().hasAnyRole(['ADMIN', 'MODERATOR']);
      },
    }),
    {
      name: 'event-hive-auth-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        hasLocationAccess: state.hasLocationAccess,
        accessToken: state.accessToken,
      }),
    }
  )
);
