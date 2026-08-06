import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Breadcrumb,
    Button,
    Card,
    Input,
    Popconfirm,
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
    ReadOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

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

export default function PelatihanIndex({ pelatihan, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        if (flash?.success) message.success(flash.success);
        if (flash?.error) message.error(flash.error);
    }, [flash]);

    const handleSearch = (value) => {
        router.get(
            route('admin.data-verval.pelatihan.index'),
            { search: value || undefined, page: 1 },
            { preserveState: true, replace: true },
        );
    };

    const handleDelete = (kdPelatihan) => {
        router.delete(route('admin.data-verval.pelatihan.destroy', kdPelatihan), {
            preserveScroll: true,
            onSuccess: () => message.success('Data pelatihan berhasil dihapus.'),
        });
    };

    const columns = [
        {
            title: 'No',
            key: 'no',
            width: 60,
            align: 'center',
            render: (_, __, index) =>
                (pelatihan.current_page - 1) * pelatihan.per_page + index + 1,
        },
        {
            title: 'Jenis Pelatihan',
            key: 'jenis_pelatihan',
            render: (_, record) => record.jenis_pelatihan?.jenis_pelatihan || '-',
        },
        {
            title: 'Nama Pelatihan',
            key: 'nama_pelatihan',
            render: (_, record) => record.jenis_pelatihan?.nama_pelatihan || '-',
        },
        {
            title: 'Tanggal',
            dataIndex: 'tanggal',
            key: 'tanggal',
            width: 130,
            render: (value) => formatDate(value),
        },
        {
            title: 'Lokasi',
            dataIndex: 'lokasi',
            key: 'lokasi',
        },
        {
            title: 'Jumlah JPL',
            dataIndex: 'jumlah_jpl',
            key: 'jumlah_jpl',
            width: 110,
            align: 'center',
        },
        {
            title: 'Laki-laki',
            dataIndex: 'laki_laki',
            key: 'laki_laki',
            width: 100,
            align: 'center',
        },
        {
            title: 'Perempuan',
            dataIndex: 'perempuan',
            key: 'perempuan',
            width: 100,
            align: 'center',
        },
        {
            title: 'Total',
            key: 'total_peserta',
            width: 90,
            align: 'center',
            render: (_, record) => (record.laki_laki ?? 0) + (record.perempuan ?? 0),
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
                            onClick={() => router.visit(route('admin.data-verval.pelatihan.edit', record.kd_pelatihan))}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Hapus data pelatihan ini?"
                        description="Data yang dihapus tidak dapat dikembalikan."
                        okText="Hapus"
                        okType="danger"
                        cancelText="Batal"
                        onConfirm={() => handleDelete(record.kd_pelatihan)}
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
        <AdminLayout title="Pelatihan">
            <Head title="Pelatihan" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: 'Data Pelatihan' },
                    { title: 'Pelatihan' },
                ]}
            />

            <Card
                className="rounded-xl border border-gray-100 shadow-sm"
                title={
                    <div className="flex flex-wrap items-center justify-between gap-3 py-1">
                        <Title level={5} className="!mb-0 !text-gray-800">
                            <ReadOutlined className="mr-2 text-emerald-500" />
                            Daftar Pelatihan
                        </Title>
                        <Space wrap>
                            <Input.Search
                                allowClear
                                placeholder="Cari lokasi atau jenis pelatihan..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onSearch={handleSearch}
                                enterButton={<SearchOutlined />}
                                style={{ width: 280 }}
                            />
                            <Link href={route('admin.data-verval.pelatihan.create')}>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    className="!border-emerald-500 !bg-emerald-500 hover:!bg-emerald-600"
                                >
                                    Tambah Pelatihan
                                </Button>
                            </Link>
                        </Space>
                    </div>
                }
            >
                <Table
                    dataSource={pelatihan.data}
                    columns={columns}
                    rowKey="kd_pelatihan"
                    scroll={{ x: 1100 }}
                    pagination={{
                        current: pelatihan.current_page,
                        total: pelatihan.total,
                        pageSize: pelatihan.per_page,
                        showSizeChanger: false,
                        showTotal: (total) => `Total ${total} data`,
                        onChange: (page) => {
                            router.get(
                                route('admin.data-verval.pelatihan.index'),
                                { search: filters.search, page },
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
