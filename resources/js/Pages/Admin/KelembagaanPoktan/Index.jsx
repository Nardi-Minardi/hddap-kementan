import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Breadcrumb, Typography } from 'antd';
import { HomeOutlined, ClusterOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function KelembagaanPoktanIndex() {
    return (
        <AdminLayout title="Kelembagaan Poktan">
            <Head title="Kelembagaan Poktan" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: <><ClusterOutlined /> Kelembagaan Poktan</> },
                ]}
            />

            <Title level={4} className="!text-gray-800">Kelembagaan Poktan</Title>
        </AdminLayout>
    );
}
