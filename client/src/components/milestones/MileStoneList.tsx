import { useState } from "react";
import { Card, List, Tag, Button, Space, Typography, Divider, Modal, Descriptions } from "antd";
import { Milestone, MilestoneStatus } from "../../helpers/milestones/types";
import { CheckOutlined, DollarOutlined, EditOutlined, DeleteOutlined, FileTextOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useAuthStore } from "../../store/auth.store";

interface MilestoneListProps {
    milestones: Milestone[];
    projectId: number;
    onEdit: (milestone: Milestone) => void;
    onDelete: (id: number) => void;
    onComplete: (id: number) => void;
    onApprove: (id: number) => void;
    isClient: boolean;
    loading?: boolean;
    clientId: number;
    fid?: number;
}

const statusColors: Record<MilestoneStatus, string> = {
    [MilestoneStatus.PENDING]: "blue",
    [MilestoneStatus.COMPLETED]: "orange",
    [MilestoneStatus.APPROVED]: "green",
    [MilestoneStatus.PAID]: "purple",
};

interface Invoice {
    id: number;
    amount: number;
    status: string;
    paymentMethod?: string;
    paidAt?: string;
    transactionId?: string;
}

export default function MilestoneList({
    milestones,
    onEdit,
    onDelete,
    onComplete,
    onApprove,
    isClient,
    loading = false,
    clientId,
    fid
}: MilestoneListProps) {
    const { user } = useAuthStore();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);

    const fetchInvoiceData = (milestoneId: number): Invoice => {
        return {
            id: 1,
            amount: milestones.find(m => m.id === milestoneId)?.amount || 0,
            status: "paid",
            paymentMethod: "Credit Card",
            paidAt: dayjs().subtract(1, 'day').toISOString(),
            transactionId: "TRX-" + Math.random().toString(36).substring(2, 10).toUpperCase()
        };
    };

    const showInvoiceModal = (milestoneId: number) => {
        const invoiceData = fetchInvoiceData(milestoneId);
        setCurrentInvoice(invoiceData);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            <Card title="Project Milestones" loading={loading}>
                <List
                    className="w-full"
                    itemLayout="vertical"
                    dataSource={milestones}
                    renderItem={(milestone) => (
                        <List.Item
                            key={milestone.id}
                            className="w-full"
                            actions={[
                                <Space key="actions" className="w-full justify-between"
                                    split={<Divider type="vertical" />}>
                                    {!isClient && milestone.status === MilestoneStatus.PENDING && (user?.id == fid) && (
                                        <Button
                                            icon={<CheckOutlined />}
                                            onClick={() => onComplete(milestone.id)}
                                        >
                                            Mark Complete
                                        </Button>
                                    )}
                                    {isClient && milestone.status === MilestoneStatus.COMPLETED && (
                                        <Button
                                            type="primary"
                                            icon={<CheckOutlined />}
                                            onClick={() => onApprove(milestone.id)}
                                        >
                                            Approve
                                        </Button>
                                    )}
                                    {milestone.status === MilestoneStatus.PAID && (
                                        <Button
                                            type="default"
                                            icon={<FileTextOutlined />}
                                            onClick={() => showInvoiceModal(milestone.id)}
                                        >
                                            View Invoice
                                        </Button>
                                    )}
                                    {
                                        user?.id == clientId && (
                                            <>
                                                <Button
                                                    icon={<EditOutlined />}
                                                    onClick={() => onEdit(milestone)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => onDelete(milestone.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </>
                                        )
                                    }
                                </Space>,
                            ]}
                        >
                            <List.Item.Meta
                                className="w-full"
                                title={
                                    <Space className="w-full justify-between" >
                                        <Typography.Text strong>{milestone.title}</Typography.Text>
                                        <Tag color={statusColors[milestone.status]}>
                                            {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                                        </Tag>
                                    </Space>
                                }
                                description={
                                    <Space direction="vertical" size={4} className="w-full justify-between">
                                        {milestone.description && (
                                            <Typography.Paragraph ellipsis={{ rows: 2 }}>
                                                {milestone.description}
                                            </Typography.Paragraph>
                                        )}
                                        <Space className="w-full">
                                            <DollarOutlined />
                                            <Typography.Text strong className="mr-auto">
                                                {milestone.amount.toLocaleString("en-US", {
                                                    style: "currency",
                                                    currency: "USD",
                                                })}
                                            </Typography.Text>
                                            {milestone.dueDate && (
                                                <>
                                                    <Typography.Text type="secondary" className="ml-auto">
                                                        Due: {dayjs(milestone.dueDate).format("MMM D, YYYY")}
                                                    </Typography.Text>
                                                </>
                                            )}
                                        </Space>
                                    </Space>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Card>

            {/* Invoice Modal */}
            <Modal
                title="Invoice Details"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="close" onClick={handleCancel}>
                        Close
                    </Button>
                ]}
                width={700}
            >
                {currentInvoice && (
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Invoice ID">{currentInvoice.id}</Descriptions.Item>
                        <Descriptions.Item label="Amount">
                            {currentInvoice.amount.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                            })}
                        </Descriptions.Item>
                        <Descriptions.Item label="Status">
                            <Tag color={currentInvoice.status === "paid" ? "green" : "orange"}>
                                {currentInvoice.status.toUpperCase()}
                            </Tag>
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </>
    );
}