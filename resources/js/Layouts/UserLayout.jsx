import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Layout, Menu, Avatar, Dropdown, Typography, Button } from 'antd';
import {
    DashboardOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LogoutOutlined,
    SettingOutlined,
    UserOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export default function UserLayout({ children, title }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [collapsed, setCollapsed] = useState(false);

    const menuItems = [
        {
            key: '/user/dashboard',
            icon: <DashboardOutlined />,
            label: <Link href={route('user.dashboard')}>Dashboard</Link>,
        },
    ];

    const getSelectedKeys = () => {
        const pathname = window.location.pathname;
        if (pathname.startsWith('/user/dashboard')) {
            return ['/user/dashboard'];
        }
        if (pathname.startsWith('/user/profile')) {
            return [];
        }
        return [];
    };

    const userMenuItems = [
        {
            key: 'profile',
            icon: <SettingOutlined />,
            label: <Link href={route('user.profile.edit')}>Profile</Link>,
        },
        { type: 'divider' },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            danger: true,
            label: (
                <Link href={route('logout')} method="post" as="button">
                    Logout
                </Link>
            ),
        },
    ];

    return (
        <Layout className="min-h-screen">
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                width={240}
                className="!bg-gradient-to-b !from-slate-900 !to-slate-800 shadow-2xl !self-stretch"
                style={{ minHeight: '100vh', height: 'auto' }}
            >
                <Link
                    href="/"
                    className="flex h-16 items-center gap-3 px-4 transition hover:opacity-90"
                >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500">
                        <span className="text-sm font-bold text-white">H</span>
                    </div>
                    {!collapsed && (
                        <div>
                            <p className="text-sm font-bold leading-tight text-white">HDDAP</p>
                            <p className="text-[10px] leading-tight text-slate-400">Portal User</p>
                        </div>
                    )}
                </Link>

                <Menu
                    mode="inline"
                    selectedKeys={getSelectedKeys()}
                    items={menuItems}
                    className="!bg-transparent !border-none mt-2"
                    theme="dark"
                />
            </Sider>

            <Layout>
                <Header className="!bg-white !px-6 flex items-center justify-between shadow-sm border-b border-gray-200 sticky top-0 z-10 h-16">
                    <div className="flex items-center gap-4">
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            className="text-gray-600 hover:text-emerald-600 hover:!bg-emerald-50"
                            size="large"
                        />
                        {title && (
                            <Text className="text-lg font-semibold text-gray-700">{title}</Text>
                        )}
                    </div>

                    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                        <div className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 transition-colors hover:bg-gray-100">
                            <Avatar size={34} className="!bg-emerald-500" icon={<UserOutlined />} />
                            <div className="hidden sm:block">
                                <div className="text-sm font-medium leading-tight text-gray-700">{user?.name}</div>
                                <div className="text-xs capitalize text-gray-400">{user?.role?.label || 'User'}</div>
                            </div>
                        </div>
                    </Dropdown>
                </Header>

                <Content className="min-h-[calc(100vh-64px)] bg-gray-50 p-6">
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}
