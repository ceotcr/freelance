import axiosInstance from "../axios.instance";
import { Project, CreateProjectInput, UpdateProjectInput } from "./types";

export const getMyProjects = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    orderBy?: "asc" | "desc";
    freelancerId?: number;
}): Promise<{ data: Project[]; count: number }> => {
    const response = await axiosInstance.get("/projects/my-projects", { params });
    return response.data;
};

export const getProject = async (id: number): Promise<Project> => {
    const response = await axiosInstance.get(`/projects/${id}`);
    return response.data;
};

export const createProject = async (data: CreateProjectInput): Promise<Project> => {
    const response = await axiosInstance.post("/projects", data);
    return response.data;
};

export const updateProject = async (id: number, data: UpdateProjectInput): Promise<Project> => {
    const response = await axiosInstance.put(`/projects/${id}`, data);
    return response.data;
};

export const deleteProject = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/projects/${id}`);
};

export const getProjects = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    orderBy?: "ASC" | "DESC";
}): Promise<{
    data: Project[]; count: number, meta:
    {
        currentPage: number;
        itemsPerPage: number;
        totalItems: number;
    };
}> => {
    const response = await axiosInstance.get("/projects", { params });
    return response.data;
}