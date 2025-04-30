import { z } from "zod";

export enum BidStatus {
    PENDING = "pending",
    ACCEPTED = "accepted",
    REJECTED = "rejected"
}

export const BidSchema = z.object({
    id: z.number(),
    amount: z.number().positive(),
    proposal: z.string(),
    status: z.nativeEnum(BidStatus),
    createdAt: z.string().datetime(),
    freelancer: z.object({
        id: z.number(),
        firstName: z.string(),
        lastName: z.string(),
        profilePicture: z.string().nullable(),
        rating: z.number().optional(),
    }),
    projectId: z.number(),
});

export const CreateBidSchema = z.object({
    amount: z.number().positive("Amount must be positive"),
    proposal: z.string().min(10, "Proposal must be at least 10 characters"),
    projectId: z.number(),
    freelancerId: z.number().optional(),
});

export type Bid = z.infer<typeof BidSchema>;
export type CreateBidInput = z.infer<typeof CreateBidSchema>;