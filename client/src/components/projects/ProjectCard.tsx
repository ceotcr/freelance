import { Link } from "react-router";
import { Project } from "../../helpers/projects/types";
import { Card, Tag, Button } from "antd";

interface ProjectCardProps {
    project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    const statusColorMap: Record<string, string> = {
        pending: "default",
        in_progress: "processing",
        completed: "success",
    };

    return (
        <Card
            title={
                <Link to={`/projects/${project.id}`} style={{ fontSize: "16px" }}>
                    {project.title}
                </Link>
            }
            extra={
                <Tag color={statusColorMap[project.status]}>
                    {project.status.replace("_", " ")}
                </Tag>
            }
            style={{ marginBottom: 16 }}
        >
            <p style={{ color: "#888", marginBottom: 12 }}>
                {project.description.length > 120
                    ? `${project.description.slice(0, 120)}...`
                    : project.description}
            </p>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontWeight: 500 }}>${Number(project.budget).toFixed(2)}</span>
                <span style={{ color: "#999" }}>{new Date(project.postedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit", })
                }</span>
            </div>

            <div style={{ textAlign: "right" }}>
                <Link to={`/projects/${project.id}`}>
                    <Button type="primary" size="small">
                        View
                    </Button>
                </Link>
            </div>
        </Card>
    );
}
