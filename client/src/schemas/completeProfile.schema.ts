// src/schemas/completeProfile.schema.ts
import { z } from 'zod';

export const completeProfileSchema = z.object({
    profilePicture: z
        .instanceof(File)
        .refine((file) => file.size <= 5 * 1024 * 1024, {
            message: 'Max file size is 5MB.',
        })
        .refine(
            (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
            {
                message: 'Only JPEG, PNG, and WEBP formats are supported.',
            }
        ),
    bio: z.string().min(10, { message: 'Bio must be at least 10 characters.' }),
});

export type CompleteProfileInput = z.infer<typeof completeProfileSchema>;
