import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { Table, Card, Input, Select, Typography, Breadcrumb, Tag, Space, Button, Popconfirm, Tooltip } from 'antd';
import { HomeOutlined, UserOutlined, SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title } = Typography;

const GENDER_OPTIONS = [
    { value: 'L', label: 'Laki-laki' },
    { value: 'P', label: 'Perempuan' },
];

const DIFABEL_OPTIONS = [
    { value: '1', label: 'Ya' },
    { value: '0', label: 'Tidak' },
];

export default function PetaniIndex({ petanis, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleFilter = (params) => {
        router.get(route('admin.petani.index'), { ...filters, ...params, page: 1 }, { preserveState: true, replace: true });
    };

    const columns = [
        {
            title: 'No',
            key: 'no',
            width: 55,
            render: (_, __, i) => (petanis.current_page - 1) * petanis.per_page + i + 1,
        },
        {
            title: 'Nama Petani',
            dataIndex: 'nama_petani',
            key: 'nama_petani',
            width: 200,
            render: (v) => v ?? '-',
        },
        {
            title: 'NIK',
            dataIndex: 'nik_petani',
            key: 'nik_petani',
            width: 180,
            render: (v) => v ?? '-',
        },
        {
            title: 'No HP',
            dataIndex: 'no_hp_petani',
            key: 'no_hp_petani',
            width: 150,
            render: (v) => v ?? '-',
        },
        {
            title: 'Gender',
            dataIndex: 'gender_petani',
            key: 'gender_petani',
            width: 100,
            align: 'center',
            render: (v) => v
                ? <Tag color={v === 'L' ? 'blue' : 'pink'}>{v === 'L' ? 'Laki-laki' : 'Perempuan'}</Tag>
                : '-',
        },
        {
            title: 'Usia',
            dataIndex: 'usia_petani',
            key: 'usia_petani',
            width: 80,
            align: 'center',
            render: (v) => v != null ? `${v} th` : '-',
        },
        {
            title: 'Difabel',
            dataIndex: 'difabel',
            key: 'difabel',
            width: 90,
            align: 'center',
            render: (v) => v
                ? <Tag color="orange">Ya</Tag>
                : <Tag color="default">Tidak</Tag>,
        },
        {
            title: 'Alamat',
            dataIndex: 'alamat_petani',
            key: 'alamat_petani',
            width: 280,
            render: (v) => v ?? '-',
        },
        {
            title: 'Aksi',
            key: 'action',
            width: 140,
            fixed: 'right',
            align: 'center',
            render: (_, record) => (
                <Space size={4}>
                    <Tooltip title="Data Keluarga">
                        <Button
                            size="small"
                            icon={<TeamOutlined />}
                            onClick={() => router.visit(route('admin.petani.keluarga', record.id))}
                        >
                            {record.kk_petani_count > 0 && <span className="ml-1 text-xs">{record.kk_petani_count}</span>}
                        </Button>
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button
                            size="small"
                            type="primary"
                            ghost
                            icon={<EditOutlined />}
                            onClick={() => router.visit(route('admin.petani.edit', record.id))}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Hapus petani ini?"
                        description="Data yang dihapus tidak dapat dikembalikan."
                        okText="Hapus"
                        okType="danger"
                        cancelText="Batal"
                        onConfirm={() => router.delete(route('admin.petani.destroy', record.id), { preserveScroll: true })}
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
        <AdminLayout title="Data Petani">
            <Head title="Data Petani" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: 'Master' },
                    { title: <><UserOutlined /> Petani</> },
                ]}
            />

            <Card
                className="shadow-sm border border-gray-100 rounded-xl"
                title={
                    <div className="flex items-center justify-between flex-wrap gap-3 py-1">
                        <Title level={5} className="!mb-0 !text-gray-800">Daftar Petani</Title>
                        <Space wrap>
                            <Select
                                allowClear
                                placeholder="Filter Gender"
                                style={{ width: 150 }}
                                value={filters.gender || undefined}
                                onChange={(val) => handleFilter({ gender: val ?? '' })}
                                options={GENDER_OPTIONS}
                            />
                            <Select
                                allowClear
                                placeholder="Filter Difabel"
                                style={{ width: 150 }}
                                value={filters.difabel !== undefined && filters.difabel !== '' ? filters.difabel : undefined}
                                onChange={(val) => handleFilter({ difabel: val ?? '' })}
                                options={DIFABEL_OPTIONS}
                            />
                            <Input
                                placeholder="Cari nama / NIK / alamat..."
                                prefix={<SearchOutlined className="text-gray-400" />}
                                defaultValue={filters.search}
                                onPressEnter={(e) => handleFilter({ search: e.target.value })}
                                onChange={(e) => setSearch(e.target.value)}
                                onBlur={() => handleFilter({ search })}
                                style={{ width: 260 }}
                                allowClear
                                onClear={() => handleFilter({ search: '' })}
                            />
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => router.visit(route('admin.petani.create'))}>Tambah</Button>
                        </Space>
                    </div>
                }
            >
                <Table
                    dataSource={petanis.data}
                    columns={columns}
                    rowKey="id"
                    scroll={{ x: 'max-content' }}
                    pagination={{
                        current: petanis.current_page,
                        total: petanis.total,
                        pageSize: petanis.per_page,
                        showSizeChanger: false,
                        showTotal: (total) => `Total ${total} petani`,
                        onChange: (page) => router.get(route('admin.petani.index'), { ...filters, page }, { preserveState: true }),
                    }}
                    rowClassName="hover:!bg-gray-50"
                />
            </Card>
        </AdminLayout>
    );
}
