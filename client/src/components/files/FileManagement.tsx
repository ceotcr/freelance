import { Tabs } from "antd";
import { useProjectFiles } from "../../helpers/files/hooks";
import FileList from "./FileList";
import FileUpload from "./FileUploadForm";
import { useAuthStore } from "../../store/auth.store";

interface FileManagementProps {
    projectId: number;
    clientId: number;
    fid?: number;
}

export default function FileManagement({ projectId, clientId, fid }: FileManagementProps) {
    const { user } = useAuthStore();
    const { data: files = [], isLoading, refetch } = useProjectFiles(projectId);

    const clientFiles = files.filter(file => file.user.role === "client");
    const freelancerFiles = files.filter(file => file.user.role === "freelancer");

    return (
        <Tabs
            items={[
                {
                    key: "project-files",
                    label: "Project Files",
                    children: (
                        <>
                            {(user?.role === "client" && user.id == clientId) && (
                                <FileUpload projectId={projectId} onSuccess={refetch} />
                            )}
                            {
                                (user?.id == clientId || user?.id == fid) && (
                                    <FileList
                                        files={clientFiles}
                                        title="Project Documents"
                                        onRefresh={refetch}
                                    />
                                )
                            }
                        </>
                    ),
                },
                {
                    key: "submissions",
                    label: "Submissions",
                    children: (
                        <>
                            {(user?.role === "freelancer" && user.id == fid) && (
                                <FileUpload projectId={projectId} onSuccess={refetch} />
                            )}{
                                (user?.id == clientId || user?.id == fid) && (
                                    <FileList
                                        files={freelancerFiles}
                                        title="Submissions"
                                        onRefresh={refetch}
                                    />
                                )
                            }
                        </>
                    ),
                },
            ]}
        />
    );
}