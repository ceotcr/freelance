import axiosInstance from "../axios.instance";
import { Bid } from "../bids/types";
import { Project } from "../projects/types";

export const getMyBids = async (): Promise<Bid[]> => {
    const response = await axiosInstance.get(`/bids/my-bids`);
    return response.data;
};

export const getActiveProjects = async (): Promise<Project[]> => {
    const response = await axiosInstance.get('/projects/freelancer-projects');
    const filteredProjects = response.data.filter((project: Project) => project.status === 'in_progress');
    return filteredProjects;
};

export const getRecentSubmissions = async (): Promise<File[]> => {
    const response = await axiosInstance.get('/freelancer/submissions');
    return response.data;
};