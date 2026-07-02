import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Table, Button, Space, Tag, Typography, Card, Popconfirm, message, Breadcrumb, Tooltip,
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined, HomeOutlined, TeamOutlined,
} from '@ant-design/icons';
import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

const { Title } = Typography;

export default function RolesIndex({ roles }) {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) message.success(flash.success);
        if (flash?.error) message.error(flash.error);
    }, [flash]);

    const handleDelete = (id) => {
        router.delete(route('admin.roles.destroy', id), {
            preserveScroll: true,
            onSuccess: () => message.success('Role berhasil dihapus.'),
        });
    };

    const columns = [
        {
            title: 'No',
            key: 'no',
            width: 60,
            render: (_, __, index) =>
                (roles.current_page - 1) * roles.per_page + index + 1,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (name) => (
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
                        <TeamOutlined className="text-violet-600 text-xs" />
                    </div>
                    <code className="bg-gray-100 px-2 py-0.5 rounded text-sm text-gray-700">{name}</code>
                </div>
            ),
        },
        {
            title: 'Label',
            dataIndex: 'label',
            key: 'label',
            render: (label, record) => (
                <Tag color={record.name === 'admin' ? 'green' : 'blue'}>{label}</Tag>
            ),
        },
        {
            title: 'Total Users',
            dataIndex: 'users_count',
            key: 'users_count',
            render: (count) => (
                <span className="font-semibold text-gray-700">{count ?? 0}</span>
            ),
        },
        {
            title: 'Dibuat',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => new Date(date).toLocaleDateString('id-ID', {
                day: '2-digit', month: 'short', year: 'numeric',
            }),
        },
        {
            title: 'Aksi',
            key: 'action',
            width: 90,
            align: 'center',
            render: (_, record) => (
                <Space size={4}>
                    <Tooltip title="Edit">
                        <Button
                            size="small"
                            type="primary"
                            ghost
                            icon={<EditOutlined />}
                            onClick={() => router.visit(route('admin.roles.edit', record.id))}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Hapus role ini?"
                        description={
                            <>
                                Data yang dihapus tidak dapat dikembalikan.
                                <br />
                                <small className="text-orange-500">Users dengan role ini akan kehilangan role-nya.</small>
                            </>
                        }
                        okText="Hapus"
                        okType="danger"
                        cancelText="Batal"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Tooltip title="Hapus">
                            <Button size="small" danger icon={<DeleteOutlined />} />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout title="Master Role">
            <Head title="Roles" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: 'Master' },
                    { title: 'Roles' },
                ]}
            />

            <Card
                className="shadow-sm border border-gray-100 rounded-xl"
                title={
                    <div className="flex items-center justify-between flex-wrap gap-3 py-1">
                        <Title level={5} className="!mb-0 !text-gray-800">
                            Daftar Role
                        </Title>
                        <Link href={route('admin.roles.create')}>
                            <Button type="primary" icon={<PlusOutlined />} className="!bg-emerald-500 hover:!bg-emerald-600 !border-emerald-500">
                                Tambah Role
                            </Button>
                        </Link>
                    </div>
                }
            >
                <Table
                    dataSource={roles.data}
                    columns={columns}
                    rowKey="id"
                    pagination={{
                        current: roles.current_page,
                        total: roles.total,
                        pageSize: roles.per_page,
                        showSizeChanger: false,
                        showTotal: (total) => `Total ${total} role`,
                    }}
                    rowClassName="hover:!bg-gray-50"
                />
            </Card>
        </AdminLayout>
    );
}
