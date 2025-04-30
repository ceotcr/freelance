import { z } from 'zod';

export const loginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export type LoginResponse = {
    accessToken: string;
    refreshToken: string;
    user: {
        id: number;
        username: string;
        role: 'admin' | 'client' | 'freelancer';
        email: string;
        firstName: string;
        lastName: string;
        bio?: string;
        profilePicture?: string;
        skills: { id: number; name: string }[];
    };
}