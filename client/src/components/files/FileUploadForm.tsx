import { useState } from "react";
import { Button, Upload, message, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useUploadFile } from "../../helpers/files/hooks";
import type { UploadProps, RcFile } from "antd/es/upload";
import { useAuthStore } from "../../store/auth.store";

interface FileUploadProps {
    projectId: number;
    onSuccess?: () => void;
}

export default function FileUpload({ projectId, onSuccess }: FileUploadProps) {
    const { user } = useAuthStore();
    const { mutate: upload, isPending: isLoading } = useUploadFile();
    const [fileList, setFileList] = useState<RcFile[]>([]);

    const beforeUpload = (file: RcFile) => {
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error("File must be smaller than 10MB!");
            return false;
        }
        return true;
    };

    const handleUpload = () => {
        if (!fileList.length || !user) return;

        const formData = new FormData();
        formData.append("file", fileList[0]);
        formData.append("userId", user.id.toString());
        formData.append("projectId", projectId.toString());

        upload(formData, {
            onSuccess: () => {
                message.success("File uploaded successfully");
                setFileList([]);
                onSuccess?.();
            },
            onError: () => {
                message.error("File upload failed");
            },
        });
    };

    const props: UploadProps = {
        beforeUpload: beforeUpload,
        fileList,
        onChange: ({ fileList }) => {
            setFileList(fileList.map(file => file.originFileObj || file).filter((file): file is RcFile => file instanceof File));
        },
        onRemove: () => {
            setFileList([]);
        },
        maxCount: 1,
    };

    return (
        <Card title="Upload File" bordered={false}>
            <Upload {...props}>
                <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
            <Button
                type="primary"
                onClick={handleUpload}
                disabled={!fileList.length}
                loading={isLoading}
                style={{ marginTop: 16 }}
            >
                {isLoading ? "Uploading..." : "Start Upload"}
            </Button>
        </Card>
    );
}