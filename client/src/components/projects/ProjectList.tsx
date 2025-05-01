import { useProjects } from "../../helpers/projects/hooks";
import ProjectCard from "./ProjectCard";
import { Pagination } from "antd";

interface ProjectsListProps {
    params: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'ASC' | 'DESC';
        search?: string;
        status?: string;
        minBudget?: number;
        maxBudget?: number;
        startDate?: string;
        endDate?: string;
    };
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
}

export default function ProjectsList({ params, setPage, setLimit }: ProjectsListProps) {
    const { data, isLoading, error } = useProjects(params);

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(params.limit || 9)].map((_, i) => (
                        <Skeleton key={i} className="h-64 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return <div>Error loading projects</div>;
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data?.data.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>

            {data?.meta && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                    <Pagination
                        current={data.meta.currentPage}
                        pageSize={data.meta.itemsPerPage}
                        total={data.meta.totalItems}
                        onChange={(page, pageSize) => {
                            setPage(page);
                            setLimit(pageSize || 9);
                        }}
                        showSizeChanger
                        pageSizeOptions={['9', '18', '27', '36']}
                    />
                </div>
            )}
        </div>
    );
}

export function Skeleton({ className }: { className?: string }) {
    return (
        <div className={`animate-pulse bg-gray-200 rounded-md ${className}`}>
            <div className="h-full w-full bg-gray-300 rounded-md"></div>
        </div>
    );
}