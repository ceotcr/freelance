import { Button, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import ProjectsList from "../../components/projects/ProjectList";
import { useAuthStore } from "../../store/auth.store";

const { Title } = Typography;

export default function ProjectsPage() {
    const navigate = useNavigate();
    const { user } = useAuthStore()
    return (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <Title level={2} style={{ margin: 0 }}>Projects</Title>
                {
                    user?.role === "client" && (
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/projects/create")}>
                            New Project
                        </Button>
                    )
                }
            </div>
            <ProjectsList />
        </div>
    );
}
