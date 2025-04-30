import axiosInstance from "../axios.instance";
import { Milestone, CreateMilestoneInput, UpdateMilestoneInput } from "./types";

export const getMilestones = async (projectId: number): Promise<Milestone[]> => {
    const response = await axiosInstance.get(`/projects/${projectId}/milestones`);
    return response.data;
};

export const getMilestone = async (id: number): Promise<Milestone> => {
    const response = await axiosInstance.get(`/milestones/${id}`);
    return response.data;
};

export const createMilestone = async (data: CreateMilestoneInput): Promise<Milestone> => {
    const response = await axiosInstance.post("/milestones", data);
    return response.data;
};

export const updateMilestone = async (id: number, data: UpdateMilestoneInput): Promise<Milestone> => {
    const response = await axiosInstance.patch(`/milestones/${id}`, data);
    return response.data;
};

export const deleteMilestone = async ({ id }: { id: number, projectId: number }): Promise<void> => {
    await axiosInstance.delete(`/milestones/${id}`);
};

export const completeMilestone = async (id: number): Promise<Milestone> => {
    const response = await axiosInstance.put(`/milestones/${id}/complete`);
    return response.data;
};

export const approveMilestone = async (id: number): Promise<Milestone> => {
    const response = await axiosInstance.put(`/milestones/${id}/approve`);
    return response.data;
};