import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Table, Button, Space, Tag, Typography, Card, Input, Popconfirm, message, Breadcrumb, Tooltip,
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, UserOutlined, HomeOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

const { Title, Text } = Typography;

export default function UsersIndex({ users, roles }) {
    const { flash } = usePage().props;
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        if (flash?.success) message.success(flash.success);
        if (flash?.error) message.error(flash.error);
    }, [flash]);

    const handleDelete = (id) => {
        router.delete(route('admin.users.destroy', id), {
            preserveScroll: true,
            onSuccess: () => message.success('User berhasil dihapus.'),
        });
    };

    const filteredUsers = users.data.filter(
        (u) =>
            u.name.toLowerCase().includes(searchText.toLowerCase()) ||
            u.email.toLowerCase().includes(searchText.toLowerCase()),
    );

    const columns = [
        {
            title: 'No',
            key: 'no',
            width: 60,
            render: (_, __, index) =>
                (users.current_page - 1) * users.per_page + index + 1,
        },
        {
            title: 'Nama',
            dataIndex: 'name',
            key: 'name',
            render: (name, record) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <UserOutlined className="text-emerald-600 text-sm" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-800">{name}</div>
                        <div className="text-xs text-gray-400">{record.email}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) =>
                role ? (
                    <Tag color={role.name === 'admin' ? 'green' : 'blue'} className="capitalize">
                        {role.label}
                    </Tag>
                ) : (
                    <Tag color="default">Tidak ada</Tag>
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
                            onClick={() => router.visit(route('admin.users.edit', record.id))}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Hapus user ini?"
                        description="Data yang dihapus tidak dapat dikembalikan."
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
        <AdminLayout title="Master User">
            <Head title="Users" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: 'Master' },
                    { title: 'Users' },
                ]}
            />

            <Card
                className="shadow-sm border border-gray-100 rounded-xl"
                title={
                    <div className="flex items-center justify-between flex-wrap gap-3 py-1">
                        <Title level={5} className="!mb-0 !text-gray-800">
                            Daftar User
                        </Title>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Cari nama atau email..."
                                prefix={<SearchOutlined className="text-gray-400" />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="w-56"
                                allowClear
                            />
                            <Link href={route('admin.users.create')}>
                                <Button type="primary" icon={<PlusOutlined />} className="!bg-emerald-500 hover:!bg-emerald-600 !border-emerald-500">
                                    Tambah User
                                </Button>
                            </Link>
                        </div>
                    </div>
                }
            >
                <Table
                    dataSource={filteredUsers}
                    columns={columns}
                    rowKey="id"
                    pagination={{
                        current: users.current_page,
                        total: users.total,
                        pageSize: users.per_page,
                        showSizeChanger: false,
                        showTotal: (total) => `Total ${total} user`,
                    }}
                    className="overflow-x-auto"
                    rowClassName="hover:!bg-gray-50"
                />
            </Card>
        </AdminLayout>
    );
}
