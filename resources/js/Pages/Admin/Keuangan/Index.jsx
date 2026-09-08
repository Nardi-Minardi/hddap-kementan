import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { Breadcrumb, Card, Layout, Menu, message } from 'antd';
import {
    AccountBookOutlined,
    BarChartOutlined,
    DollarOutlined,
    HomeOutlined,
    ReconciliationOutlined,
    SwapOutlined,
    UnorderedListOutlined,
} from '@ant-design/icons';
import { useEffect } from 'react';
import AwpTab from './AwpTab';
import DashboardTab from './DashboardTab';
import RegisterTab from './RegisterTab';
import RekonsiliasiTab from './RekonsiliasiTab';
import TransaksiTab from './TransaksiTab';

const { Sider, Content } = Layout;

const MENU_ITEMS = [
    { key: 'dashboard', icon: <BarChartOutlined />, label: 'Monitoring' },
    { key: 'awp', icon: <DollarOutlined />, label: 'AWP & Pagu' },
    { key: 'transaksi', icon: <SwapOutlined />, label: 'Realisasi' },
    { key: 'rekonsiliasi', icon: <ReconciliationOutlined />, label: 'Rekonsiliasi' },
    { key: 'register', icon: <UnorderedListOutlined />, label: 'Register Transaksi' },
];

export default function KeuanganIndex({
    tab,
    summary,
    awpMonitoring,
    awpList,
    transaksiList,
    rekonList,
    kodeAkunOptions,
    kodeAkunMap,
    keuanganStruktur,
}) {
    const { flash } = usePage().props;
    const activeTab = tab || 'dashboard';

    useEffect(() => {
        if (flash?.success) message.success(flash.success);
        if (flash?.error) message.error(flash.error);
    }, [flash]);

    const changeTab = (key) => {
        router.get(route('admin.keuangan.index'), { tab: key }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const renderTab = () => {
        switch (activeTab) {
            case 'awp':
                return <AwpTab awpList={awpList} keuanganStruktur={keuanganStruktur} />;
            case 'transaksi':
                return <TransaksiTab awpList={awpList} />;
            case 'rekonsiliasi':
                return <RekonsiliasiTab transaksiList={transaksiList} rekonList={rekonList} />;
            case 'register':
                return <RegisterTab transaksiList={transaksiList} />;
            default:
                return <DashboardTab summary={summary} awpMonitoring={awpMonitoring} />;
        }
    };

    return (
        <AdminLayout title="Input Keuangan">
            <Head title="Input Keuangan" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: <><AccountBookOutlined /> Input Keuangan</> },
                ]}
            />

            <Card className="overflow-hidden rounded-xl border border-gray-100 p-0 shadow-sm">
                <Layout className="!bg-white">
                    <Sider
                        width={168}
                        className="!bg-[#F9E767] !border-r !border-black/10"
                        breakpoint="lg"
                        collapsedWidth={0}
                    >
                        <div className="px-3 py-3 text-[10px] font-semibold uppercase tracking-wide text-black/70">
                            Sub Menu
                        </div>
                        <Menu
                            theme="light"
                            mode="inline"
                            selectedKeys={[activeTab]}
                            items={MENU_ITEMS}
                            onClick={({ key }) => changeTab(key)}
                            className="keuangan-submenu !border-none !bg-transparent px-1 [&_.ant-menu-item]:!mx-0 [&_.ant-menu-item]:!rounded-md [&_.ant-menu-item]:!px-3 [&_.ant-menu-item]:!text-black [&_.ant-menu-item-icon]:!text-black [&_.ant-menu-item-selected]:!bg-black/10 [&_.ant-menu-item-selected]:!font-semibold [&_.ant-menu-item-selected]:!text-black [&_.ant-menu-item-selected_.ant-menu-item-icon]:!text-black"
                        />
                    </Sider>
                    <Content className="min-h-[600px] p-5 md:p-6">
                        {renderTab()}
                    </Content>
                </Layout>
            </Card>
        </AdminLayout>
    );
}
