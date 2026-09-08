import axios from 'axios';
import { router } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Button,
    Input,
    Modal,
    Select,
    Space,
    Table,
    Typography,
    message,
} from 'antd';
import {
    CloseOutlined,
    ReloadOutlined,
    SaveOutlined,
    SearchOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

function genderLabel(value) {
    if (value === 'L') {
        return 'Laki-laki';
    }

    if (value === 'P') {
        return 'Perempuan';
    }

    return '-';
}

export default function PilihPetaniModal({
    open,
    onClose,
    kdjenis,
    provinsis = [],
}) {
    const [searchInput, setSearchInput] = useState('');
    const [filters, setFilters] = useState({
        provinsi_code: null,
        kode_kota: null,
        kode_cluster: null,
        kode_poktan: null,
    });
    const [appliedFilters, setAppliedFilters] = useState(null);
    const [page, setPage] = useState(1);
    const [perPage] = useState(50);
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [kabKotas, setKabKotas] = useState([]);
    const [clusters, setClusters] = useState([]);
    const [poktans, setPoktans] = useState([]);

    const clearTableData = () => {
        setData([]);
        setMeta({ current_page: 1, last_page: 1, total: 0 });
        setSelectedRowKeys([]);
        setAppliedFilters(null);
        setHasSearched(false);
        setPage(1);
    };

    const resetState = () => {
        setSearchInput('');
        setFilters({
            provinsi_code: null,
            kode_kota: null,
            kode_cluster: null,
            kode_poktan: null,
        });
        clearTableData();
        setKabKotas([]);
        setClusters([]);
        setPoktans([]);
    };

    const loadPetani = useCallback(async (activeFilters, activePage) => {
        setLoading(true);

        try {
            const response = await axios.get(
                route('admin.data-verval.jenis-pelatihan.api.petani', kdjenis),
                {
                    params: {
                        search: activeFilters.search || undefined,
                        provinsi_code: activeFilters.provinsi_code || undefined,
                        kode_kota: activeFilters.kode_kota ?? undefined,
                        kode_cluster: activeFilters.kode_cluster ?? undefined,
                        kode_poktan: activeFilters.kode_poktan ?? undefined,
                        page: activePage,
                        per_page: perPage,
                    },
                },
            );

            setData(response.data.data ?? []);
            setMeta(response.data.meta ?? { current_page: 1, last_page: 1, total: 0 });
            setSelectedRowKeys([]);
        } catch {
            message.error('Gagal memuat data petani.');
            clearTableData();
        } finally {
            setLoading(false);
        }
    }, [kdjenis, perPage]);

    useEffect(() => {
        if (!open) {
            resetState();
            return;
        }

        const initializeModal = async () => {
            await loadKabKota();
            applyFilters(buildFilters());
        };

        initializeModal();
    }, [open]);

    useEffect(() => {
        if (!open || !hasSearched || !appliedFilters) {
            return;
        }

        loadPetani(appliedFilters, page);
    }, [open, hasSearched, page, appliedFilters, loadPetani]);

    const loadKabKota = async (provinsiCode = null) => {
        const response = await axios.get(route('admin.data-verval.jenis-pelatihan.api.kab-kota'), {
            params: provinsiCode ? { provinsi_code: provinsiCode } : {},
        });

        setKabKotas(response.data);
    };

    const buildFilters = (overrides = {}) => ({
        search: searchInput.trim(),
        provinsi_code: filters.provinsi_code,
        kode_kota: filters.kode_kota,
        kode_cluster: filters.kode_cluster,
        kode_poktan: filters.kode_poktan,
        ...overrides,
    });

    const applyFilters = (nextFilters) => {
        setAppliedFilters(nextFilters);
        setPage(1);
        setHasSearched(true);
    };

    const loadClusters = async (kodeKota) => {
        if (!kodeKota) {
            setClusters([]);
            return;
        }

        const response = await axios.get(route('admin.data-verval.jenis-pelatihan.api.cluster'), {
            params: { kode_kota: kodeKota },
        });

        setClusters(response.data);
    };

    const loadPoktans = async (kodeKota, kodeCluster = null) => {
        if (!kodeKota) {
            setPoktans([]);
            return;
        }

        const response = await axios.get(route('admin.data-verval.jenis-pelatihan.api.poktan'), {
            params: {
                kode_kota: kodeKota,
                kode_cluster: kodeCluster ?? undefined,
            },
        });

        setPoktans(response.data);
    };

    const handleSearch = () => {
        applyFilters(buildFilters());
    };

    const handleProvinsiChange = async (value) => {
        setFilters((current) => ({
            ...current,
            provinsi_code: value ?? null,
            kode_kota: null,
            kode_cluster: null,
            kode_poktan: null,
        }));
        setClusters([]);
        setPoktans([]);
        await loadKabKota(value ?? null);
    };

    const handleKabKotaChange = async (value) => {
        setFilters((current) => ({
            ...current,
            kode_kota: value ?? null,
            kode_cluster: null,
            kode_poktan: null,
        }));
        setClusters([]);
        setPoktans([]);

        if (value) {
            await Promise.all([
                loadClusters(value),
                loadPoktans(value),
            ]);
        }
    };

    const handleClusterChange = async (value) => {
        setFilters((current) => ({
            ...current,
            kode_cluster: value ?? null,
            kode_poktan: null,
        }));
        setPoktans([]);

        if (filters.kode_kota) {
            await loadPoktans(filters.kode_kota, value);
        }
    };

    const handlePoktanChange = (value) => {
        setFilters((current) => ({
            ...current,
            kode_poktan: value ?? null,
        }));
    };

    const handleSelectAll = () => {
        setSelectedRowKeys(data.map((item) => item.id));
    };

    const handleClearSelection = () => {
        setSelectedRowKeys([]);
    };

    const handleSave = () => {
        if (selectedRowKeys.length === 0) {
            message.warning('Pilih minimal satu petani.');
            return;
        }

        setSubmitting(true);
        router.post(
            route('admin.data-verval.jenis-pelatihan.peserta.store', kdjenis),
            {
                tipe_peserta: 'petani',
                m_petani_ids: selectedRowKeys,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                    message.success(`${selectedRowKeys.length} peserta petani berhasil ditambahkan.`);
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0];
                    message.error(Array.isArray(firstError) ? firstError[0] : firstError);
                },
                onFinish: () => setSubmitting(false),
            },
        );
    };

    const rowSelection = useMemo(() => ({
        selectedRowKeys,
        onChange: setSelectedRowKeys,
    }), [selectedRowKeys]);

    const columns = [
        {
            title: 'Nama',
            dataIndex: 'nama',
            key: 'nama',
            ellipsis: true,
        },
        {
            title: 'NIK',
            dataIndex: 'nik',
            key: 'nik',
            width: 190,
        },
        {
            title: 'Jenis Kelamin',
            dataIndex: 'jenis_kelamin',
            key: 'jenis_kelamin',
            width: 130,
            render: (value) => genderLabel(value),
        },
        {
            title: 'Umur',
            dataIndex: 'umur',
            key: 'umur',
            width: 80,
            align: 'center',
            render: (value) => value ?? '-',
        },
        {
            title: 'Kabupaten',
            dataIndex: 'kabupaten',
            key: 'kabupaten',
            ellipsis: true,
        },
    ];

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width="92vw"
            style={{ maxWidth: 1280, top: 24 }}
            closable={false}
            styles={{
                content: { padding: 0, overflow: 'hidden' },
                body: { padding: 0 },
            }}
        >
            <div className="flex items-center justify-between bg-emerald-600 px-5 py-3">
                <span className="text-base font-semibold text-white">Daftar Petani</span>
                <Button
                    type="text"
                    icon={<CloseOutlined className="!text-white" />}
                    onClick={onClose}
                    className="!text-white hover:!bg-emerald-700"
                />
            </div>

            <div className="space-y-3 p-4">
                <div className="flex flex-wrap items-center gap-2">
                    <Button size="small" onClick={handleSelectAll} disabled={!data.length}>
                        Tandai Semua
                    </Button>
                    <Button size="small" onClick={handleClearSelection} disabled={!selectedRowKeys.length}>
                        Jangan Tandai Semua
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Input
                        allowClear
                        placeholder="Cari berdasar nama / id"
                        prefix={<SearchOutlined />}
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onPressEnter={handleSearch}
                        style={{ width: 220 }}
                    />
                    <Select
                        allowClear
                        showSearch
                        placeholder="Semua Provinsi"
                        style={{ width: 180 }}
                        optionFilterProp="label"
                        value={filters.provinsi_code ?? undefined}
                        onChange={handleProvinsiChange}
                        options={provinsis.map((item) => ({ value: item.code, label: item.name }))}
                    />
                    <Select
                        allowClear
                        showSearch
                        placeholder="Semua Kabupaten"
                        style={{ width: 180 }}
                        optionFilterProp="label"
                        value={filters.kode_kota ?? undefined}
                        onChange={handleKabKotaChange}
                        options={kabKotas.map((item) => ({ value: Number(item.code), label: item.name }))}
                    />
                    <Select
                        allowClear
                        showSearch
                        placeholder="Semua Kluster"
                        style={{ width: 180 }}
                        optionFilterProp="label"
                        value={filters.kode_cluster ?? undefined}
                        onChange={handleClusterChange}
                        disabled={!filters.kode_kota}
                        options={clusters.map((item) => ({ value: item.id, label: item.nama_cluster }))}
                    />
                    <Select
                        allowClear
                        showSearch
                        placeholder="Semua Kelompok Tani"
                        style={{ width: 200 }}
                        optionFilterProp="label"
                        value={filters.kode_poktan ?? undefined}
                        onChange={handlePoktanChange}
                        disabled={!filters.kode_kota}
                        options={poktans.map((item) => ({ value: item.id, label: item.nama_poktan }))}
                    />
                    <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                        Pencarian
                    </Button>
                </div>

                <Table
                    rowSelection={rowSelection}
                    dataSource={data}
                    columns={columns}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        current: meta.current_page,
                        total: meta.total,
                        pageSize: perPage,
                        showSizeChanger: false,
                        showTotal: (total) => `${total} data`,
                        onChange: (nextPage) => setPage(nextPage),
                    }}
                    scroll={{ x: 900, y: 400 }}
                    size="small"
                    locale={{
                        emptyText: 'Tidak Ada Data',
                    }}
                />

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
                    <Space>
                        <Text type="secondary">
                            Halaman {meta.current_page} dari {Math.max(meta.last_page, 1)}
                        </Text>
                        <Button
                            size="small"
                            icon={<ReloadOutlined />}
                            disabled={!hasSearched}
                            onClick={() => appliedFilters && loadPetani(appliedFilters, page)}
                        />
                        <Text type="secondary">
                            {meta.total > 0 ? `${meta.total} data tersedia` : 'tidak ada data untuk ditampilkan'}
                        </Text>
                    </Space>
                    <Space>
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            loading={submitting}
                            onClick={handleSave}
                        >
                            Simpan
                        </Button>
                        <Button icon={<CloseOutlined />} onClick={onClose}>
                            Tutup
                        </Button>
                    </Space>
                </div>
            </div>
        </Modal>
    );
}
