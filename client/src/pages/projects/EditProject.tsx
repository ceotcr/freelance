import { useNavigate, useParams } from "react-router";
import { useProject, useUpdateProject } from "../../helpers/projects/hooks";
import ProjectForm from "../../components/projects/ProjectForm";
import { Card, Typography, Skeleton } from "antd";
import { useAuthStore } from "../../store/auth.store";

const { Title } = Typography;

export default function EditProjectPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore()
    if (user?.role !== 'client') {
        return <div>You are not authorized to edit this project</div>;
    }
    if (!id) {
        return <div>Project ID is required</div>;
    }
    const { data: project, isLoading } = useProject(Number(id));
    const { mutate: updateProject, isPending } = useUpdateProject();

    const handleSubmit = (values: any) => {
        if (!id) return;
        updateProject(
            { id: Number(id), data: values },
            {
                onSuccess: () => {
                    navigate(`/projects/${id}`);
                },
            }
        );
    };

    if (isLoading) {
        return (
            <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem" }}>
                <Card>
                    <Skeleton active paragraph={{ rows: 5 }} />
                </Card>
            </div>
        );
    }

    if (!project) {
        return <div>Project not found</div>;
    }

    if (project.client.id !== user?.id) {
        return <div>You are not authorized to edit this project</div>;
    }

    return (
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem" }}>
            <Card>
                <Title level={3} style={{ marginBottom: "1.5rem" }}>
                    Edit Project
                </Title>
                <ProjectForm
                    defaultValues={project}
                    onSubmit={handleSubmit}
                    isSubmitting={isPending}
                    isUpdate
                />
            </Card>
        </div>
    );
}
