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

export default function JenisPelatihanIndex({ jenisPelatihan, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        if (flash?.success) message.success(flash.success);
        if (flash?.error) message.error(flash.error);
    }, [flash]);

    const handleSearch = (value) => {
        router.get(
            route('admin.data-verval.jenis-pelatihan.index'),
            { search: value || undefined, page: 1 },
            { preserveState: true, replace: true },
        );
    };

    const handleDelete = (kdjenis) => {
        router.delete(route('admin.data-verval.jenis-pelatihan.destroy', kdjenis), {
            preserveScroll: true,
            onSuccess: () => message.success('Jenis pelatihan berhasil dihapus.'),
        });
    };

    const columns = [
        {
            title: 'No',
            key: 'no',
            width: 60,
            align: 'center',
            render: (_, __, index) =>
                (jenisPelatihan.current_page - 1) * jenisPelatihan.per_page + index + 1,
        },
        {
            title: 'Jenis Topik',
            key: 'jenis_topik',
            ellipsis: true,
            render: (_, record) =>
                record.pelatihan_topik?.nama_kegiatan
                || record.jenis_pelatihan
                || '-',
        },
        {
            title: 'Nama Acara',
            dataIndex: 'nama_pelatihan',
            key: 'nama_pelatihan',
        },
        {
            title: 'Metode',
            dataIndex: 'metode_acara',
            key: 'metode_acara',
            width: 110,
            render: (value) => value || '-',
        },
        {
            title: 'Lokasi',
            key: 'lokasi',
            render: (_, record) => record.kab_kota?.name ?? '-',
        },
        {
            title: 'Tanggal Mulai',
            dataIndex: 'tanggal_mulai',
            key: 'tanggal_mulai',
            width: 130,
            render: (value) => {
                if (!value) {
                    return '-';
                }

                return new Date(`${value}T00:00:00`).toLocaleDateString('id-ID');
            },
        },
        {
            title: 'Jumlah Peserta',
            dataIndex: 'jumlah_peserta',
            key: 'jumlah_peserta',
            width: 120,
            align: 'center',
            render: (value) => value ?? 0,
        },
        {
            title: 'Laki-laki',
            dataIndex: 'jumlah_laki_laki',
            key: 'jumlah_laki_laki',
            width: 100,
            align: 'center',
            render: (value) => value ?? 0,
        },
        {
            title: 'Perempuan',
            dataIndex: 'jumlah_perempuan',
            key: 'jumlah_perempuan',
            width: 100,
            align: 'center',
            render: (value) => value ?? 0,
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
                            onClick={() => router.visit(route('admin.data-verval.jenis-pelatihan.edit', record.kdjenis))}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Hapus jenis pelatihan ini?"
                        description="Data yang dihapus tidak dapat dikembalikan."
                        okText="Hapus"
                        okType="danger"
                        cancelText="Batal"
                        onConfirm={() => handleDelete(record.kdjenis)}
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
        <AdminLayout title="Management event">
            <Head title="Management event" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: 'Kegiatan Bimtek/Sosialisasi' },
                    { title: 'Management event' },
                ]}
            />

            <Card
                className="rounded-xl border border-gray-100 shadow-sm"
                title={
                    <div className="flex flex-wrap items-center justify-between gap-3 py-1">
                        <Title level={5} className="!mb-0 !text-gray-800">
                            <ReadOutlined className="mr-2 text-emerald-500" />
                            Daftar Management event
                        </Title>
                        <Space wrap>
                            <Input.Search
                                allowClear
                                placeholder="Cari jenis atau nama pelatihan..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onSearch={handleSearch}
                                enterButton={<SearchOutlined />}
                                style={{ width: 300 }}
                            />
                            <Link href={route('admin.data-verval.jenis-pelatihan.create')}>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    className="!border-emerald-500 !bg-emerald-500 hover:!bg-emerald-600"
                                >
                                    Tambah Event
                                </Button>
                            </Link>
                        </Space>
                    </div>
                }
            >
                <Table
                    dataSource={jenisPelatihan.data}
                    columns={columns}
                    rowKey="kdjenis"
                    scroll={{ x: 1200 }}
                    pagination={{
                        current: jenisPelatihan.current_page,
                        total: jenisPelatihan.total,
                        pageSize: jenisPelatihan.per_page,
                        showSizeChanger: false,
                        showTotal: (total) => `Total ${total} data`,
                        onChange: (page) => {
                            router.get(
                                route('admin.data-verval.jenis-pelatihan.index'),
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
