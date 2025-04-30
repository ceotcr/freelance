import axios from 'axios';
import { SERVER_URL } from './constants';

const axiosInstance = axios.create({
    baseURL: SERVER_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        const isRefreshCall = originalRequest?.url?.includes('/auth/refresh');
        const isRetry = originalRequest._retry;

        if (error.response?.status === 401 && !isRetry && !isRefreshCall) {
            originalRequest._retry = true;
            try {
                await axios.post(
                    `${SERVER_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error('Refresh token failed:', refreshError);
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject({ error, message: error.response?.data?.message || 'An error occurred' });
    }
);

export default axiosInstance;
