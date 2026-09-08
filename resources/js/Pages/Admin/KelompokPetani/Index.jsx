import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, usePage } from '@inertiajs/react';
import {
    Table, Card, Input, Select, Typography, Breadcrumb, Tag, Space, Modal, Button, Popconfirm, Tooltip, message,
} from 'antd';
import {
    DeleteOutlined, EditOutlined, HomeOutlined, PlusOutlined, SearchOutlined, UsergroupAddOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';

const { Title, Text } = Typography;

export default function KelompokPetaniIndex({ poktan, provinsis, kabKotas, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [modalOpen, setModalOpen] = useState(false);
    const [loadingAnggota, setLoadingAnggota] = useState(false);
    const [selectedPoktan, setSelectedPoktan] = useState(null);
    const [anggotaList, setAnggotaList] = useState([]);

    useEffect(() => {
        if (flash?.success) message.success(flash.success);
        if (flash?.error) message.error(flash.error);
    }, [flash]);

    const handleFilter = (params) => {
        router.get(
            route('admin.kelompok-petani.index'),
            { ...filters, ...params, page: 1 },
            { preserveState: true, replace: true },
        );
    };

    const openAnggotaModal = async (record) => {
        setSelectedPoktan(record);
        setModalOpen(true);
        setLoadingAnggota(true);
        setAnggotaList([]);

        try {
            const response = await fetch(route('admin.kelompok-petani.anggota', record.id), {
                headers: { Accept: 'application/json' },
            });

            if (!response.ok) {
                throw new Error('Gagal memuat data anggota.');
            }

            const data = await response.json();
            setSelectedPoktan((prev) => ({ ...prev, ...data.poktan }));
            setAnggotaList(data.anggota ?? []);
        } catch {
            setAnggotaList([]);
        } finally {
            setLoadingAnggota(false);
        }
    };

    const closeAnggotaModal = () => {
        setModalOpen(false);
        setSelectedPoktan(null);
        setAnggotaList([]);
    };

    const handleDelete = (id) => {
        router.delete(route('admin.kelompok-petani.destroy', id), {
            preserveScroll: true,
        });
    };

    const anggotaColumns = [
        {
            title: 'No',
            key: 'no',
            width: 55,
            render: (_, __, i) => i + 1,
        },
        {
            title: 'Nama Petani',
            dataIndex: 'nama_petani',
            key: 'nama_petani',
            width: 200,
            render: (value) => value ?? '-',
        },
        {
            title: 'NIK',
            dataIndex: 'nik_petani',
            key: 'nik_petani',
            width: 170,
            render: (value) => value ?? '-',
        },
        {
            title: 'No HP',
            dataIndex: 'no_hp_petani',
            key: 'no_hp_petani',
            width: 140,
            render: (value) => value ?? '-',
        },
        {
            title: 'Gender',
            dataIndex: 'gender_petani',
            key: 'gender_petani',
            width: 110,
            render: (value) => {
                if (value === 'L') {
                    return <Tag color="blue">Laki-laki</Tag>;
                }
                if (value === 'P') {
                    return <Tag color="pink">Perempuan</Tag>;
                }
                return '-';
            },
        },
        {
            title: 'Usia',
            dataIndex: 'usia_petani',
            key: 'usia_petani',
            width: 80,
            align: 'center',
            render: (value) => (value != null ? `${value} th` : '-'),
        },
        {
            title: 'Alamat',
            dataIndex: 'alamat_petani',
            key: 'alamat_petani',
            render: (value) => value ?? '-',
        },
    ];

    const columns = [
        {
            title: 'No',
            key: 'no',
            width: 55,
            fixed: 'left',
            render: (_, __, i) => (poktan.current_page - 1) * poktan.per_page + i + 1,
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
            render: (_, record) => record.kab_kota?.name ?? '-',
        },
        {
            title: 'Nama Cluster',
            key: 'nama_cluster',
            width: 200,
            render: (_, record) => record.cluster?.nama_cluster ?? '-',
        },
        {
            title: 'Nama Poktan',
            dataIndex: 'nama_poktan',
            key: 'nama_poktan',
            width: 220,
            render: (value) => value ?? '-',
        },
        {
            title: 'Ketua',
            dataIndex: 'ketua',
            key: 'ketua',
            width: 160,
            render: (value) => value ?? '-',
        },
        {
            title: 'Telp',
            dataIndex: 'telp',
            key: 'telp',
            width: 140,
            render: (value) => value ?? '-',
        },
        {
            title: 'Jumlah Anggota',
            dataIndex: 'jumlah_anggota',
            key: 'jumlah_anggota',
            width: 130,
            align: 'center',
            render: (value, record) => {
                const count = Number(value ?? 0);

                if (count === 0) {
                    return <Tag>0</Tag>;
                }

                return (
                    <Button
                        type="link"
                        className="!p-0 !h-auto"
                        onClick={() => openAnggotaModal(record)}
                    >
                        <Tag color="green" className="cursor-pointer hover:opacity-80">
                            {count.toLocaleString('id-ID')}
                        </Tag>
                    </Button>
                );
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
                            onClick={() => router.visit(route('admin.kelompok-petani.edit', record.id))}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Hapus kelompok petani ini?"
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
        <AdminLayout title="Kelompok Petani">
            <Head title="Kelompok Petani" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: 'Master' },
                    { title: <><UsergroupAddOutlined /> Kelompok Petani</> },
                ]}
            />

            <Card
                className="shadow-sm border border-gray-100 rounded-xl"
                title={
                    <div className="flex items-center justify-between flex-wrap gap-3 py-1">
                        <Title level={5} className="!mb-0 !text-gray-800">Daftar Kelompok Petani</Title>
                        <Space wrap>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => router.visit(route('admin.kelompok-petani.create'))}
                            >
                                Tambah
                            </Button>
                            <Select
                                allowClear
                                placeholder="Filter Provinsi"
                                style={{ width: 200 }}
                                value={filters.provinsi_code || undefined}
                                onChange={(val) => handleFilter({ provinsi_code: val ?? '', kode_kota: '' })}
                                options={provinsis.map((p) => ({ value: p.code, label: p.name }))}
                                showSearch
                                optionFilterProp="label"
                            />
                            <Select
                                allowClear
                                placeholder="Filter Kab/Kota"
                                style={{ width: 200 }}
                                value={filters.kode_kota || undefined}
                                onChange={(val) => handleFilter({ kode_kota: val ?? '' })}
                                options={(kabKotas ?? []).map((k) => ({ value: k.code, label: k.name }))}
                                showSearch
                                disabled={!filters.provinsi_code}
                                optionFilterProp="label"
                            />
                            <Input
                                placeholder="Cari nama poktan / ketua..."
                                prefix={<SearchOutlined className="text-gray-400" />}
                                value={search}
                                onPressEnter={(e) => handleFilter({ search: e.target.value })}
                                onChange={(e) => setSearch(e.target.value)}
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
                    dataSource={poktan.data}
                    columns={columns}
                    rowKey="id"
                    scroll={{ x: 1200 }}
                    pagination={{
                        current: poktan.current_page,
                        total: poktan.total,
                        pageSize: poktan.per_page,
                        showSizeChanger: false,
                        showTotal: (total) => `Total ${total} kelompok petani`,
                        onChange: (page) => router.get(
                            route('admin.kelompok-petani.index'),
                            { ...filters, page },
                            { preserveState: true },
                        ),
                    }}
                    rowClassName="hover:!bg-gray-50"
                />
            </Card>

            <Modal
                title="Detail Anggota Poktan"
                open={modalOpen}
                onCancel={closeAnggotaModal}
                footer={[
                    <Button key="close" onClick={closeAnggotaModal}>
                        Tutup
                    </Button>,
                ]}
                width={960}
                destroyOnClose
            >
                {selectedPoktan && (
                    <div className="mb-4 space-y-1">
                        <Text strong>{selectedPoktan.nama_poktan ?? '-'}</Text>
                        <div className="text-sm text-gray-500">
                            Cluster: {selectedPoktan.nama_cluster ?? selectedPoktan.cluster?.nama_cluster ?? '-'}
                            {' · '}
                            Ketua: {selectedPoktan.ketua ?? '-'}
                            {' · '}
                            Jumlah: {anggotaList.length.toLocaleString('id-ID')} anggota
                        </div>
                    </div>
                )}

                <Table
                    dataSource={anggotaList}
                    columns={anggotaColumns}
                    rowKey="id"
                    loading={loadingAnggota}
                    scroll={{ x: 900, y: 420 }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: false,
                        showTotal: (total) => `Total ${total} anggota`,
                    }}
                    size="small"
                />
            </Modal>
        </AdminLayout>
    );
}
