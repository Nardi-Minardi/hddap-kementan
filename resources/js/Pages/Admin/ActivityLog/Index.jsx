import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { Breadcrumb, Card, Input, Select, Table, Tag, Typography } from 'antd';
import { HistoryOutlined, HomeOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title, Text } = Typography;

const aksiColors = {
    login: 'green',
    logout: 'orange',
    create: 'blue',
    update: 'cyan',
    delete: 'red',
    view: 'purple',
};

function formatDateTime(value) {
    if (!value) {
        return '-';
    }

    return new Date(value).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function ActivityLogIndex({ activityLogs, filters, aksiOptions }) {
    const [search, setSearch] = useState(filters.search || '');

    const applyFilters = (nextFilters) => {
        router.get(
            route('admin.activity-log.index'),
            { ...filters, ...nextFilters },
            { preserveState: true, replace: true },
        );
    };

    const columns = [
        {
            title: 'No',
            key: 'no',
            width: 60,
            render: (_, __, index) =>
                (activityLogs.current_page - 1) * activityLogs.per_page + index + 1,
        },
        {
            title: 'Waktu',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 170,
            render: (value) => formatDateTime(value),
        },
        {
            title: 'User',
            key: 'user',
            width: 220,
            render: (_, record) => (
                record.user ? (
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                            <UserOutlined className="text-sm text-emerald-600" />
                        </div>
                        <div>
                            <div className="font-medium text-gray-800">{record.user.name}</div>
                            <div className="text-xs text-gray-400">{record.user.email}</div>
                        </div>
                    </div>
                ) : (
                    <Text type="secondary">Guest / Sistem</Text>
                )
            ),
        },
        {
            title: 'Aksi',
            dataIndex: 'aksi',
            key: 'aksi',
            width: 120,
            render: (aksi) => (
                <Tag color={aksiColors[aksi] || 'default'} className="capitalize">
                    {aksi}
                </Tag>
            ),
        },
        {
            title: 'Deskripsi',
            dataIndex: 'deskripsi',
            key: 'deskripsi',
            ellipsis: true,
            render: (deskripsi) => deskripsi || '-',
        },
        {
            title: 'Method',
            dataIndex: 'method',
            key: 'method',
            width: 90,
            render: (method) => (
                method ? <Tag>{method}</Tag> : '-'
            ),
        },
        {
            title: 'IP',
            dataIndex: 'ip_address',
            key: 'ip_address',
            width: 130,
            render: (ip) => ip || '-',
        },
        {
            title: 'URL',
            dataIndex: 'url',
            key: 'url',
            ellipsis: true,
            render: (url) => (
                url ? (
                    <Text className="text-xs text-gray-500" title={url}>
                        {url}
                    </Text>
                ) : '-'
            ),
        },
    ];

    return (
        <AdminLayout title="Activity Log">
            <Head title="Activity Log" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: <><HistoryOutlined /> Activity Log</> },
                ]}
            />

            <Card
                className="rounded-xl border border-gray-100 shadow-sm"
                title={
                    <div className="flex flex-wrap items-center justify-between gap-3 py-1">
                        <Title level={5} className="!mb-0 !text-gray-800">
                            Log Aktivitas User
                        </Title>
                        <div className="flex flex-wrap items-center gap-2">
                            <Select
                                allowClear
                                placeholder="Filter aksi"
                                style={{ width: 160 }}
                                value={filters.aksi || undefined}
                                options={aksiOptions.map((aksi) => ({
                                    value: aksi,
                                    label: aksi,
                                }))}
                                onChange={(value) => applyFilters({ aksi: value || undefined, page: 1 })}
                            />
                            <Input
                                placeholder="Cari user, aksi, deskripsi..."
                                prefix={<SearchOutlined className="text-gray-400" />}
                                defaultValue={filters.search}
                                onPressEnter={(e) => applyFilters({ search: e.target.value, page: 1 })}
                                onChange={(e) => setSearch(e.target.value)}
                                onBlur={() => applyFilters({ search, page: 1 })}
                                style={{ width: 280 }}
                                allowClear
                                onClear={() => applyFilters({ search: undefined, page: 1 })}
                            />
                        </div>
                    </div>
                }
            >
                <Table
                    dataSource={activityLogs.data}
                    columns={columns}
                    rowKey="id"
                    scroll={{ x: 1200 }}
                    pagination={{
                        current: activityLogs.current_page,
                        total: activityLogs.total,
                        pageSize: activityLogs.per_page,
                        showSizeChanger: false,
                        showTotal: (total) => `Total ${total} aktivitas`,
                        onChange: (page) => applyFilters({ page }),
                    }}
                    rowClassName="hover:!bg-gray-50"
                />
            </Card>
        </AdminLayout>
    );
}
