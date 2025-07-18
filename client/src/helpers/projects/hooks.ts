import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getMyProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    getProjects,
} from "./apis";
import { UpdateProjectInput } from "./types";
import { message } from "antd";

export const useProjects = (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    orderBy?: "ASC" | "DESC";
    minBudget?: number;
    maxBudget?: number;
    startDate?: string;
    endDate?: string;
}) => {
    return useQuery({
        queryKey: ["projects", params],
        queryFn: () => getProjects(params),
    });
}
export const useProject = (id: number) => {
    return useQuery({
        queryKey: ["project", id],
        queryFn: () => getProject(id),
        enabled: !!id,
    });
};

export const useCreateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["client-projects"] });
        },
        onError: (error) => {
            message.error(error.message)
        },
    });
};

export const useUpdateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateProjectInput }) =>
            updateProject(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["client-projects"] });
            queryClient.invalidateQueries({ queryKey: ["project", id] });
        },
        onError: (error) => {
            message.error(error.message)
        },
    });
};

export const useDeleteProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["client-projects"] });
        },
    });
};

export const useMyProjects = () => {
    return useQuery({
        queryKey: ["my-projects"],
        queryFn: () => getMyProjects(),
    });
}