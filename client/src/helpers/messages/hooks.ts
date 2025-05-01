import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../helpers/axios.instance";

export const useMessages = (projectId: number, enabled: boolean) => {
    return useQuery({
        queryKey: ['messages', projectId],
        queryFn: async () => {
            const { data } = await api.get(`/messages/project/${projectId}`);
            return data;
        },
        enabled: enabled,
    });
};

export const useCreateMessage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { content: string; projectId: number }) => {
            const { data } = await api.post('/messages', payload);
            return data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['messages', variables.projectId] });
        },
    });
};