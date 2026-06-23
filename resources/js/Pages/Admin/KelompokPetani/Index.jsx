import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { Table, Card, Input, Select, Typography, Breadcrumb, Tag, Space, Tooltip, Button, Popconfirm } from 'antd';
import { HomeOutlined, UsergroupAddOutlined, SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title } = Typography;

export default function KelompokPetaniIndex({ poktan, provinsis, kabKotas, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleFilter = (params) => {
        router.get(route('admin.kelompok-petani.index'), { ...filters, ...params, page: 1 }, { preserveState: true, replace: true });
    };

    const col = (title, dataIndex, width = 150) => ({
        title,
        dataIndex,
        key: dataIndex,
        width,
        render: (v) => v ?? '-',
    });

    const columns = [
        { title: 'No', key: 'no', width: 55, fixed: 'left', render: (_, __, i) => (poktan.current_page - 1) * poktan.per_page + i + 1 },
        {
            title: 'Aksi', key: 'action', width: 90, fixed: 'left', align: 'center',
            render: (_, record) => (
                <Space size={4}>
                    <Tooltip title="Edit">
                        <Button size="small" type="primary" ghost icon={<EditOutlined />}
                            onClick={() => router.visit(route('admin.kelompok-petani.edit', record.id))} />
                    </Tooltip>
                    <Popconfirm
                        title="Hapus kelompok petani ini?"
                        description="Data yang dihapus tidak dapat dikembalikan."
                        okText="Hapus" okType="danger" cancelText="Batal"
                        onConfirm={() => router.delete(route('admin.kelompok-petani.destroy', record.id), { preserveScroll: true })}
                    >
                        <Tooltip title="Hapus">
                            <Button size="small" danger icon={<DeleteOutlined />} />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
        col('Provinsi', 'provinsi_name', 160),
        col('Kab/Kota', 'kab_kota_name', 180),
        col('Kecamatan', 'kecamatan_name', 180),
        col('Kel/Desa', 'kel_des_name', 160),
        col('Nama Poktan', 'nama_poktan', 200),
        {
            title: 'Luas (Ha)', dataIndex: 'luas_layanan_poktan', key: 'luas_layanan_poktan', width: 110, align: 'right',
            render: (v) => v != null ? <Tag color="green">{Number(v).toLocaleString('id-ID')}</Tag> : '-',
        },
        col('Tahun Bentuk', 'tahun_pembentukan', 120),
        col('Diketahui PIC', 'diketahui_pic', 150),
        col('SK Bupati', 'sk_bupati', 130),
        col('Akte Notaris', 'akte_notaris', 140),
        col('Ket. Terdaftar Pengadilan', 'ket_terdaftar_pengadilan', 200),
        col('Nama Ketua', 'nama_ketua_poktan', 180),
        col('No HP Ketua', 'no_hp_ketua_poktan', 140),
        col('Gender Ketua', 'gender_ketua_poktan', 130),
        col('Gender Wakil', 'gender_wakil_poktan', 130),
        col('Gender Sekretaris', 'gender_sekretaris_poktan', 150),
        col('Gender Bendahara', 'gender_bendahara_poktan', 155),
        { ...col('Jml Pengurus', 'jumlah_pengurus_poktan', 120), align: 'center' },
        { ...col('Jml Anggota', 'jumlah_anggota_poktan', 120), align: 'center' },
        { ...col('Anggota Pria', 'jumlah_anggota_pria_poktan', 120), align: 'center' },
        { ...col('Anggota Wanita', 'jumlah_anggota_wanita_poktan', 130), align: 'center' },
        col('AD/ART', 'ad_art', 120),
        col('Alamat Sekretariat', 'alamat_kantor_sekretariat', 220),
        col('Pengisian Buku', 'pengisian_buku', 140),
        col('Iuran', 'iuran', 120),
        col('Keterangan', 'keterangan', 200),
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
                            <Select
                                allowClear
                                placeholder="Filter Provinsi"
                                style={{ width: 200 }}
                                value={filters.provinsi_id ? Number(filters.provinsi_id) : undefined}
                                onChange={(val) => handleFilter({ provinsi_id: val ?? '', kab_kota_id: '' })}
                                options={provinsis.map((p) => ({ value: p.id, label: p.name }))}
                                showSearch
                                filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                            />
                            <Select
                                allowClear
                                placeholder="Filter Kab/Kota"
                                style={{ width: 200 }}
                                value={filters.kab_kota_id ? Number(filters.kab_kota_id) : undefined}
                                onChange={(val) => handleFilter({ kab_kota_id: val ?? '' })}
                                options={(kabKotas ?? []).map((k) => ({ value: k.id, label: k.name }))}
                                showSearch
                                disabled={!filters.provinsi_id}
                                filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                            />
                            <Input
                                placeholder="Cari nama poktan / ketua..."
                                prefix={<SearchOutlined className="text-gray-400" />}
                                defaultValue={filters.search}
                                onPressEnter={(e) => handleFilter({ search: e.target.value })}
                                onChange={(e) => setSearch(e.target.value)}
                                onBlur={() => handleFilter({ search })}
                                style={{ width: 260 }}
                                allowClear
                                onClear={() => handleFilter({ search: '' })}
                            />
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => router.visit(route('admin.kelompok-petani.create'))}>Tambah</Button>
                        </Space>
                    </div>
                }
            >
                <Table
                    dataSource={poktan.data}
                    columns={columns}
                    rowKey="id"
                    scroll={{ x: 'max-content' }}
                    pagination={{
                        current: poktan.current_page,
                        total: poktan.total,
                        pageSize: poktan.per_page,
                        showSizeChanger: false,
                        showTotal: (total) => `Total ${total} kelompok petani`,
                        onChange: (page) => router.get(route('admin.kelompok-petani.index'), { ...filters, page }, { preserveState: true }),
                    }}
                    rowClassName="hover:!bg-gray-50"
                />
            </Card>
        </AdminLayout>
    );
}
