import { List, Button, Space, Typography, Tag, Card, message } from "antd";
import { DownloadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDeleteFile } from "../../helpers/files/hooks";
import { File } from "../../helpers/files/types";
import { useAuthStore } from "../../store/auth.store";
import { SERVER_URL } from "../../helpers/constants";

interface FileListProps {
    files: File[];
    title: string;
    onRefresh?: () => void;
}

export default function FileList({ files, title, onRefresh }: FileListProps) {
    const { user } = useAuthStore();
    const { mutate: deleteFile } = useDeleteFile();

    const handleDownload = (fileUrl: string, fileName: string) => {
        const link = document.createElement("a");
        link.href = `${SERVER_URL}${fileUrl}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDelete = (fileId: number) => {
        deleteFile(fileId, {
            onSuccess: () => {
                message.success("File deleted successfully");
                onRefresh?.();
            },
            onError: () => {
                message.error("Failed to delete file");
            },
        });
    };

    return (
        <Card title={title} bordered={false}>
            <List
                dataSource={files}
                renderItem={(file) => (
                    <List.Item
                        actions={[
                            <Space key="actions">
                                <Button
                                    icon={<DownloadOutlined />}
                                    onClick={() => handleDownload(file.fileUrl, file.fileName)}
                                >
                                    Download
                                </Button>
                                {(user?.id === file.user.id || user?.role === "admin") && (
                                    <Button
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleDelete(file.id)}
                                    >
                                        Delete
                                    </Button>
                                )}
                            </Space>,
                        ]}
                    >
                        <List.Item.Meta
                            title={file.fileName}
                            description={
                                <Space direction="vertical" size={4}>
                                    <Typography.Text type="secondary">
                                        Uploaded by: {file.user.firstName} {file.user.lastName}
                                    </Typography.Text>
                                    <Tag color={file.user.role === "client" ? "blue" : "green"}>
                                        {file.user.role.toUpperCase()}
                                    </Tag>
                                </Space>
                            }
                        />
                    </List.Item>
                )}
            />
        </Card>
    );
}