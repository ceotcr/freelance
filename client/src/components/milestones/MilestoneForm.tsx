import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateMilestoneSchema, UpdateMilestoneSchema } from "../../helpers/milestones/types";
import type { CreateMilestoneInput, UpdateMilestoneInput } from "../../helpers/milestones/types";
import { Form, Input, InputNumber, Button, DatePicker, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { MilestoneStatus } from "../../helpers/milestones/types";
import dayjs from "dayjs";
interface MilestoneFormProps {
    projectId: number;
    defaultValues?: Partial<CreateMilestoneInput>;
    onSubmit: (values: CreateMilestoneInput | UpdateMilestoneInput) => void;
    isSubmitting: boolean;
    isUpdate?: boolean;
}

export default function MilestoneForm({
    projectId,
    defaultValues,
    onSubmit,
    isSubmitting,
    isUpdate = false,
}: MilestoneFormProps) {
    const { control, handleSubmit, formState: { errors } } = useForm<CreateMilestoneInput | UpdateMilestoneInput>({
        resolver: zodResolver(isUpdate ? UpdateMilestoneSchema : CreateMilestoneSchema),
        defaultValues: {
            projectId,
            ...defaultValues,
        },
    });

    return (
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
            <Form.Item
                label="Title"
                validateStatus={errors.title ? "error" : ""}
                help={errors.title?.message}
            >
                <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} placeholder="Milestone title" />
                    )}
                />
            </Form.Item>

            <Form.Item
                label="Description"
                validateStatus={errors.description ? "error" : ""}
                help={errors.description?.message}
            >
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <TextArea
                            {...field}
                            placeholder="Milestone description"
                            rows={4}
                        />
                    )}
                />
            </Form.Item>

            {/* Amount Field */}
            <Form.Item
                label="Amount ($)"
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
                            placeholder="Amount"
                            min={0}
                            step={0.01}
                            onChange={(value) => field.onChange(value)}
                            value={field.value}
                        />
                    )}
                />
            </Form.Item>

            {/* Due Date Field */}
            <Form.Item
                label="Due Date"
                validateStatus={errors.dueDate ? "error" : ""}
                help={errors.dueDate?.message}
            >
                <Controller
                    name="dueDate"
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            style={{ width: "100%" }}
                            value={field.value ? dayjs(field.value) : null}
                            onChange={(date) => field.onChange(date ? dayjs(date).toISOString() : "")}
                        />
                    )}
                />
            </Form.Item>

            {isUpdate && (
                <Form.Item
                    label="Status"
                    validateStatus={errors.status ? "error" : ""}
                    help={errors.status?.message}
                >
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                style={{ width: "100%" }}
                                options={Object.values(MilestoneStatus).map(status => ({
                                    label: status.charAt(0).toUpperCase() + status.slice(1),
                                    value: status,
                                }))}
                            />
                        )}
                    />
                </Form.Item>
            )}

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={isSubmitting}>
                    {isSubmitting ? "Saving..." : isUpdate ? "Update Milestone" : "Create Milestone"}
                </Button>
            </Form.Item>
        </Form>
    );
}