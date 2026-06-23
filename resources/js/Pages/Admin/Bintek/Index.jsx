import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Breadcrumb, Typography } from 'antd';
import { HomeOutlined, ReadOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function BintekIndex() {
    return (
        <AdminLayout title="Bintek">
            <Head title="Bintek" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: <><ReadOutlined /> Bintek</> },
                ]}
            />

            <Title level={4} className="!text-gray-800">Bintek</Title>
        </AdminLayout>
    );
}
