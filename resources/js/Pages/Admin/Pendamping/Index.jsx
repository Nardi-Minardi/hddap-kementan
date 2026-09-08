import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Breadcrumb,
    Button,
    Card,
    Input,
    Popconfirm,
    Select,
    Space,
    Table,
    Tooltip,
    Typography,
    message,
} from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    HomeOutlined,
    PlusOutlined,
    SearchOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';

const { Title } = Typography;

function formatDate(value) {
    if (!value) {
        return '-';
    }

    return new Date(value).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function genderLabel(value) {
    const normalized = String(value ?? '').trim().toLowerCase();

    if (normalized === 'l' || normalized === 'laki-laki' || normalized === 'laki laki') {
        return 'Laki-laki';
    }

    if (normalized === 'p' || normalized === 'perempuan') {
        return 'Perempuan';
    }

    return '-';
}

export default function PendampingIndex({
    pendampingList,
    filters,
    kabKotaOptions = [],
    bidangOptions = [],
    pendampingOptions = [],
}) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        if (flash?.success) message.success(flash.success);
        if (flash?.error) message.error(flash.error);
    }, [flash]);

    const applyFilters = (overrides = {}) => {
        router.get(
            route('admin.pendamping.index'),
            {
                search: search || undefined,
                kode_kota: filters.kode_kota || undefined,
                bidang: filters.bidang || undefined,
                pendamping: filters.pendamping || undefined,
                page: 1,
                ...overrides,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleDelete = (no) => {
        router.delete(route('admin.pendamping.destroy', no), {
            preserveScroll: true,
            onSuccess: () => message.success('Data fasilitator berhasil dihapus.'),
        });
    };

    const columns = [
        {
            title: 'Nama Fasilitator',
            dataIndex: 'nama_fasilitator',
            key: 'nama_fasilitator',
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            width: 110,
            render: (value) => genderLabel(value),
        },
        {
            title: 'Tanggal Lahir',
            dataIndex: 'tanggal_lahir',
            key: 'tanggal_lahir',
            width: 130,
            render: (value) => formatDate(value),
        },
        {
            title: 'Kota/Kabupaten',
            key: 'kode_kota',
            render: (_, record) => record.kab_kota?.name || '-',
        },
        {
            title: 'Bidang',
            dataIndex: 'bidang',
            key: 'bidang',
            width: 110,
        },
        {
            title: 'Pendamping',
            dataIndex: 'pendamping',
            key: 'pendamping',
            width: 120,
        },
        {
            title: 'Domisili',
            dataIndex: 'domisili',
            key: 'domisili',
            render: (value) => value || '-',
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
                            onClick={() => router.visit(route('admin.pendamping.edit', record.no))}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Hapus data fasilitator ini?"
                        description="Data yang dihapus tidak dapat dikembalikan."
                        okText="Hapus"
                        okType="danger"
                        cancelText="Batal"
                        onConfirm={() => handleDelete(record.no)}
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
        <AdminLayout title="Fasilitator">
            <Head title="Fasilitator" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: 'Master' },
                    { title: 'Fasilitator' },
                ]}
            />

            <Card
                className="rounded-xl border border-gray-100 shadow-sm"
                title={
                    <div className="flex flex-wrap items-center justify-between gap-3 py-1">
                        <Title level={5} className="!mb-0 !text-gray-800">
                            <TeamOutlined className="mr-2 text-emerald-500" />
                            Daftar Fasilitator
                        </Title>
                        <Space wrap>
                            <Input.Search
                                allowClear
                                placeholder="Cari nama, domisili, bidang..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onSearch={(value) => applyFilters({ search: value || undefined })}
                                enterButton={<SearchOutlined />}
                                style={{ width: 260 }}
                            />
                            <Link href={route('admin.pendamping.create')}>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    className="!border-emerald-500 !bg-emerald-500 hover:!bg-emerald-600"
                                >
                                    Tambah Fasilitator
                                </Button>
                            </Link>
                        </Space>
                    </div>
                }
            >
                <Space wrap className="mb-4">
                    <Select
                        allowClear
                        placeholder="Filter Kota/Kabupaten"
                        style={{ width: 220 }}
                        value={filters.kode_kota || undefined}
                        onChange={(value) => applyFilters({ kode_kota: value || undefined })}
                        options={kabKotaOptions}
                        optionFilterProp="label"
                    />
                    <Select
                        allowClear
                        placeholder="Filter Bidang"
                        style={{ width: 160 }}
                        value={filters.bidang || undefined}
                        onChange={(value) => applyFilters({ bidang: value || undefined })}
                        options={bidangOptions}
                    />
                    <Select
                        allowClear
                        placeholder="Filter Pendamping"
                        style={{ width: 160 }}
                        value={filters.pendamping || undefined}
                        onChange={(value) => applyFilters({ pendamping: value || undefined })}
                        options={pendampingOptions}
                    />
                </Space>

                <Table
                    dataSource={pendampingList.data}
                    columns={columns}
                    rowKey="no"
                    scroll={{ x: 1200 }}
                    pagination={{
                        current: pendampingList.current_page,
                        total: pendampingList.total,
                        pageSize: pendampingList.per_page,
                        showSizeChanger: false,
                        showTotal: (total) => `Total ${total} data`,
                        onChange: (page) => {
                            router.get(
                                route('admin.pendamping.index'),
                                { ...filters, page },
                                { preserveState: true, replace: true },
                            );
                        },
                    }}
                    rowClassName="hover:!bg-gray-50"
                />
            </Card>
        </AdminLayout>
    );
}
