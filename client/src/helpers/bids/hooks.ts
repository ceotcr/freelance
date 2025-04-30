import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBids, getBid, createBid, acceptBid, deleteBid } from "./api";

export const useBids = (projectId: number) => {
    return useQuery({
        queryKey: ["bids", projectId],
        queryFn: () => getBids(projectId),
        enabled: !!projectId,
    });
};

export const useBid = (id: number) => {
    return useQuery({
        queryKey: ["bid", id],
        queryFn: () => getBid(id),
        enabled: !!id,
    });
};

export const useCreateBid = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createBid,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["bids", data.projectId] });
            queryClient.invalidateQueries({ queryKey: ["project", data.projectId] });
        },
    });
};

export const useAcceptBid = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ projectId, bidId }: { projectId: number; bidId: number }) =>
            acceptBid(projectId, bidId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["bids", data.projectId] });
            queryClient.invalidateQueries({ queryKey: ["project", data.projectId] });
        },
    });
};

export const useDeleteBid = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteBid,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["bids", variables.projectId] });
        },
    });
};