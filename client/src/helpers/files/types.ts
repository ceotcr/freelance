import { z } from "zod";

export const FileSchema = z.object({
    id: z.number(),
    fileName: z.string(),
    fileUrl: z.string(),
    userId: z.number(),
    projectId: z.number(),
    createdAt: z.string().datetime(),
    user: z.object({
        id: z.number(),
        firstName: z.string(),
        lastName: z.string(),
        role: z.enum(["client", "freelancer", "admin"]),
    }),
});

export const CreateFileSchema = z.object({
    fileName: z.string().min(1, "File name is required"),
    fileUrl: z.string().min(1, "File URL is required"),
    userId: z.number().min(1, "User ID is required"),
    projectId: z.number().min(1, "Project ID is required"),
});

export type File = z.infer<typeof FileSchema>;
export type CreateFileInput = z.infer<typeof CreateFileSchema>;