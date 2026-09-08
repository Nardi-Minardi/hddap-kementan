import { router } from '@inertiajs/react';
import {
    Table, Card, Input, Select, Typography, Tag, Space, Button, Popconfirm, Tooltip, Modal,
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title, Text } = Typography;

export default function ClusterTab({ clusters, provinsis, kabKotas, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [modalOpen, setModalOpen] = useState(false);
    const [loadingPoktan, setLoadingPoktan] = useState(false);
    const [selectedCluster, setSelectedCluster] = useState(null);
    const [poktanList, setPoktanList] = useState([]);

    const goToList = (params = {}) => {
        router.get(route('admin.data-petani.index'), {
            tab: 'cluster',
            ...filters,
            ...params,
        }, { preserveState: true, replace: true });
    };

    const handleDelete = (id) => {
        router.delete(route('admin.cluster.destroy', id), {
            preserveScroll: true,
        });
    };

    const openPoktanModal = async (record) => {
        setSelectedCluster(record);
        setModalOpen(true);
        setLoadingPoktan(true);
        setPoktanList([]);

        try {
            const response = await fetch(route('admin.cluster.poktan', record.id), {
                headers: { Accept: 'application/json' },
            });

            if (!response.ok) {
                throw new Error('Gagal memuat data poktan.');
            }

            const data = await response.json();
            setSelectedCluster((prev) => ({ ...prev, ...data.cluster }));
            setPoktanList(data.poktan ?? []);
        } catch {
            setPoktanList([]);
        } finally {
            setLoadingPoktan(false);
        }
    };

    const closePoktanModal = () => {
        setModalOpen(false);
        setSelectedCluster(null);
        setPoktanList([]);
    };

    const poktanColumns = [
        {
            title: 'No',
            key: 'no',
            width: 55,
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Nama Poktan',
            dataIndex: 'nama_poktan',
            key: 'nama_poktan',
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
            title: 'Telepon',
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
            render: (value) => {
                const count = Number(value ?? 0);
                return count > 0
                    ? <Tag color="green">{count.toLocaleString('id-ID')}</Tag>
                    : <Tag>0</Tag>;
            },
        },
        {
            title: 'Alamat',
            dataIndex: 'alamat',
            key: 'alamat',
            render: (value) => value ?? '-',
        },
    ];

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
            render: (value, record) => {
                const count = Number(value ?? 0);

                if (count === 0) {
                    return <Tag>0</Tag>;
                }

                return (
                    <Button
                        type="link"
                        className="!h-auto !p-0"
                        onClick={() => openPoktanModal(record)}
                    >
                        <Tag color="blue" className="cursor-pointer hover:opacity-80">
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
        <>
            <Card
                className="border-0 shadow-none"
                title={
                    <div className="flex flex-wrap items-center justify-between gap-3 py-1">
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
                                onChange={(value) => goToList({ provinsi_code: value ?? '', kode_kota: '', page: 1 })}
                                options={provinsis.map((item) => ({ value: item.code, label: item.name }))}
                                showSearch
                                optionFilterProp="label"
                            />
                            <Select
                                allowClear
                                placeholder="Filter Kab/Kota"
                                style={{ width: 200 }}
                                value={filters.kode_kota || undefined}
                                onChange={(value) => goToList({ kode_kota: value ?? '', page: 1 })}
                                options={(kabKotas ?? []).map((item) => ({ value: item.code, label: item.name }))}
                                showSearch
                                disabled={!filters.provinsi_code}
                                optionFilterProp="label"
                            />
                            <Input
                                placeholder="Cari nama cluster / komoditas..."
                                prefix={<SearchOutlined className="text-gray-400" />}
                                value={search}
                                onPressEnter={(event) => goToList({ search: event.target.value, page: 1 })}
                                onChange={(event) => setSearch(event.target.value)}
                                onBlur={() => goToList({ search, page: 1 })}
                                style={{ width: 260 }}
                                allowClear
                                onClear={() => {
                                    setSearch('');
                                    goToList({ search: '', page: 1 });
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
                        onChange: (page) => goToList({ page }),
                    }}
                    rowClassName="hover:!bg-gray-50"
                />
            </Card>

            <Modal
                title="Daftar Kelompok Tani (Poktan)"
                open={modalOpen}
                onCancel={closePoktanModal}
                footer={[
                    <Button key="close" onClick={closePoktanModal}>
                        Tutup
                    </Button>,
                ]}
                width={960}
                destroyOnClose
            >
                {selectedCluster && (
                    <div className="mb-4 space-y-1">
                        <Text strong>{selectedCluster.nama_cluster ?? '-'}</Text>
                        <div className="text-sm text-gray-500">
                            Kab/Kota: {selectedCluster.nama_kota ?? selectedCluster.kab_kota?.name ?? '-'}
                            {' · '}
                            Komoditas: {selectedCluster.komoditas ?? selectedCluster.kumoditas?.kumoditas ?? '-'}
                            {' · '}
                            Jumlah: {poktanList.length.toLocaleString('id-ID')} poktan
                        </div>
                    </div>
                )}

                <Table
                    dataSource={poktanList}
                    columns={poktanColumns}
                    rowKey="id"
                    loading={loadingPoktan}
                    scroll={{ x: 900, y: 420 }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: false,
                        showTotal: (total) => `Total ${total} poktan`,
                    }}
                    size="small"
                />
            </Modal>
        </>
    );
}
