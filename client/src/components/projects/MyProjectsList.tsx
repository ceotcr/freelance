import { useMyProjects } from "../../helpers/projects/hooks";
import ProjectCard from "./ProjectCard";

export default function MyProjectsList() {
    const { data, isLoading, error } = useMyProjects();

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-48" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
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