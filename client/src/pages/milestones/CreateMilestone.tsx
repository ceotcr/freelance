import { useNavigate, useParams } from "react-router";
import { useCreateMilestone } from "../../helpers/milestones/hooks";
import MilestoneForm from "../../components/milestones/MilestoneForm";
import { Card, message } from "antd";

export default function CreateMilestonePage() {
    const { id: projectId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { mutate: createMilestone, isPending } = useCreateMilestone();

    const handleSubmit = (values: any) => {
        createMilestone(
            { ...values, projectId: Number(projectId) },
            {
                onSuccess: () => {
                    message.success("Milestone created successfully");
                    navigate(`/projects/${projectId}`);
                },
                onError: () => {
                    message.error("Failed to create milestone");
                },
            }
        );
    };

    if (!projectId) {
        return <div>Project ID is required</div>;
    }

    return (
        <Card title="Create New Milestone" className="w-full max-w-lg mt-20 mx-auto">
            <MilestoneForm
                projectId={Number(projectId)}
                onSubmit={handleSubmit}
                isSubmitting={isPending}
            />
        </Card>
    );
}