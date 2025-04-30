import { useNavigate } from "react-router";
import { useCreateProject } from "../../helpers/projects/hooks";
import ProjectForm from "../../components/projects/ProjectForm";
import { Card, Typography } from "antd";

const { Title } = Typography;

export default function CreateProjectPage() {
    const navigate = useNavigate();
    const { mutate: createProject, isPending } = useCreateProject();

    const handleSubmit = (values: any) => {
        createProject(values, {
            onSuccess: () => {
                navigate("/projects");
            },
        });
    };

    return (
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem" }}>
            <Card>
                <Title level={3} style={{ marginBottom: "1.5rem" }}>
                    Create New Project
                </Title>
                <ProjectForm onSubmit={handleSubmit} isSubmitting={isPending} />
            </Card>
        </div>
    );
}
