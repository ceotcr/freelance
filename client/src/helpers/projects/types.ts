import { z } from "zod";

export const ProjectSchema = z.object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
    budget: z.number(),
    postedAt: z.string().datetime(),
    status: z.enum(["pending", "in_progress", "completed"]),
    client: z.object({
        id: z.number(),
        firstName: z.string(),
        lastName: z.string(),
    }),
    assignedTo: z.object({
        id: z.number(),
        firstName: z.string(),
        lastName: z.string(),
        profilePicture: z.string().nullable(),
    }).nullable(),
    bids: z.array(
        z.object({
            id: z.number(),
            amount: z.number(),
            status: z.enum(["pending", "accepted", "rejected"]),
            assignedTo: z.object({
                id: z.number(),
                firstName: z.string(),
                lastName: z.string(),
            }),
            projectId: z.number(),
        })
    ).optional(),
});

export const CreateProjectSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    budget: z.number().min(0, "Budget must be positive"),
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

export type Project = z.infer<typeof ProjectSchema>;
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;