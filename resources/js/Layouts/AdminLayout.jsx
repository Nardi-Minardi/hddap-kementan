import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Layout, Menu, Avatar, Dropdown, Typography, Badge, Button } from 'antd';
import {
    DashboardOutlined,
    UserOutlined,
    TeamOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LogoutOutlined,
    SettingOutlined,
    BellOutlined,
    DatabaseOutlined,
    BarChartOutlined,
    ClusterOutlined,
    ShopOutlined,
    ReadOutlined,
    LineChartOutlined,
    TableOutlined,
    HistoryOutlined,
    GlobalOutlined,
    EnvironmentOutlined,
    HomeOutlined,
    BankOutlined,
    UsergroupAddOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export default function AdminLayout({ children, title }) {
    const { auth, url } = usePage().props;
    const user = auth.user;
    const [collapsed, setCollapsed] = useState(false);

    const menuItems = [
        {
            key: '/admin/dashboard',
            icon: <DashboardOutlined />,
            label: <Link href={route('admin.dashboard')}>Dashboard</Link>,
        },
        {
            key: 'wilayah',
            icon: <GlobalOutlined />,
            label: 'Wilayah',
            children: [
                {
                    key: '/admin/provinsi',
                    icon: <GlobalOutlined />,
                    label: <Link href={route('admin.provinsi.index')}>Provinsi</Link>,
                },
                {
                    key: '/admin/kab-kota',
                    icon: <BankOutlined />,
                    label: <Link href={route('admin.kab-kota.index')}>Kab/Kota</Link>,
                },
                {
                    key: '/admin/kecamatan',
                    icon: <EnvironmentOutlined />,
                    label: <Link href={route('admin.kecamatan.index')}>Kecamatan</Link>,
                },
                {
                    key: '/admin/kel-des',
                    icon: <HomeOutlined />,
                    label: <Link href={route('admin.kel-des.index')}>Kel/Desa</Link>,
                },
            ],
        },
        {
            key: 'master',
            icon: <DatabaseOutlined />,
            label: 'Master',
            children: [
                {
                    key: '/admin/users',
                    icon: <UserOutlined />,
                    label: <Link href={route('admin.users.index')}>Users</Link>,
                },
                {
                    key: '/admin/roles',
                    icon: <TeamOutlined />,
                    label: <Link href={route('admin.roles.index')}>Roles</Link>,
                },
                {
                    key: '/admin/kelompok-petani',
                    icon: <UsergroupAddOutlined />,
                    label: <Link href={route('admin.kelompok-petani.index')}>Kelompok Petani</Link>,
                },
                {
                    key: '/admin/petani',
                    icon: <UserOutlined />,
                    label: <Link href={route('admin.petani.index')}>Petani</Link>,
                },
            ],
        },
        {
            key: '/admin/data-verval',
            icon: <BarChartOutlined />,
            label: <Link href={route('admin.data-verval.index')}>Data Verval</Link>,
        },
        {
            key: '/admin/kelembagaan-poktan',
            icon: <ClusterOutlined />,
            label: <Link href={route('admin.kelembagaan-poktan.index')}>Kelembagaan Poktan</Link>,
        },
        {
            key: '/admin/koperasi',
            icon: <ShopOutlined />,
            label: <Link href={route('admin.koperasi.index')}>Koperasi</Link>,
        },
        {
            key: '/admin/bintek',
            icon: <ReadOutlined />,
            label: <Link href={route('admin.bintek.index')}>Bintek</Link>,
        },
        {
            key: '/admin/monev-fisik',
            icon: <LineChartOutlined />,
            label: <Link href={route('admin.monev-fisik.index')}>Monev Fisik</Link>,
        },
        {
            key: '/admin/logframe',
            icon: <TableOutlined />,
            label: <Link href={route('admin.logframe.index')}>Logframe</Link>,
        },
        {
            key: '/admin/activity-log',
            icon: <HistoryOutlined />,
            label: <Link href={route('admin.activity-log.index')}>Activity Log</Link>,
        },
    ];

    const getSelectedKeys = () => {
        const pathname = window.location.pathname;
        if (pathname.startsWith('/admin/users')) return ['/admin/users'];
        if (pathname.startsWith('/admin/roles')) return ['/admin/roles'];
        if (pathname.startsWith('/admin/provinsi')) return ['/admin/provinsi'];
        if (pathname.startsWith('/admin/kab-kota')) return ['/admin/kab-kota'];
        if (pathname.startsWith('/admin/kecamatan')) return ['/admin/kecamatan'];
        if (pathname.startsWith('/admin/kel-des')) return ['/admin/kel-des'];
        if (pathname.startsWith('/admin/kelompok-petani')) return ['/admin/kelompok-petani'];
        if (pathname.startsWith('/admin/petani')) return ['/admin/petani'];
        if (pathname.startsWith('/admin/data-verval')) return ['/admin/data-verval'];
        if (pathname.startsWith('/admin/kelembagaan-poktan')) return ['/admin/kelembagaan-poktan'];
        if (pathname.startsWith('/admin/koperasi')) return ['/admin/koperasi'];
        if (pathname.startsWith('/admin/bintek')) return ['/admin/bintek'];
        if (pathname.startsWith('/admin/monev-fisik')) return ['/admin/monev-fisik'];
        if (pathname.startsWith('/admin/logframe')) return ['/admin/logframe'];
        if (pathname.startsWith('/admin/activity-log')) return ['/admin/activity-log'];
        if (pathname.startsWith('/admin/profile')) return ['/admin/profile'];
        if (pathname.startsWith('/admin/dashboard')) return ['/admin/dashboard'];
        return ['/admin/dashboard'];
    };

    const getOpenKeys = () => {
        const pathname = window.location.pathname;
        if (pathname.startsWith('/admin/provinsi') || pathname.startsWith('/admin/kab-kota') ||
            pathname.startsWith('/admin/kecamatan') || pathname.startsWith('/admin/kel-des')) return ['wilayah'];
        if (pathname.startsWith('/admin/users') || pathname.startsWith('/admin/roles') ||
            pathname.startsWith('/admin/kelompok-petani') ||
            pathname.startsWith('/admin/petani')) return ['master'];
        return [];
    };

    const userMenuItems = [
        {
            key: 'profile',
            icon: <SettingOutlined />,
            label: <Link href={route('admin.profile.edit')}>Profile</Link>,
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
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center justify-center border-b border-slate-700 px-4 py-5 transition hover:bg-slate-800/50"
                >
                    {collapsed ? (
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500">
                            <span className="text-sm font-bold text-white">H</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500">
                                <span className="text-sm font-bold text-white">H</span>
                            </div>
                            <div>
                                <div className="text-sm font-bold leading-tight text-white">HDDAP</div>
                                <div className="text-xs text-slate-400">Admin Panel</div>
                            </div>
                        </div>
                    )}
                </Link>

                <Menu
                    mode="inline"
                    selectedKeys={getSelectedKeys()}
                    defaultOpenKeys={getOpenKeys()}
                    items={menuItems}
                    className="!bg-transparent !border-none mt-2"
                    theme="dark"
                />
            </Sider>

            <Layout>
                {/* Header */}
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

                    <div className="flex items-center gap-4">
                        <Badge count={0} showZero={false}>
                            <Button
                                type="text"
                                icon={<BellOutlined />}
                                className="text-gray-500 hover:text-emerald-600 hover:!bg-emerald-50"
                                size="large"
                            />
                        </Badge>

                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                            <div className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                                <Avatar
                                    size={34}
                                    className="!bg-emerald-500"
                                    icon={<UserOutlined />}
                                />
                                <div className="hidden sm:block">
                                    <div className="text-sm font-medium text-gray-700 leading-tight">{user?.name}</div>
                                    <div className="text-xs text-gray-400 capitalize">{user?.role?.label || 'User'}</div>
                                </div>
                            </div>
                        </Dropdown>
                    </div>
                </Header>

                {/* Content */}
                <Content className="p-6 bg-gray-50 min-h-[calc(100vh-64px)]">
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}
