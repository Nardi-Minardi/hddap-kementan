import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, usePage } from '@inertiajs/react';
import {
    Table, Card, Input, Select, Typography, Breadcrumb, Tag, Space, Button, Popconfirm, Tooltip, message,
} from 'antd';
import {
    ClusterOutlined, DeleteOutlined, EditOutlined, HomeOutlined, PlusOutlined, SearchOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';

const { Title } = Typography;

export default function ClusterIndex({ clusters, provinsis, kabKotas, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        if (flash?.success) message.success(flash.success);
        if (flash?.error) message.error(flash.error);
    }, [flash]);

    const handleFilter = (params) => {
        router.get(
            route('admin.cluster.index'),
            { ...filters, ...params, page: 1 },
            { preserveState: true, replace: true },
        );
    };

    const handleDelete = (id) => {
        router.delete(route('admin.cluster.destroy', id), {
            preserveScroll: true,
        });
    };

    const columns = [
        {
            title: 'No',
            key: 'no',
            width: 55,
            fixed: 'left',
            render: (_, __, index) => (clusters.current_page - 1) * clusters.per_page + index + 1,
        },
        {
            title: 'Provinsi',
            key: 'provinsi_name',
            width: 160,
            render: (_, record) => record.kab_kota?.provinsi?.name ?? '-',
        },
        {
            title: 'Kab/Kota',
            key: 'kab_kota_name',
            width: 180,
            render: (_, record) => record.kab_kota?.name ?? record.nama_kota ?? '-',
        },
        {
            title: 'Nama Cluster',
            dataIndex: 'nama_cluster',
            key: 'nama_cluster',
            width: 220,
            render: (value) => value ?? '-',
        },
        {
            title: 'Komoditas',
            key: 'kumoditas',
            width: 160,
            render: (_, record) => record.kumoditas?.kumoditas ?? '-',
        },
        {
            title: 'Jumlah Poktan',
            dataIndex: 'jumlah_poktan',
            key: 'jumlah_poktan',
            width: 120,
            align: 'center',
            render: (value) => {
                const count = Number(value ?? 0);
                return count > 0 ? <Tag color="blue">{count.toLocaleString('id-ID')}</Tag> : <Tag>0</Tag>;
            },
        },
        {
            title: 'Aksi',
            key: 'action',
            width: 90,
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
                <Space size={4}>
                    <Tooltip title="Edit">
                        <Button
                            size="small"
                            type="primary"
                            ghost
                            icon={<EditOutlined />}
                            onClick={() => router.visit(route('admin.cluster.edit', record.id))}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Hapus cluster ini?"
                        description="Data yang dihapus tidak dapat dikembalikan."
                        okText="Hapus"
                        okType="danger"
                        cancelText="Batal"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Tooltip title="Hapus">
                            <Button size="small" danger ghost icon={<DeleteOutlined />} />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout title="Kluster Petani">
            <Head title="Kluster Petani" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: 'Master' },
                    { title: <><ClusterOutlined /> Kluster Petani</> },
                ]}
            />

            <Card
                className="shadow-sm border border-gray-100 rounded-xl"
                title={
                    <div className="flex items-center justify-between flex-wrap gap-3 py-1">
                        <Title level={5} className="!mb-0 !text-gray-800">Daftar Kluster Petani</Title>
                        <Space wrap>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => router.visit(route('admin.cluster.create'))}
                            >
                                Tambah
                            </Button>
                            <Select
                                allowClear
                                placeholder="Filter Provinsi"
                                style={{ width: 200 }}
                                value={filters.provinsi_code || undefined}
                                onChange={(value) => handleFilter({ provinsi_code: value ?? '', kode_kota: '' })}
                                options={provinsis.map((item) => ({ value: item.code, label: item.name }))}
                                showSearch
                                optionFilterProp="label"
                            />
                            <Select
                                allowClear
                                placeholder="Filter Kab/Kota"
                                style={{ width: 200 }}
                                value={filters.kode_kota || undefined}
                                onChange={(value) => handleFilter({ kode_kota: value ?? '' })}
                                options={(kabKotas ?? []).map((item) => ({ value: item.code, label: item.name }))}
                                showSearch
                                disabled={!filters.provinsi_code}
                                optionFilterProp="label"
                            />
                            <Input
                                placeholder="Cari nama cluster / komoditas..."
                                prefix={<SearchOutlined className="text-gray-400" />}
                                value={search}
                                onPressEnter={(event) => handleFilter({ search: event.target.value })}
                                onChange={(event) => setSearch(event.target.value)}
                                onBlur={() => handleFilter({ search })}
                                style={{ width: 260 }}
                                allowClear
                                onClear={() => {
                                    setSearch('');
                                    handleFilter({ search: '' });
                                }}
                            />
                        </Space>
                    </div>
                }
            >
                <Table
                    dataSource={clusters.data}
                    columns={columns}
                    rowKey="id"
                    scroll={{ x: 1100 }}
                    pagination={{
                        current: clusters.current_page,
                        total: clusters.total,
                        pageSize: clusters.per_page,
                        showSizeChanger: false,
                        showTotal: (total) => `Total ${total} cluster`,
                        onChange: (page) => router.get(
                            route('admin.cluster.index'),
                            { ...filters, page },
                            { preserveState: true },
                        ),
                    }}
                    rowClassName="hover:!bg-gray-50"
                />
            </Card>
        </AdminLayout>
    );
}
