import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getMilestones,
    getMilestone,
    createMilestone,
    updateMilestone,
    deleteMilestone,
    completeMilestone,
    approveMilestone,
} from "./apis";
import { UpdateMilestoneInput } from "./types";

export const useMilestones = (projectId: number) => {
    return useQuery({
        queryKey: ["milestones", projectId],
        queryFn: () => getMilestones(projectId),
        enabled: !!projectId,
    });
};

export const useMilestone = (id: number) => {
    return useQuery({
        queryKey: ["milestone", id],
        queryFn: () => getMilestone(id),
        enabled: !!id,
    });
};

export const useCreateMilestone = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createMilestone,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["milestones", data.projectId] });
            queryClient.invalidateQueries({ queryKey: ["milestone", data.id] });
            queryClient.invalidateQueries({ queryKey: ["project", data.projectId] });
            queryClient.invalidateQueries({ queryKey: ["invoices", data.projectId] })
        },
    });
};

export const useUpdateMilestone = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateMilestoneInput }) =>
            updateMilestone(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["milestones"], exact: false });
            queryClient.invalidateQueries({ queryKey: ["milestone"], exact: false });
            queryClient.invalidateQueries({ queryKey: ["project"], exact: false });
        },
    });
};

export const useDeleteMilestone = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteMilestone,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["milestones"], exact: false });
            queryClient.invalidateQueries({ queryKey: ["project"], exact: false });
            queryClient.invalidateQueries({ queryKey: ["invoices"], exact: false });
        },
    });
};

export const useCompleteMilestone = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: completeMilestone,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["milestones"], exact: false });
            queryClient.invalidateQueries({ queryKey: ["project"], exact: false });
            queryClient.invalidateQueries({ queryKey: ["invoices"], exact: false });
            queryClient.invalidateQueries({ queryKey: ["milestone"], exact: false });
        },
    });
};

export const useApproveMilestone = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: approveMilestone,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["milestones", data.projectId] });
            queryClient.invalidateQueries({ queryKey: ["milestone", data.id] });
            queryClient.invalidateQueries({ queryKey: ["project", data.projectId] });
            queryClient.invalidateQueries({ queryKey: ["invoices", data.projectId] });
        },
    });
};