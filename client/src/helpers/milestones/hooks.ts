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
            queryClient.invalidateQueries({ queryKey: ["project", data.projectId] });
        },
    });
};

export const useUpdateMilestone = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateMilestoneInput }) =>
            updateMilestone(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["milestones", data.projectId] });
            queryClient.invalidateQueries({ queryKey: ["milestone", data.id] });
            queryClient.invalidateQueries({ queryKey: ["project", data.projectId] });
        },
    });
};

export const useDeleteMilestone = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteMilestone,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["milestones", variables.projectId] });
            queryClient.invalidateQueries({ queryKey: ["project", variables.projectId] });
        },
    });
};

export const useCompleteMilestone = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: completeMilestone,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["milestones", data.projectId] });
            queryClient.invalidateQueries({ queryKey: ["milestone", data.id] });
            queryClient.invalidateQueries({ queryKey: ["project", data.projectId] });
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