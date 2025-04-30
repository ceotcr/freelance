import { z } from "zod";

export enum MilestoneStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    APPROVED = "approved",
    PAID = "paid"
}

export const MilestoneSchema = z.object({
    id: z.number(),
    title: z.string(),
    description: z.string().optional(),
    amount: z.number().positive(),
    status: z.nativeEnum(MilestoneStatus),
    dueDate: z.string().datetime().optional(),
    projectId: z.number(),
    project: z.object({
        id: z.number(),
        title: z.string(),
    }),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export const CreateMilestoneSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    amount: z.number().positive("Amount must be positive"),
    dueDate: z.string().datetime().optional(),
    projectId: z.number(),
    status: z.nativeEnum(MilestoneStatus).optional(),
});

export const UpdateMilestoneSchema = CreateMilestoneSchema.partial();

export type Milestone = z.infer<typeof MilestoneSchema>;
export type CreateMilestoneInput = z.infer<typeof CreateMilestoneSchema>;
export type UpdateMilestoneInput = z.infer<typeof UpdateMilestoneSchema>;