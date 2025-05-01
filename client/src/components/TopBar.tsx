import { Layout, Menu, Avatar, Dropdown, Space, Typography } from 'antd';
import {
    DashboardOutlined,
    ProjectOutlined,
    UserOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuthStore } from '../store/auth.store';
import React from 'react';

const { Header } = Layout;
const { Text } = Typography;

export default function TopBar() {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const { user, logout } = useAuthStore();

    const menuItems = [
        {
            key: '/dashboard',
            icon: <DashboardOutlined />,
            label: <Link to="/dashboard">Dashboard</Link>,
        },
        {
            key: '/projects',
            icon: <ProjectOutlined />,
            label: <Link to="/projects">Projects</Link>,
        },
    ];
    const navigate = useNavigate();
    const profileMenu = (
        <Menu
            items={[
                {
                    key: 'profile',
                    label: <Link to="/profile">Profile</Link>,
                    icon: <UserOutlined />,
                },
                {
                    type: 'divider',
                },
                {
                    key: 'logout',
                    label: 'Logout',
                    danger: true,
                    onClick: async () => {
                        await logout();
                        navigate('/login', { replace: true });
                    },
                },
            ]}
        />
    );

    return (
        <Header
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px',
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                zIndex: 1,
            }}
        >
            <Space size="large">
                {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                    className: 'trigger',
                    onClick: () => setCollapsed(!collapsed),
                })}

                <Menu
                    theme="light"
                    mode="horizontal"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    style={{ flex: 1, minWidth: 0 }}
                />
            </Space>
            {
                user && (
                    <Dropdown overlay={profileMenu} placement="bottomRight">
                        <Space style={{ cursor: 'pointer' }}>
                            <Avatar
                                src={user?.profilePicture}
                                icon={<UserOutlined />}
                                style={{ backgroundColor: '#1890ff' }}
                            />
                            <Text strong>{user?.firstName} {user?.lastName}</Text>
                        </Space>
                    </Dropdown>
                )
            }
        </Header>
    );
}