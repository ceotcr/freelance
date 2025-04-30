import { Outlet, useNavigate } from "react-router";
import { useAuthStore } from "../store/auth.store";
import { useEffect, useState } from "react";
import axiosInstance from "../helpers/axios.instance";
import { IUser } from "../interfaces/user";
import { message } from "antd";

const MainLayout = () => {
    const { user, setUser } = useAuthStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            axiosInstance
                .get('/auth/me')
                .then((res) => {
                    if (res?.data) {
                        setUser(res.data as IUser);
                    } else {
                        throw new Error("User not found");
                    }
                })
                .catch(() => {
                    message.warning("Session expired. Please log in again.");
                    navigate("/login");
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) return <div>Loading...</div>;

    return <Outlet />;
};

export default MainLayout;
