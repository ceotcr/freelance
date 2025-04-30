import axiosInstance from "../axios.instance";
import { Bid } from "../bids/types";
import { Project } from "../projects/types";

export const getMyBids = async (id: number): Promise<Bid[]> => {
    const response = await axiosInstance.post(`/bids/my-bids`, { data: { id } });
    return response.data;
};

export const getActiveProjects = async (): Promise<Project[]> => {
    const response = await axiosInstance.get('/bids/my-bids');
    const activeProjects = response.data.filter((bid: Bid) => bid.status === 'accepted' && bid.project.status === 'in_progress');
    return activeProjects.map((bid: Bid) => bid.project);
};

export const getRecentSubmissions = async (): Promise<File[]> => {
    const response = await axiosInstance.get('/freelancer/submissions');
    return response.data;
};