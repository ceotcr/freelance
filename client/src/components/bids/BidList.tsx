import { List, Card, Button, Empty } from "antd";
import { Bid } from "../../helpers/bids/types";
import BidCard from "./BidCard";
import { PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router";

interface BidListProps {
    bids: Bid[];
    projectId: number;
    isClient: boolean;
    onAccept: (bidId: number) => void;
    onReject: (bidId: number) => void;
    onDelete: (bidId: number) => void;
    loading?: boolean;
}

export default function BidList({
    bids,
    projectId,
    isClient,
    onAccept,
    onReject,
    onDelete,
    loading = false,
}: BidListProps) {
    return (
        <Card
            title="Project Bids"
            extra={
                !isClient && (
                    <Button type="primary" icon={<PlusOutlined />}>
                        <Link to={`/projects/${projectId}/bid`}>Submit Bid</Link>
                    </Button>
                )
            }
            loading={loading}
            className="w-full"
        >
            {bids.length === 0 ? (
                <Empty description="No bids submitted yet">
                    {!isClient && (
                        <Button type="primary">
                            <Link to={`/projects/${projectId}/bid`}>Be the first to bid</Link>
                        </Button>
                    )}
                </Empty>
            ) : (
                <List
                    className="w-full"
                    dataSource={bids}
                    renderItem={(bid) => (
                        <List.Item key={bid.id} className="w-full">
                            <BidCard
                                bid={bid}
                                isClient={isClient}
                                onAccept={onAccept}
                                onReject={onReject}
                                onDelete={onDelete}
                            />
                        </List.Item>
                    )}
                />
            )}
        </Card>
    );
}