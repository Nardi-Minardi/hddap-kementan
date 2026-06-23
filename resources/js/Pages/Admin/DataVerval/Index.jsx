import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Breadcrumb, Typography } from 'antd';
import { HomeOutlined, BarChartOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function DataVervalIndex() {
    return (
        <AdminLayout title="Data Verval">
            <Head title="Data Verval" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: <><BarChartOutlined /> Data Verval</> },
                ]}
            />

            <Title level={4} className="!text-gray-800">Data Verval</Title>
        </AdminLayout>
    );
}
