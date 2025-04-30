import { Outlet } from "react-router";
import { useAuthStore } from "../store/auth.store";
import { message } from "antd";

const FLAuthLayout = () => {
    const { user } = useAuthStore();

    if (user) {
        if (user.role !== 'freelancer') {
            message.warning("Unauthorized access. You do not have permission to view this page.");
            return <div>Unauthorized</div>;
        }
    }

    return <Outlet />;
};

export default FLAuthLayout;
