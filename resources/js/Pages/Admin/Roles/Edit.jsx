import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import {
    Card, Form, Input, Button, Typography, Breadcrumb, Space, Alert,
} from 'antd';
import { SaveOutlined, ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function RolesEdit({ role }) {
    const { data, setData, patch, processing, errors } = useForm({
        name: role.name,
        label: role.label,
    });

    const handleSubmit = () => {
        patch(route('admin.roles.update', role.id));
    };

    return (
        <AdminLayout title="Edit Role">
            <Head title="Edit Role" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { href: route('admin.roles.index'), title: 'Roles' },
                    { title: 'Edit' },
                ]}
            />

            <div>
                <Card
                    className="shadow-sm border border-gray-100 rounded-xl"
                    title={<Title level={5} className="!mb-0 !text-gray-800">Edit Role</Title>}
                >
                    <Form layout="vertical" onFinish={handleSubmit}>
                        <Form.Item
                            label="Name (slug)"
                            validateStatus={errors.name ? 'error' : ''}
                            help={errors.name || 'Hanya huruf, angka, underscore, dan dash.'}
                            required
                        >
                            <Input
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                                placeholder="contoh: super_admin"
                                size="large"
                                prefix={<code className="text-gray-400 text-xs">#</code>}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Label (nama tampilan)"
                            validateStatus={errors.label ? 'error' : ''}
                            help={errors.label}
                            required
                        >
                            <Input
                                value={data.label}
                                onChange={(e) => setData('label', e.target.value)}
                                placeholder="contoh: Super Administrator"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item className="mb-0 pt-2">
                            <Space>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<SaveOutlined />}
                                    loading={processing}
                                    className="!bg-emerald-500 hover:!bg-emerald-600 !border-emerald-500"
                                    size="large"
                                >
                                    Update
                                </Button>
                                <Link href={route('admin.roles.index')}>
                                    <Button icon={<ArrowLeftOutlined />} size="large">
                                        Kembali
                                    </Button>
                                </Link>
                            </Space>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </AdminLayout>
    );
}
