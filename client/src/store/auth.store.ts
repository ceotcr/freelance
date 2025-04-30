// src/stores/useAuthStore.ts
import { create } from 'zustand';

interface User {
    id: string;
    username: string;
    role: 'admin' | 'client' | 'freelancer';
    email: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    bio?: string;
    skills: {
        id: number; name: string;
    }[];
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    setUser: (user: User) => void;
    setTokens: (accessToken: string, refreshToken: string) => void;
    updateProfile: (data: Partial<User>) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    (set) => ({
        user: null,
        accessToken: null,
        refreshToken: null,
        setUser: (user) => set({ user }),
        setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
        updateProfile: (data) =>
            set((state) => ({
                user: state.user ? { ...state.user, ...data } : null,
            })),
        logout: () => set({ user: null, accessToken: null, refreshToken: null }),
    })
);
