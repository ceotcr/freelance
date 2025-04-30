import axiosInstance from "../axios.instance";
import { File } from "./types";

export const getFile = async (id: number): Promise<File> => {
    const response = await axiosInstance.get(`/uploaded-files/${id}`);
    return response.data;
};

export const getProjectFiles = async (projectId: number): Promise<File[]> => {
    const response = await axiosInstance.get(`/projects/${projectId}/files`);
    return response.data;
};

export const getUserFiles = async (userId: number): Promise<File[]> => {
    const response = await axiosInstance.get(`/uploaded-files/user/${userId}`);
    return response.data;
};

export const uploadFile = async (formData: FormData): Promise<File> => {
    const response = await axiosInstance.post("/uploaded-files", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const deleteFile = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/uploaded-files/${id}`);
};