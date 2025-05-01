import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjectFiles, getUserFiles, uploadFile, deleteFile } from "./api";

export const useProjectFiles = (projectId: number) => {
    return useQuery({
        queryKey: ["files", "project", projectId],
        queryFn: () => getProjectFiles(projectId),
        enabled: !!projectId,
    });
};

export const useUserFiles = (userId: number) => {
    return useQuery({
        queryKey: ["files", "user", userId],
        queryFn: () => getUserFiles(userId),
        enabled: !!userId,
    });
};

export const useUploadFile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: uploadFile,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["files", "project", data.projectId]
            });
            queryClient.invalidateQueries({
                queryKey: ["files", "user", data.userId]
            });
        },
    });
};

export const useDeleteFile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteFile,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["files"] });
            queryClient.invalidateQueries({ queryKey: ["files", "project", variables] });
        },
    });
};