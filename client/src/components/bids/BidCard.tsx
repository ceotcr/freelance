import { Card, Avatar, Tag, Button, Typography, Divider, Rate } from "antd";
import { Bid, BidStatus } from "../../helpers/bids/types";
import { UserOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const statusColors: Record<BidStatus, string> = {
    [BidStatus.PENDING]: "blue",
    [BidStatus.ACCEPTED]: "green",
    [BidStatus.REJECTED]: "red",
};

interface BidCardProps {
    bid: Bid;
    isClient: boolean;
    onAccept?: (bidId: number) => void;
    onReject?: (bidId: number) => void;
    onDelete?: (bidId: number) => void;
}

export default function BidCard({
    bid,
    isClient,
    onAccept,
    onReject,
    onDelete
}: BidCardProps) {
    return (
        <Card className="w-full" loading={!bid}>
            <div className="flex justify-between w-full items-start">
                <div className="flex items-center gap-4">
                    <Avatar
                        size={64}
                        src={bid.freelancer.profilePicture}
                        icon={<UserOutlined />}
                    />
                    <div>
                        <Typography.Title level={5} className="mb-1">
                            {bid.freelancer.firstName} {bid.freelancer.lastName}
                        </Typography.Title>
                    </div>
                </div>

                <Tag color={statusColors[bid.status]}>
                    {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                </Tag>
            </div>

            <Divider className="my-4" />

            <Typography.Paragraph>
                {bid.proposal}
            </Typography.Paragraph>

            <div className="flex justify-between items-center mt-4">
                <Typography.Text strong className="text-lg">
                    ${bid.amount.toLocaleString("en-US")}
                </Typography.Text>

                <Typography.Text type="secondary">
                    Submitted: {dayjs(bid.createdAt).format("MMM D, YYYY")}
                </Typography.Text>
            </div>

            {isClient && bid.status === BidStatus.PENDING && (
                <div className="flex justify-end gap-2 mt-4">
                    <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        onClick={() => onAccept?.(bid.id)}
                    >
                        Accept
                    </Button>
                    <Button
                        danger
                        icon={<CloseOutlined />}
                        onClick={() => onReject?.(bid.id)}
                    >
                        Reject
                    </Button>
                </div>
            )}

            {!isClient && (
                <div className="flex justify-end mt-4">
                    <Button
                        danger
                        onClick={() => onDelete?.(bid.id)}
                    >
                        Delete Bid
                    </Button>
                </div>
            )}
        </Card>
    );
}