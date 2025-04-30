import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateProjectSchema, UpdateProjectSchema } from "../../helpers/projects/types";
import type { CreateProjectInput, UpdateProjectInput } from "../../helpers/projects/types";
import { Form, Input, InputNumber, Button } from "antd";
import TextArea from "antd/es/input/TextArea";

interface ProjectFormProps {
    defaultValues?: Partial<CreateProjectInput>;
    onSubmit: (values: CreateProjectInput | UpdateProjectInput) => void;
    isSubmitting: boolean;
    isUpdate?: boolean;
}

export default function ProjectForm({
    defaultValues,
    onSubmit,
    isSubmitting,
    isUpdate = false,
}: ProjectFormProps) {
    const { control, handleSubmit, formState: { errors } } = useForm<CreateProjectInput | UpdateProjectInput>({
        resolver: zodResolver(isUpdate ? UpdateProjectSchema : CreateProjectSchema),
        defaultValues: defaultValues ? { ...defaultValues, budget: Number(defaultValues.budget) } : {
            title: "",
            description: "",
            budget: 0,
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
                        <Input {...field} placeholder="Project title" />
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
                            placeholder="Project description"
                            rows={5}
                        />
                    )}
                />
            </Form.Item>

            <Form.Item
                label="Budget ($)"
                validateStatus={errors.budget ? "error" : ""}
                help={errors.budget?.message}
            >
                <Controller
                    name="budget"
                    control={control}
                    render={({ field }) => (
                        <InputNumber
                            {...field}
                            style={{ width: "100%" }}
                            placeholder="Project budget"
                            min={0}
                            step={0.01}
                            onChange={(value) => field.onChange(value)}
                            value={field.value}
                        />
                    )}
                />
            </Form.Item>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                >
                    {isSubmitting ? "Saving..." : isUpdate ? "Update Project" : "Create Project"}
                </Button>
            </Form.Item>
        </Form>
    );
}