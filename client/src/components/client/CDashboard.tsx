import { Card, Col, Row, Statistic, Tabs, TabsProps, Tag, Typography } from "antd";
import ProjectsList from "../projects/ProjectList";
import { useQuery } from "@tanstack/react-query";
import { getMyProjects } from "../../helpers/projects/apis";
import { getBids } from "../../helpers/bids/api";
import { getMilestones } from "../../helpers/milestones/apis";
import { getProjectFiles } from "../../helpers/files/api";
import { useAuthStore } from "../../store/auth.store";
import { DollarOutlined, FileDoneOutlined, FileOutlined, ProjectOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { Milestone } from "../../helpers/milestones/types";
import type { File } from "../../helpers/files/types";
import type { Bid } from "../../helpers/bids/types";
import type { Project } from "../../helpers/projects/types";
import { Link } from "react-router";

const { Title } = Typography;

const CDashboard = () => {
    const { user } = useAuthStore();
    const { data: projects } = useQuery({
        queryKey: ["client-projects"],
        queryFn: () => getMyProjects(),
    });

    const { data: bids } = useQuery({
        queryKey: ["client-bids", projects?.data?.map(p => p.id)],
        queryFn: async () => {
            if (!projects?.data) return [];
            const allBids = await Promise.all(
                projects.data.map(project =>
                    getBids(project.id)
                )
            );
            return allBids.flat();
        },
        enabled: !!projects?.data,
    });

    const { data: milestones } = useQuery({
        queryKey: ["client-milestones", projects?.data?.map(p => p.id)],
        queryFn: async () => {
            if (!projects?.data) return [];
            const allMilestones = await Promise.all(
                projects.data.map(project =>
                    getMilestones(project.id)
                )
            );
            return allMilestones.flat();
        },
        enabled: !!projects?.data,
    });

    const { data: files } = useQuery({
        queryKey: ["client-files", projects?.data?.map(p => p.id)],
        queryFn: async () => {
            if (!projects?.data) return [];
            const allFiles = await Promise.all(
                projects.data.map(project =>
                    getProjectFiles(project.id)
                )
            );
            return allFiles.flat();
        },
        enabled: !!projects?.data,
    });

    const openProjects = projects?.data?.filter((p: Project) => p.status === 'in_progress') || [];
    const pendingBids = bids?.filter((b: Bid) => b.status === 'pending') || [];
    const pendingMilestones = milestones?.filter((m: Milestone) => m.status === 'pending') || [];
    const recentSubmissions = files?.filter((f: File) =>
        f.user.role === 'freelancer' &&
        dayjs(f.createdAt).isAfter(dayjs().subtract(7, 'day'))
    ) || [];

    const stats = [
        {
            title: "Open Projects",
            value: openProjects.length,
            icon: <ProjectOutlined />,
            color: "#1890ff"
        },
        {
            title: "Pending Bids",
            value: pendingBids.length,
            icon: <FileOutlined />,
            color: "#faad14"
        },
        {
            title: "Pending Milestones",
            value: pendingMilestones.length,
            icon: <FileDoneOutlined />,
            color: "#13c2c2"
        },
        {
            title: "New Submissions",
            value: recentSubmissions.length,
            icon: <DollarOutlined />,
            color: "#722ed1"
        }
    ];

    const tabItems: TabsProps['items'] = [
        {
            key: '1',
            label: 'My Projects',
            children: <ProjectsList />,
        },
        {
            key: '2',
            label: `Pending Bids (${pendingBids.length})`,
            children: (
                <div className="space-y-4">
                    {pendingBids.map((bid: Bid) => (
                        <Card key={bid.id}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <Title level={5}>{bid.freelancer.firstName} {bid.freelancer.lastName}</Title>
                                    <p>Project: {projects?.data?.find((p: Project) => p.id === bid.projectId)?.title}</p>
                                    <p>Amount: ${bid.amount.toLocaleString()}</p>
                                </div>
                                <Tag color="orange">Pending Review</Tag>
                            </div>
                        </Card>
                    ))}
                    {pendingBids.length === 0 && <p>No pending bids</p>}
                </div>
            ),
        },
        {
            key: '3',
            label: `Pending Milestones (${pendingMilestones.length})`,
            children: (
                <div className="space-y-4">
                    {pendingMilestones.map((milestone: Milestone) => (
                        <Card key={milestone.id}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <Title level={5}>{milestone.title}</Title>
                                    <p>Project: {projects?.data?.find((p: Project) => p.id === milestone.projectId)?.title}</p>
                                    <p>Amount: ${milestone.amount.toLocaleString()}</p>
                                    {milestone.dueDate && (
                                        <p>Due: {dayjs(milestone.dueDate).format('MMM D, YYYY')}</p>
                                    )}
                                </div>
                                <Tag color="blue">Pending Completion</Tag>
                            </div>
                        </Card>
                    ))}
                    {pendingMilestones.length === 0 && <p>No pending milestones</p>}
                </div>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-6 w-[96%] max-w-[1440px] py-8 mx-auto">
            <div className="flex justify-between items-center mb-4">
                <Title level={2}>Client Dashboard</Title>
                <Link to="/projects" className="ant-btn ant-btn-primary">Go to projects</Link>
            </div>

            <Row gutter={16}>
                {stats.map((stat, index) => (
                    <Col span={6} key={index}>
                        <Card>
                            <Statistic
                                title={stat.title}
                                value={stat.value}
                                prefix={stat.icon}
                                valueStyle={{ color: stat.color }}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>

            <Tabs
                defaultActiveKey="1"
                items={tabItems}
                tabBarStyle={{ marginBottom: 24 }}
            />

            <Card title="Recent Activity">
                <div className="space-y-4">
                    {recentSubmissions.slice(0, 5).map((file: File) => (
                        <div key={file.id} className="flex justify-between items-center p-4 border-b">
                            <div>
                                <p className="font-medium">{file.fileName}</p>
                                <p className="text-sm text-gray-500">
                                    Submitted by {file.user.firstName} {file.user.lastName} on {dayjs(file.createdAt).format('MMM D, YYYY')}
                                </p>
                            </div>
                            <Tag color="green">New</Tag>
                        </div>
                    ))}
                    {recentSubmissions.length === 0 && <p>No recent submissions</p>}
                </div>
            </Card>
        </div>
    );
};

export default CDashboard;