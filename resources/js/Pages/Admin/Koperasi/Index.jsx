import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Breadcrumb, Typography } from 'antd';
import { HomeOutlined, ShopOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function KoperasiIndex() {
    return (
        <AdminLayout title="Koperasi">
            <Head title="Koperasi" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: <><ShopOutlined /> Koperasi</> },
                ]}
            />

            <Title level={4} className="!text-gray-800">Koperasi</Title>
        </AdminLayout>
    );
}
