import AdminLayout from '@/Layouts/AdminLayout';
import BeritaFormFields from '@/Pages/Admin/Berita/FormFields';
import { usePermissions } from '@/utils/permissions';
import { Head, Link, router } from '@inertiajs/react';
import {
    Breadcrumb, Button, Card, Input, Popconfirm, Space, Table, Tag, Tooltip, Typography, message, Select,
} from 'antd';
import {
    DeleteOutlined, EditOutlined, HomeOutlined, PlusOutlined, ReadOutlined, SearchOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

const { Title } = Typography;

function formatTanggal(value) {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric',
    });
}

export default function BeritaIndex({ berita, filters, tipeOptions = [] }) {
    const { flash } = usePage().props;
    const { can } = usePermissions();
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        if (flash?.success) message.success(flash.success);
        if (flash?.error) message.error(flash.error);
    }, [flash]);

    const handleFilter = (params) => {
        router.get(route('admin.berita.index'), { ...filters, ...params, page: 1 }, { preserveState: true, replace: true });
    };

    const columns = [
        {
            title: 'No',
            key: 'no',
            width: 55,
            align: 'center',
            render: (_, __, i) => (berita.current_page - 1) * berita.per_page + i + 1,
        },
        {
            title: 'Gambar',
            dataIndex: 'image_url',
            key: 'image_url',
            width: 90,
            render: (url, record) => (
                <img
                    src={url}
                    alt={record.judul}
                    className="h-14 w-20 rounded-lg object-cover ring-1 ring-gray-200"
                />
            ),
        },
        {
            title: 'Judul',
            dataIndex: 'judul',
            key: 'judul',
            render: (value, record) => (
                <div>
                    <div className="font-medium text-gray-800">{value}</div>
                    {record.ringkasan && (
                        <div className="mt-1 line-clamp-2 text-xs text-gray-400">{record.ringkasan}</div>
                    )}
                </div>
            ),
        },
        {
            title: 'Tipe',
            dataIndex: 'tipe',
            key: 'tipe',
            width: 100,
            align: 'center',
            render: (value) => (
                <Tag color={value === 'agenda' ? 'blue' : 'green'}>
                    {value === 'agenda' ? 'Agenda' : 'Berita'}
                </Tag>
            ),
        },
        {
            title: 'Lokasi',
            key: 'lokasi',
            width: 160,
            render: (_, record) => record.kab_kota?.name ?? '-',
        },
        {
            title: 'Tanggal',
            dataIndex: 'published_at',
            key: 'published_at',
            width: 150,
            render: (value) => formatTanggal(value),
        },
        {
            title: 'Status',
            dataIndex: 'is_published',
            key: 'is_published',
            width: 100,
            align: 'center',
            render: (value) => value
                ? <Tag color="green">Publish</Tag>
                : <Tag color="default">Draft</Tag>,
        },
        {
            title: 'Aksi',
            key: 'action',
            width: 90,
            align: 'center',
            render: (_, record) => (
                <Space size={4}>
                    {can('berita.update') && (
                        <Tooltip title="Edit">
                            <Button
                                size="small"
                                type="primary"
                                ghost
                                icon={<EditOutlined />}
                                onClick={() => router.visit(route('admin.berita.edit', record.id))}
                            />
                        </Tooltip>
                    )}
                    {can('berita.delete') && (
                        <Popconfirm
                            title="Hapus berita ini?"
                            okText="Hapus"
                            okType="danger"
                            cancelText="Batal"
                            onConfirm={() => router.delete(route('admin.berita.destroy', record.id), { preserveScroll: true })}
                        >
                            <Tooltip title="Hapus">
                                <Button size="small" danger icon={<DeleteOutlined />} />
                            </Tooltip>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout title="Berita & Agenda">
            <Head title="Berita & Agenda" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: 'Berita & Agenda' },
                ]}
            />

            <Card
                className="rounded-xl border border-gray-100 shadow-sm"
                title={
                    <div className="flex flex-wrap items-center justify-between gap-3 py-1">
                        <Title level={5} className="!mb-0 !text-gray-800">
                            <ReadOutlined className="mr-2 text-emerald-500" />
                            Daftar Berita & Agenda
                        </Title>
                        <Space wrap>
                            <Select
                                allowClear
                                placeholder="Filter tipe"
                                style={{ width: 130 }}
                                value={filters.tipe || undefined}
                                onChange={(val) => handleFilter({ tipe: val ?? '' })}
                                options={tipeOptions}
                            />
                            <Select
                                allowClear
                                placeholder="Filter status"
                                style={{ width: 140 }}
                                value={filters.is_published !== undefined && filters.is_published !== '' ? filters.is_published : undefined}
                                onChange={(val) => handleFilter({ is_published: val ?? '' })}
                                options={[
                                    { value: '1', label: 'Publish' },
                                    { value: '0', label: 'Draft' },
                                ]}
                            />
                            <Input
                                placeholder="Cari judul / ringkasan..."
                                prefix={<SearchOutlined className="text-gray-400" />}
                                value={search}
                                onPressEnter={(e) => handleFilter({ search: e.target.value })}
                                onChange={(e) => setSearch(e.target.value)}
                                onBlur={() => handleFilter({ search })}
                                style={{ width: 260 }}
                                allowClear
                                onClear={() => { setSearch(''); handleFilter({ search: '' }); }}
                            />
                            {can('berita.create') && (
                                <Link href={route('admin.berita.create')}>
                                    <Button type="primary" icon={<PlusOutlined />} className="!border-emerald-500 !bg-emerald-500 hover:!bg-emerald-600">
                                        Tambah Berita
                                    </Button>
                                </Link>
                            )}
                        </Space>
                    </div>
                }
            >
                <Table
                    dataSource={berita.data}
                    columns={columns}
                    rowKey="id"
                    scroll={{ x: 'max-content' }}
                    pagination={{
                        current: berita.current_page,
                        total: berita.total,
                        pageSize: berita.per_page,
                        showSizeChanger: false,
                        showTotal: (total) => `Total ${total} berita`,
                        onChange: (page) => router.get(route('admin.berita.index'), { ...filters, page }, { preserveState: true }),
                    }}
                    rowClassName="hover:!bg-gray-50"
                />
            </Card>
        </AdminLayout>
    );
}
