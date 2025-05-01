import { Card, Col, Row, Statistic, Tabs, TabsProps, Tag, Typography, List } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../store/auth.store";
import { DollarOutlined, FileOutlined, ProjectOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { Milestone } from "../../helpers/milestones/types";
import type { File } from "../../helpers/files/types";
import type { Bid } from "../../helpers/bids/types";
import type { Project } from "../../helpers/projects/types";
import { getProjectFiles } from "../../helpers/files/api";
import { getMilestones } from "../../helpers/milestones/apis";
import { getMyProjects } from "../../helpers/projects/apis";
import { getMyBids } from "../../helpers/freelancer/api";
import { Link } from "react-router";

const { Title, Text } = Typography;

const FreelancerDashboard = () => {
    const { user } = useAuthStore();

    const { data: activeProjects } = useQuery({
        queryKey: ["freelancer-projects", user?.id],
        queryFn: async () => {
            const projects = (await getMyBids()).map((bid: Bid) => bid.status === 'accepted' ? bid.project : null);
            return projects
                .filter((project): project is NonNullable<typeof project> => project !== null)
                .map((project) => ({
                    ...project,
                    client: { id: project.clientId, firstName: '', lastName: '' },
                    assignedTo: null,
                    postedAt: project.createdAt,
                    bids: [],
                })) as Project[];
        },
        enabled: !!user?.id,
    });

    const { data: myBids } = useQuery({
        queryKey: ["freelancer-bids", user?.id],
        queryFn: async () => {
            if (!user?.id) return [];
            const bids = await getMyBids();
            return bids
        },
        enabled: !!user?.id,
    });

    const { data: myMilestones } = useQuery({
        queryKey: ["freelancer-milestones", activeProjects?.map(p => p.id)],
        queryFn: async () => {
            if (!activeProjects) return [];
            const allMilestones = await Promise.all(
                activeProjects.map((project: Project) => getMilestones(project.id))
            );
            return allMilestones.flat();
        },
        enabled: !!activeProjects?.length,
    });

    const activeProjectsCount = activeProjects?.length || 0;
    const Bids = myBids?.filter((b: Bid) => b.status === 'pending') || [];


    const Payments = myMilestones?.filter((m: Milestone) =>
        m.status === 'paid'
    ).reduce((sum: number, m: Milestone) => sum + m.amount, 0) || 0;

    const stats = [
        {
            title: "Active Projects",
            value: activeProjectsCount,
            icon: <ProjectOutlined />,
            color: "#1890ff",
            tooltip: "Projects you're currently working on"
        },
        {
            title: " Bids",
            value: Bids.length,
            icon: <FileOutlined />,
            color: "#faad14",
            tooltip: "Bids awaiting client response"
        },
        {
            title: " Milestones",
            value: myMilestones?.filter((m: Milestone) => m.status === 'pending').length || 0,
            icon: <ClockCircleOutlined />,
            color: "#13c2c2",
            tooltip: "Milestones needing action or approval"
        },
        {
            title: " Payment Received",
            value: Payments,
            icon: <DollarOutlined />,
            color: "#722ed1",
            prefix: "$",
            tooltip: "Approved work awaiting payment"
        }
    ];

    const tabItems: TabsProps['items'] = [
        {
            key: '1',
            label: 'Active Projects',
            children: (
                <List
                    dataSource={activeProjects}
                    renderItem={(project: Project) => (
                        <List.Item>
                            <Card title={project.title}>
                                <div className="flex justify-between">
                                    <div>
                                        <p>{project.description}</p>
                                        <Text type="secondary">
                                            Budget: ${project.budget.toLocaleString()}
                                        </Text>
                                    </div>
                                    <Tag color="blue" className="h-fit ml-2">In Progress</Tag>
                                </div>
                            </Card>
                        </List.Item>
                    )}
                />
            ),
        },
        {
            key: '2',
            label: `My Bids (${myBids?.length || 0})`,
            children: (
                <div className="space-y-4">
                    {myBids?.map((bid: Bid) => (
                        <Card key={bid.id}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <Title level={5}>{bid.project.title}</Title>
                                    <p>Amount: ${bid.amount.toLocaleString()}</p>
                                    <p>Proposal: {bid.proposal.substring(0, 100)}...</p>
                                </div>
                                <Tag color={
                                    bid.status === 'accepted' ? 'green' :
                                        bid.status === 'rejected' ? 'red' : 'orange'
                                }>
                                    {bid.status.toUpperCase()}
                                </Tag>
                            </div>
                        </Card>
                    ))}
                    {myBids?.length === 0 && <p>No bids submitted yet</p>}
                </div>
            ),
        },
        {
            key: '3',
            label: `My Milestones (${myMilestones?.length || 0})`,
            children: (
                <div className="space-y-4">
                    {myMilestones?.map((milestone: Milestone) => (
                        <Card key={milestone.id}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <Title level={5}>{milestone.title}</Title>
                                    <p>Project: {milestone.project.title}</p>
                                    <p>Amount: ${milestone.amount.toLocaleString()}</p>
                                    {milestone.dueDate && (
                                        <p>Due: {dayjs(milestone.dueDate).format('MMM D, YYYY')}</p>
                                    )}
                                </div>
                                <Tag color={
                                    milestone.status === 'approved' ? 'green' :
                                        milestone.status === 'completed' ? 'orange' :
                                            milestone.status === 'paid' ? 'purple' : 'blue'
                                }>
                                    {milestone.status.toUpperCase()}
                                </Tag>
                            </div>
                        </Card>
                    ))}
                    {myMilestones?.length === 0 && <p>No milestones yet</p>}
                </div>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-6 w-[96%] max-w-[1440px] py-8 mx-auto">
            <div className="flex justify-between items-center mb-4">
                <Title level={2}>Freelancer Dashboard</Title>
                <Link to="/projects" className="ant-btn ant-btn-primary">Go to projects</Link>
            </div>

            <Row gutter={16}>
                {stats.map((stat, index) => (
                    <Col span={6} key={index}>
                        <Card>
                            <Statistic
                                title={stat.title}
                                value={stat.value}
                                prefix={stat.prefix || stat.icon}
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

        </div>
    );
};

export default FreelancerDashboard;