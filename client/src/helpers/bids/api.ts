import axiosInstance from "../axios.instance";
import { Bid, CreateBidInput } from "./types";

export const getBids = async (projectId: number): Promise<Bid[]> => {
    const response = await axiosInstance.get(`/projects/${projectId}/bids`);
    return response.data;
};

export const getBid = async (id: number): Promise<Bid> => {
    const response = await axiosInstance.get(`/bids/${id}`);
    return response.data;
};

export const createBid = async (data: CreateBidInput): Promise<Bid> => {
    const response = await axiosInstance.post("/bids", data);
    return response.data;
};

export const acceptBid = async (projectId: number, bidId: number): Promise<Bid> => {
    const response = await axiosInstance.post(`/projects/${projectId}/assign/${bidId}`);
    return response.data;
};

export const deleteBid = async ({ id, }: { id: number, projectId: number }): Promise<void> => {
    await axiosInstance.delete(`/bids/${id}`);
};