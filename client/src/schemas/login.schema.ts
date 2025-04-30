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
        id: string;
        username: string;
        role: 'admin' | 'client' | 'user'; // Adjust roles as needed
        email: string;
        firstName: string;
        lastName: string;
    };
}