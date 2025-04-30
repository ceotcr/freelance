import { Link, useNavigate, useParams } from "react-router";
import { useProject, useDeleteProject } from "../../helpers/projects/hooks";
import { Button, Card, Typography, Tag, Skeleton, Space, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAuthStore } from "../../store/auth.store";
import MilestoneList from "../../components/milestones/MileStoneList";
import { useMilestones, useDeleteMilestone, useCompleteMilestone, useApproveMilestone } from "../../helpers/milestones/hooks";
import { useBids, useAcceptBid, useDeleteBid } from "../../helpers/bids/hooks";
import BidList from "../../components/bids/BidList";
import FileManagement from "../../components/files/FileManagement";

const { Title, Text } = Typography;

export default function ProjectDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: project, isLoading } = useProject(Number(id));
    const { mutate: deleteProject } = useDeleteProject();
    const { user } = useAuthStore()
    const { data: milestones, isLoading: milestonesLoading } = useMilestones(Number(id));
    const deleteMilestone = useDeleteMilestone();
    const completeMilestone = useCompleteMilestone();
    const approveMilestone = useApproveMilestone();
    const handleDeleteMileStone = (milestoneId: number) => {
        deleteMilestone.mutate({ id: milestoneId, projectId: Number(id) }, {
            onSuccess: () => {
                message.success("Milestone deleted successfully");
            },
            onError: () => {
                message.error("Failed to delete milestone");
            },
        });
    };

    const handleComplete = (milestoneId: number) => {
        completeMilestone.mutate(milestoneId, {
            onSuccess: () => {
                message.success("Milestone marked as completed");
            },
            onError: () => {
                message.error("Failed to complete milestone");
            },
        });
    };

    const handleApprove = (milestoneId: number) => {
        approveMilestone.mutate(milestoneId, {
            onSuccess: () => {
                message.success("Milestone approved");
            },
            onError: () => {
                message.error("Failed to approve milestone");
            },
        });
    };

    const handleDelete = () => {
        if (!id) return;
        deleteProject(Number(id), {
            onSuccess: () => {
                message.success("Project deleted");
                navigate("/projects");
            },
        });
    };

    const statusColor = {
        pending: "default",
        in_progress: "processing",
        completed: "success",
    } as const;

    const { data: bids, isLoading: bidsLoading } = useBids(Number(id));
    const acceptBid = useAcceptBid();
    const deleteBid = useDeleteBid();

    const handleAccept = (bidId: number) => {
        if (!id) return;
        acceptBid.mutate(
            { projectId: Number(id), bidId },
            {
                onSuccess: () => {
                    message.success("Bid accepted successfully");
                },
                onError: () => {
                    message.error("Failed to accept bid");
                },
            }
        );
    };

    const handleReject = (bidId: number) => {
        message.info("Reject functionality to be implemented");
    };

    const handleBidsDelete = (bidId: number) => {
        deleteBid.mutate({ id: bidId, projectId: Number(id) }, {
            onSuccess: () => {
                message.success("Bid deleted successfully");
            },
            onError: () => {
                message.error("Failed to delete bid");
            },
        });
    };

    if (isLoading || bidsLoading) {
        return (
            <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem" }}>
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    <Skeleton.Input active size="large" style={{ width: 300 }} />
                    <Skeleton.Button active style={{ width: 120 }} />
                    <Skeleton active paragraph={{ rows: 4 }} />
                </Space>
            </div>
        );
    }

    if (!project) {
        return <div>Project not found</div>;
    }

    return (
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <Title level={2} style={{ margin: 0 }}>{project.title}</Title>
                {
                    project.client.id === user?.id && (
                        <Space>
                            <Button icon={<EditOutlined />} onClick={() => navigate(`/projects/${id}/edit`)}>
                                Edit
                            </Button>
                            <Button icon={<DeleteOutlined />} danger onClick={handleDelete}>
                                Delete
                            </Button>
                        </Space>
                    )
                }
            </div>

            <Card>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                    <Tag color={statusColor[project.status]} style={{ textTransform: "capitalize" }}>
                        {project.status.replace("_", " ")}
                    </Tag>
                    <Text type="secondary">{new Date(project.postedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit", })}</Text>
                </div>
                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                    <div>
                        <Text strong>Budget</Text>
                        <br />
                        <Text>${Number(project.budget).toFixed(2)}</Text>
                    </div>
                    <div>
                        <Text strong>Description</Text>
                        <br />
                        <Text type="secondary">{project.description}</Text>
                    </div>
                    <div>
                        <Text strong>Client</Text>
                        <br />
                        <Text>{project.client.firstName} {project.client.lastName}</Text>
                    </div>
                </Space>
            </Card>
            <Space direction="vertical" size="middle" className="w-full mt-4">
                <Button type="primary" className="float-right">
                    <Link to={`/projects/${id}/milestones/create`}>Add Milestone</Link>
                </Button>

                <MilestoneList
                    milestones={milestones || []}
                    projectId={Number(id)}
                    onEdit={(milestone) => navigate(`/milestones/${milestone.id}/edit`)}
                    onDelete={handleDeleteMileStone}
                    onComplete={handleComplete}
                    onApprove={handleApprove}
                    isClient={user?.role == "client"}
                    loading={milestonesLoading}
                    clientId={project.client.id}
                    fid={project.freelancer?.id}
                />
                <BidList
                    bids={bids || []}
                    projectId={Number(id)}
                    isClient={user?.role == "client"}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    onDelete={handleBidsDelete}
                    loading={bidsLoading}
                />

                <Card title="Project Files Management">
                    <FileManagement projectId={Number(id)} />
                </Card>
            </Space>
        </div>
    );
}
