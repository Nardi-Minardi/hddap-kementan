import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { Breadcrumb, Card, Layout, Menu, message } from 'antd';
import {
    ClusterOutlined,
    HomeOutlined,
    UsergroupAddOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { useEffect, useMemo } from 'react';
import { usePermissions } from '@/utils/permissions';
import ClusterTab from './ClusterTab';
import KelompokPetaniTab from './KelompokPetaniTab';
import PetaniTab from './PetaniTab';

const { Sider, Content } = Layout;

const MENU_DEFINITIONS = [
    { key: 'cluster', icon: <ClusterOutlined />, label: 'Kluster Petani', permission: 'cluster.view' },
    { key: 'kelompok-petani', icon: <UsergroupAddOutlined />, label: 'Kelompok Petani', permission: 'kelompok-petani.view' },
    { key: 'petani', icon: <UserOutlined />, label: 'Petani', permission: 'petani.view' },
];

export default function DataPetaniIndex(props) {
    const { tab, flash } = props;
    const { can } = usePermissions();
    const activeTab = tab || 'cluster';

    const menuItems = useMemo(
        () => MENU_DEFINITIONS
            .filter((item) => can(item.permission))
            .map(({ permission, ...item }) => item),
        [can],
    );

    useEffect(() => {
        if (flash?.success) message.success(flash.success);
        if (flash?.error) message.error(flash.error);
    }, [flash]);

    const changeTab = (key) => {
        router.get(route('admin.data-petani.index'), { tab: key }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const renderTab = () => {
        switch (activeTab) {
            case 'kelompok-petani':
                return (
                    <KelompokPetaniTab
                        poktan={props.poktan}
                        provinsis={props.provinsis}
                        kabKotas={props.kabKotas}
                        filters={props.filters ?? {}}
                    />
                );
            case 'petani':
                return (
                    <PetaniTab
                        petanis={props.petanis}
                        filters={props.filters ?? {}}
                        kabKotaOptions={props.kabKotaOptions ?? []}
                    />
                );
            default:
                return (
                    <ClusterTab
                        clusters={props.clusters}
                        provinsis={props.provinsis}
                        kabKotas={props.kabKotas}
                        filters={props.filters ?? {}}
                    />
                );
        }
    };

    return (
        <AdminLayout title="Data Petani">
            <Head title="Data Petani" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: <><UsergroupAddOutlined /> Data Petani</> },
                ]}
            />

            <Card className="overflow-hidden rounded-xl border border-gray-100 p-0 shadow-sm">
                <Layout className="!bg-white">
                    <Sider
                        width={168}
                        className="!border-r !border-black/10 !bg-[#F9E767]"
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
                            items={menuItems}
                            onClick={({ key }) => changeTab(key)}
                            className="data-petani-submenu !border-none !bg-transparent px-1 [&_.ant-menu-item]:!mx-0 [&_.ant-menu-item]:!rounded-md [&_.ant-menu-item]:!px-3 [&_.ant-menu-item]:!text-black [&_.ant-menu-item-icon]:!text-black [&_.ant-menu-item-selected]:!bg-black/10 [&_.ant-menu-item-selected]:!font-semibold [&_.ant-menu-item-selected]:!text-black [&_.ant-menu-item-selected_.ant-menu-item-icon]:!text-black"
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
