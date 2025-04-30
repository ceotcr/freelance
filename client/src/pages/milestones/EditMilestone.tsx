import { useNavigate, useParams } from "react-router";
import { useMilestone, useUpdateMilestone } from "../../helpers/milestones/hooks";
import MilestoneForm from "../../components/milestones/MilestoneForm";
import { Card, message, Skeleton } from "antd";

export default function EditMilestonePage() {
    const { milestoneId } = useParams<{ milestoneId: string }>();
    const navigate = useNavigate();
    const { data: milestone, isLoading } = useMilestone(Number(milestoneId));
    const { mutate: updateMilestone, isPending } = useUpdateMilestone();

    const handleSubmit = (values: any) => {
        if (!milestoneId) return;

        updateMilestone(
            { id: Number(milestoneId), data: values },
            {
                onSuccess: () => {
                    message.success("Milestone updated successfully");
                    navigate(`/projects/${milestone?.project.id}`);
                },
                onError: () => {
                    message.error("Failed to update milestone");
                },
            }
        );
    };

    if (isLoading) {
        return <Skeleton active />;
    }

    if (!milestone) {
        return <div>Milestone not found</div>;
    }

    return (
        <Card title={`Edit Milestone: ${milestone.title}`} className="w-full max-w-lg mt-20 mx-auto">
            <MilestoneForm
                projectId={milestone.projectId}
                defaultValues={milestone}
                onSubmit={handleSubmit}
                isSubmitting={isPending}
                isUpdate
            />
        </Card>
    );
}