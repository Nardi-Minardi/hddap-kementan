import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Breadcrumb, Typography } from 'antd';
import { HomeOutlined, LineChartOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function MonevFisikIndex() {
    return (
        <AdminLayout title="Monev Fisik">
            <Head title="Monev Fisik" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: <><LineChartOutlined /> Monev Fisik</> },
                ]}
            />

            <Title level={4} className="!text-gray-800">Monev Fisik</Title>
        </AdminLayout>
    );
}
