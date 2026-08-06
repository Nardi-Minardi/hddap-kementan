import AdminLayout from '@/Layouts/AdminLayout';
import { usePermissions } from '@/utils/permissions';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Breadcrumb, Button, Card, Input, Popconfirm, Space, Table, Tag, Tooltip, Typography, message, Select,
} from 'antd';
import {
    DeleteOutlined, EditOutlined, FilePdfOutlined, HomeOutlined, PlusOutlined, SearchOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';

const { Title } = Typography;

function formatTanggal(value) {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric',
    });
}

export default function DokumenKegiatanIndex({ dokumen, filters }) {
    const { flash } = usePage().props;
    const { can } = usePermissions();
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        if (flash?.success) message.success(flash.success);
        if (flash?.error) message.error(flash.error);
    }, [flash]);

    const handleFilter = (params) => {
        router.get(route('admin.dokumen-kegiatan.index'), { ...filters, ...params, page: 1 }, { preserveState: true, replace: true });
    };

    const columns = [
        {
            title: 'No',
            key: 'no',
            width: 55,
            align: 'center',
            render: (_, __, i) => (dokumen.current_page - 1) * dokumen.per_page + i + 1,
        },
        {
            title: 'Cover',
            dataIndex: 'cover_url',
            key: 'cover_url',
            width: 90,
            render: (url, record) => url ? (
                <img src={url} alt={record.judul} className="h-14 w-20 rounded-lg object-cover ring-1 ring-gray-200" />
            ) : (
                <div className="flex h-14 w-20 items-center justify-center rounded-lg bg-red-50 ring-1 ring-red-100">
                    <FilePdfOutlined className="text-xl text-red-500" />
                </div>
            ),
        },
        {
            title: 'Judul',
            dataIndex: 'judul',
            key: 'judul',
            render: (value, record) => (
                <div>
                    <div className="font-medium text-gray-800">{value}</div>
                    {record.deskripsi && (
                        <div className="mt-1 line-clamp-2 text-xs text-gray-400">{record.deskripsi}</div>
                    )}
                </div>
            ),
        },
        {
            title: 'Tanggal',
            dataIndex: 'published_at',
            key: 'published_at',
            width: 150,
            render: (value) => formatTanggal(value),
        },
        {
            title: 'Urutan',
            dataIndex: 'urutan',
            key: 'urutan',
            width: 80,
            align: 'center',
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
                    {can('dokumen-kegiatan.update') && (
                        <Tooltip title="Edit">
                            <Button
                                size="small"
                                type="primary"
                                ghost
                                icon={<EditOutlined />}
                                onClick={() => router.visit(route('admin.dokumen-kegiatan.edit', record.id))}
                            />
                        </Tooltip>
                    )}
                    {can('dokumen-kegiatan.delete') && (
                        <Popconfirm
                            title="Hapus dokumen ini?"
                            okText="Hapus"
                            okType="danger"
                            cancelText="Batal"
                            onConfirm={() => router.delete(route('admin.dokumen-kegiatan.destroy', record.id), { preserveScroll: true })}
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
        <AdminLayout title="Dokumen Kegiatan">
            <Head title="Dokumen Kegiatan" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: 'Dokumen Kegiatan' },
                ]}
            />

            <Card
                className="rounded-xl border border-gray-100 shadow-sm"
                title={
                    <div className="flex flex-wrap items-center justify-between gap-3 py-1">
                        <Title level={5} className="!mb-0 !text-gray-800">
                            <FilePdfOutlined className="mr-2 text-red-500" />
                            Daftar Dokumen Kegiatan (PDF)
                        </Title>
                        <Space wrap>
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
                                placeholder="Cari judul / deskripsi..."
                                prefix={<SearchOutlined className="text-gray-400" />}
                                value={search}
                                onPressEnter={(e) => handleFilter({ search: e.target.value })}
                                onChange={(e) => setSearch(e.target.value)}
                                onBlur={() => handleFilter({ search })}
                                style={{ width: 260 }}
                                allowClear
                                onClear={() => { setSearch(''); handleFilter({ search: '' }); }}
                            />
                            {can('dokumen-kegiatan.create') && (
                                <Link href={route('admin.dokumen-kegiatan.create')}>
                                    <Button type="primary" icon={<PlusOutlined />} className="!border-emerald-500 !bg-emerald-500 hover:!bg-emerald-600">
                                        Upload PDF
                                    </Button>
                                </Link>
                            )}
                        </Space>
                    </div>
                }
            >
                <Table
                    dataSource={dokumen.data}
                    columns={columns}
                    rowKey="id"
                    scroll={{ x: 'max-content' }}
                    pagination={{
                        current: dokumen.current_page,
                        total: dokumen.total,
                        pageSize: dokumen.per_page,
                        showSizeChanger: false,
                        showTotal: (total) => `Total ${total} dokumen`,
                        onChange: (page) => router.get(route('admin.dokumen-kegiatan.index'), { ...filters, page }, { preserveState: true }),
                    }}
                    rowClassName="hover:!bg-gray-50"
                />
            </Card>
        </AdminLayout>
    );
}
