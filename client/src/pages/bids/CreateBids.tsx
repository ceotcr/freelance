import { useNavigate, useParams } from "react-router";
import { useCreateBid } from "../../helpers/bids/hooks";
import BidForm from "../../components/bids/BidForm";
import { Card, message } from "antd";

export default function CreateBidPage() {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const { mutate: createBid, isPending } = useCreateBid();

    const handleSubmit = (values: any) => {
        createBid(
            { ...values, projectId: Number(projectId) },
            {
                onSuccess: () => {
                    message.success("Bid submitted successfully");
                    navigate(`/projects/${projectId}`);
                },
                onError: () => {
                    message.error("Failed to submit bid");
                },
            }
        );
    };

    if (!projectId) {
        return <div>Project ID is required</div>;
    }

    return (
        <Card title="Submit Bid" className="w-full max-w-lg mt-20 mx-auto">
            <BidForm
                projectId={Number(projectId)}
                onSubmit={handleSubmit}
                isSubmitting={isPending}
            />
        </Card>
    );
}