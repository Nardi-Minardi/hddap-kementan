import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import {
    Card, Form, Input, Select, Button, Typography, Breadcrumb, Space,
} from 'antd';
import { SaveOutlined, ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function UsersEdit({ user, roles }) {
    const { data, setData, patch, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        role_id: user.role_id,
    });

    const handleSubmit = () => {
        patch(route('admin.users.update', user.id));
    };

    return (
        <AdminLayout title="Edit User">
            <Head title="Edit User" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { href: route('admin.users.index'), title: 'Users' },
                    { title: 'Edit' },
                ]}
            />

            <div>
                <Card
                    className="shadow-sm border border-gray-100 rounded-xl"
                    title={<Title level={5} className="!mb-0 !text-gray-800">Edit User</Title>}
                >
                    <Form layout="vertical" onFinish={handleSubmit} className="space-y-1">
                        <Form.Item
                            label="Nama Lengkap"
                            validateStatus={errors.name ? 'error' : ''}
                            help={errors.name}
                            required
                        >
                            <Input
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Masukkan nama lengkap"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            validateStatus={errors.email ? 'error' : ''}
                            help={errors.email}
                            required
                        >
                            <Input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="contoh@email.com"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Role"
                            validateStatus={errors.role_id ? 'error' : ''}
                            help={errors.role_id}
                            required
                        >
                            <Select
                                value={data.role_id || undefined}
                                onChange={(val) => setData('role_id', val)}
                                placeholder="Pilih role"
                                size="large"
                                options={roles.map((r) => ({ value: r.id, label: r.label }))}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Password Baru"
                            validateStatus={errors.password ? 'error' : ''}
                            help={errors.password || 'Kosongkan jika tidak ingin mengubah password'}
                        >
                            <Input.Password
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Isi untuk mengubah password"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Konfirmasi Password Baru"
                            validateStatus={errors.password_confirmation ? 'error' : ''}
                            help={errors.password_confirmation}
                        >
                            <Input.Password
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Ulangi password baru"
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
                                <Link href={route('admin.users.index')}>
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
