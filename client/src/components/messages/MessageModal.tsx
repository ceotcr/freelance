import { Modal, List, Avatar, Form, Input, Button, message as antMessage } from "antd";
import { useMessages, useCreateMessage } from "../../helpers/messages/hooks";
import { useAuthStore } from "../../store/auth.store";
import { UserOutlined } from "@ant-design/icons";
import { useState } from "react";

interface MessageModalProps {
    projectId: number;
    clientId: number;
    freelancerId?: number;
    open: boolean;
    onCancel: () => void;
}

export default function MessageModal({ projectId, clientId, freelancerId, open, onCancel }: MessageModalProps) {
    const { user } = useAuthStore();
    const { data: messages, isLoading } = useMessages(projectId, open);
    const { mutate: createMessage } = useCreateMessage();
    const [form] = Form.useForm();

    const handleSubmit = (values: { content: string }) => {
        if (!values.content.trim()) return;

        createMessage(
            { content: values.content, projectId },
            {
                onSuccess: () => {
                    form.resetFields();
                },
                onError: () => {
                    antMessage.error("Failed to send message");
                },
            }
        );
    };

    return (
        <Modal
            title="Project Messages"
            open={open}
            onCancel={onCancel}
            footer={null}
            width={800}
        >
            <div style={{ maxHeight: "60vh", overflowY: "auto", marginBottom: 16 }}>
                <List
                    loading={isLoading}
                    dataSource={messages || []}
                    renderItem={(msg: any) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        icon={<UserOutlined />}
                                        src={msg.sender?.avatar}
                                    />
                                }
                                title={`${msg.sender?.firstName} ${msg.sender?.lastName}`}
                                description={msg.content}
                            />
                            <div style={{ color: "gray", fontSize: 12 }}>
                                {new Date(msg.sentAt).toLocaleString()}
                            </div>
                        </List.Item>
                    )}
                />
            </div>

            <Form form={form} onFinish={handleSubmit}>
                <Form.Item name="content" rules={[{ required: true, message: "Message cannot be empty" }]}>
                    <Input.TextArea rows={3} placeholder="Type your message here..." />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Send
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}