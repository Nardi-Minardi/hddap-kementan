import AdminLayout from '@/Layouts/AdminLayout';
import { usePermissions } from '@/utils/permissions';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Breadcrumb, Button, Card, Input, Popconfirm, Space, Table, Tag, Tooltip, Typography, message,
} from 'antd';
import {
    DeleteOutlined, EditOutlined, FolderOutlined, HomeOutlined, PlusOutlined, SearchOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';

const { Title } = Typography;

export default function SubMenuDokumenIndex({ subMenus, filters }) {
    const { flash } = usePage().props;
    const { can } = usePermissions();
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        if (flash?.success) message.success(flash.success);
        if (flash?.error) message.error(flash.error);
    }, [flash]);

    const handleFilter = (params) => {
        router.get(route('admin.sub-menu-dokumen.index'), { ...filters, ...params, page: 1 }, { preserveState: true, replace: true });
    };

    const columns = [
        {
            title: 'No',
            key: 'no',
            width: 55,
            align: 'center',
            render: (_, __, i) => (subMenus.current_page - 1) * subMenus.per_page + i + 1,
        },
        {
            title: 'Nama Sub Menu',
            dataIndex: 'nama',
            key: 'nama',
            render: (value) => <span className="font-medium text-gray-800">{value}</span>,
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
            render: (value) => <code className="text-xs text-gray-500">{value}</code>,
        },
        {
            title: 'Jumlah Dokumen',
            dataIndex: 'dokumen_count',
            key: 'dokumen_count',
            width: 130,
            align: 'center',
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
            dataIndex: 'is_active',
            key: 'is_active',
            width: 100,
            align: 'center',
            render: (value) => value ? <Tag color="green">Aktif</Tag> : <Tag color="default">Nonaktif</Tag>,
        },
        {
            title: 'Aksi',
            key: 'action',
            width: 90,
            align: 'center',
            render: (_, record) => (
                <Space size={4}>
                    {can('sub-menu-dokumen.update') && (
                        <Tooltip title="Edit">
                            <Button size="small" type="primary" ghost icon={<EditOutlined />} onClick={() => router.visit(route('admin.sub-menu-dokumen.edit', record.id))} />
                        </Tooltip>
                    )}
                    {can('sub-menu-dokumen.delete') && (
                        <Popconfirm
                            title="Hapus sub menu ini?"
                            okText="Hapus"
                            okType="danger"
                            cancelText="Batal"
                            onConfirm={() => router.delete(route('admin.sub-menu-dokumen.destroy', record.id), { preserveScroll: true })}
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
        <AdminLayout title="Sub Menu Dokumen">
            <Head title="Sub Menu Dokumen" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: 'Sub Menu Dokumen' },
                ]}
            />

            <Card
                className="rounded-xl border border-gray-100 shadow-sm"
                title={
                    <div className="flex flex-wrap items-center justify-between gap-3 py-1">
                        <Title level={5} className="!mb-0 !text-gray-800">
                            <FolderOutlined className="mr-2 text-amber-500" />
                            Daftar Sub Menu Dokumen
                        </Title>
                        <Space wrap>
                            <Input
                                placeholder="Cari nama sub menu..."
                                prefix={<SearchOutlined className="text-gray-400" />}
                                value={search}
                                onPressEnter={(e) => handleFilter({ search: e.target.value })}
                                onChange={(e) => setSearch(e.target.value)}
                                onBlur={() => handleFilter({ search })}
                                style={{ width: 240 }}
                                allowClear
                                onClear={() => { setSearch(''); handleFilter({ search: '' }); }}
                            />
                            {can('sub-menu-dokumen.create') && (
                                <Link href={route('admin.sub-menu-dokumen.create')}>
                                    <Button type="primary" icon={<PlusOutlined />} className="!border-emerald-500 !bg-emerald-500 hover:!bg-emerald-600">
                                        Tambah Sub Menu
                                    </Button>
                                </Link>
                            )}
                        </Space>
                    </div>
                }
            >
                <Table
                    dataSource={subMenus.data}
                    columns={columns}
                    rowKey="id"
                    scroll={{ x: 'max-content' }}
                    pagination={{
                        current: subMenus.current_page,
                        total: subMenus.total,
                        pageSize: subMenus.per_page,
                        showSizeChanger: false,
                        showTotal: (total) => `Total ${total} sub menu`,
                        onChange: (page) => router.get(route('admin.sub-menu-dokumen.index'), { ...filters, page }, { preserveState: true }),
                    }}
                    rowClassName="hover:!bg-gray-50"
                />
            </Card>
        </AdminLayout>
    );
}
