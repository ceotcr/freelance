import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateBidInput, CreateBidSchema } from "../../helpers/bids/types";
import { Form, InputNumber, Button } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useAuthStore } from "../../store/auth.store";

interface BidFormProps {
    projectId: number;
    defaultValues?: Partial<CreateBidInput>;
    onSubmit: (values: CreateBidInput) => void;
    isSubmitting: boolean;
}

export default function BidForm({
    projectId,
    defaultValues,
    onSubmit,
    isSubmitting,
}: BidFormProps) {
    const { user } = useAuthStore()

    if (!user) {
        return <div>Please log in to submit a bid.</div>;
    }
    const { control, handleSubmit, formState: { errors } } = useForm<CreateBidInput>({
        resolver: zodResolver(CreateBidSchema),
        defaultValues: {
            projectId,
            freelancerId: user.id,
            ...defaultValues,
        },
    });
    return (
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
            <Form.Item
                label="Bid Amount ($)"
                validateStatus={errors.amount ? "error" : ""}
                help={errors.amount?.message}
            >
                <Controller
                    name="amount"
                    control={control}
                    render={({ field }) => (
                        <InputNumber
                            {...field}
                            style={{ width: "100%" }}
                            placeholder="Enter your bid amount"
                            min={0}
                            step={0.01}
                            onChange={(value) => field.onChange(value)}
                            value={field.value}
                        />
                    )}
                />
            </Form.Item>

            <Form.Item
                label="Proposal"
                validateStatus={errors.proposal ? "error" : ""}
                help={errors.proposal?.message}
            >
                <Controller
                    name="proposal"
                    control={control}
                    render={({ field }) => (
                        <TextArea
                            {...field}
                            rows={8}
                            placeholder="Describe your approach, timeline, and why you're the best fit for this project"
                        />
                    )}
                />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Bid"}
                </Button>
            </Form.Item>
        </Form>
    );
}