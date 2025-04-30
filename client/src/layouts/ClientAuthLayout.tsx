import { Outlet } from "react-router";
import { useAuthStore } from "../store/auth.store";
import { message } from "antd";

const ClientAuthLayout = () => {
    const { user } = useAuthStore();

    if (user) {
        if (user.role !== 'client') {
            message.warning("Unauthorized access. You do not have permission to view this page.");
            return <div>Unauthorized</div>;
        }
    }

    return <Outlet />;
};

export default ClientAuthLayout;
