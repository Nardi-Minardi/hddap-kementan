import CoordinateMapPicker from '@/Components/CoordinateMapPicker';
import axios from 'axios';
import { Alert, Form, Input, InputNumber, Select, Switch, Upload, Divider, Row, Col } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

const GENDER_OPTIONS = [
    { value: 'L', label: 'Laki-laki' },
    { value: 'P', label: 'Perempuan' },
];

function parseCoordinate(value) {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const parsed = typeof value === 'number'
        ? value
        : parseFloat(String(value).trim().replace(',', '.'));

    return Number.isFinite(parsed) ? parsed : null;
}

function normalizeOptionValue(value) {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : value;
}

export default function PetaniFormFields({
    data,
    setData,
    errors = {},
    existingFotoUrl = null,
    showKabKota = true,
    kabKotaOptions = [],
    defaultKodeKota = null,
}) {
    const [clusters, setClusters] = useState([]);
    const [poktans, setPoktans] = useState([]);
    const [loadingCluster, setLoadingCluster] = useState(false);
    const [loadingPoktan, setLoadingPoktan] = useState(false);

    const kabKotaSelectOptions = kabKotaOptions.map((item) => ({
        value: normalizeOptionValue(item.value),
        label: item.label,
    }));

    const selectedKabKota = normalizeOptionValue(data.kode_kota ?? defaultKodeKota);
    const kabKotaDisplayName = kabKotaSelectOptions.find(
        (item) => item.value === selectedKabKota,
    )?.label ?? null;

    const lockedKabKota = !showKabKota && selectedKabKota;
    const lockedKabKotaLabel = kabKotaDisplayName;

    const loadClusters = async (kodeKota) => {
        if (!kodeKota) {
            setClusters([]);
            return;
        }

        setLoadingCluster(true);
        try {
            const response = await axios.get(route('admin.petani.api.cluster'), {
                params: { kode_kota: kodeKota },
            });
            setClusters(response.data);
        } finally {
            setLoadingCluster(false);
        }
    };

    const loadPoktans = async (kodeCluster) => {
        if (!kodeCluster) {
            setPoktans([]);
            return;
        }

        setLoadingPoktan(true);
        try {
            const response = await axios.get(route('admin.petani.api.poktan'), {
                params: { kode_cluster: kodeCluster },
            });
            setPoktans(response.data);
        } finally {
            setLoadingPoktan(false);
        }
    };

    useEffect(() => {
        if (!data.kode_kota) {
            setClusters([]);
            return;
        }

        loadClusters(data.kode_kota);
    }, [data.kode_kota]);

    useEffect(() => {
        if (!data.kode_cluster) {
            setPoktans([]);
            return;
        }

        loadPoktans(data.kode_cluster);
    }, [data.kode_cluster]);

    const handleKabKotaChange = (value) => {
        setData({
            ...data,
            kode_kota: value ?? null,
            kode_cluster: null,
            kode_poktan: null,
        });
    };

    const handleClusterChange = (value) => {
        setData({
            ...data,
            kode_cluster: value ?? null,
            kode_poktan: null,
        });
    };

    const lokasiReady = Boolean(data.kode_kota);
    const clusterReady = Boolean(data.kode_cluster);

    const fotoPreview = data.foto_lahan instanceof File
        ? URL.createObjectURL(data.foto_lahan)
        : existingFotoUrl;

    const handleCoordinateChange = (latitude, longitude) => {
        setData('latitude', latitude);
        setData('longitude', longitude);
    };

    return (
        <>
            <Divider orientation="left" orientationMargin={0} className="!text-gray-500 !text-sm">
                Kab/Kota, Kluster & Kelompok Tani
            </Divider>

            {!lokasiReady && showKabKota && (
                <Alert
                    type="info"
                    showIcon
                    className="!mb-4"
                    message="Pilih Kab/Kota terlebih dahulu, lalu pilih Kluster dan Kelompok Tani."
                />
            )}

            <Row gutter={[16, 0]}>
                {showKabKota ? (
                    <Col xs={24} sm={12} lg={8}>
                        <Form.Item
                            label="Kab/Kota"
                            required
                            validateStatus={errors.kode_kota ? 'error' : ''}
                            help={errors.kode_kota}
                        >
                            <Select
                                showSearch
                                allowClear
                                size="large"
                                placeholder="Pilih Kab/Kota"
                                value={selectedKabKota ?? undefined}
                                onChange={handleKabKotaChange}
                                options={kabKotaSelectOptions}
                                optionFilterProp="label"
                            />
                        </Form.Item>
                    </Col>
                ) : (
                    <Col xs={24} sm={12} lg={8}>
                        <Form.Item label="Kab/Kota">
                            <Input
                                size="large"
                                value={lockedKabKotaLabel ?? '-'}
                                disabled
                            />
                        </Form.Item>
                    </Col>
                )}
                <Col xs={24} sm={12} lg={8}>
                    <Form.Item
                        label="Kluster"
                        required
                        validateStatus={errors.kode_cluster ? 'error' : ''}
                        help={errors.kode_cluster}
                    >
                        <Select
                            showSearch
                            allowClear
                            size="large"
                            placeholder="Pilih kluster"
                            value={data.kode_cluster ?? undefined}
                            onChange={handleClusterChange}
                            options={clusters.map((item) => ({
                                value: item.id,
                                label: item.nama_cluster,
                            }))}
                            optionFilterProp="label"
                            disabled={!lokasiReady}
                            loading={loadingCluster}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Form.Item
                        label="Kelompok Tani"
                        required
                        validateStatus={errors.kode_poktan ? 'error' : ''}
                        help={errors.kode_poktan}
                    >
                        <Select
                            showSearch
                            allowClear
                            size="large"
                            placeholder="Pilih kelompok tani"
                            value={data.kode_poktan ?? undefined}
                            onChange={(value) => setData('kode_poktan', value ?? null)}
                            options={poktans.map((item) => ({
                                value: item.id,
                                label: item.nama_poktan,
                            }))}
                            optionFilterProp="label"
                            disabled={!clusterReady}
                            loading={loadingPoktan}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Divider orientation="left" orientationMargin={0} className="!text-gray-500 !text-sm">
                Data Petani
            </Divider>

            <Form.Item
                label="Nama Petani"
                required
                validateStatus={errors.nama_petani ? 'error' : ''}
                help={errors.nama_petani}
            >
                <Input
                    size="large"
                    value={data.nama_petani}
                    onChange={(e) => setData('nama_petani', e.target.value)}
                    placeholder="Nama lengkap petani"
                />
            </Form.Item>

            <Form.Item
                label="NIK"
                validateStatus={errors.nik_petani ? 'error' : ''}
                help={errors.nik_petani}
            >
                <Input
                    size="large"
                    value={data.nik_petani}
                    onChange={(e) => setData('nik_petani', e.target.value)}
                    placeholder="16 digit NIK"
                    maxLength={16}
                />
            </Form.Item>

            <Form.Item
                label="No HP"
                validateStatus={errors.no_hp_petani ? 'error' : ''}
                help={errors.no_hp_petani}
            >
                <Input
                    size="large"
                    value={data.no_hp_petani}
                    onChange={(e) => setData('no_hp_petani', e.target.value)}
                    placeholder="08xx"
                />
            </Form.Item>

            <Form.Item
                label="Gender"
                validateStatus={errors.gender_petani ? 'error' : ''}
                help={errors.gender_petani}
            >
                <Select
                    allowClear
                    size="large"
                    placeholder="Pilih gender"
                    value={data.gender_petani}
                    onChange={(val) => setData('gender_petani', val ?? null)}
                    options={GENDER_OPTIONS}
                />
            </Form.Item>

            <Form.Item
                label="Usia"
                validateStatus={errors.usia_petani ? 'error' : ''}
                help={errors.usia_petani}
            >
                <InputNumber
                    className="w-full"
                    size="large"
                    min={1}
                    max={120}
                    value={data.usia_petani}
                    onChange={(val) => setData('usia_petani', val)}
                    placeholder="Tahun"
                />
            </Form.Item>

            <Form.Item
                label="Difabel"
                validateStatus={errors.difabel ? 'error' : ''}
                help={errors.difabel}
            >
                <Switch
                    checked={data.difabel}
                    onChange={(val) => setData('difabel', val)}
                    checkedChildren="Ya"
                    unCheckedChildren="Tidak"
                />
            </Form.Item>

            <Form.Item
                label="Alamat"
                validateStatus={errors.alamat_petani ? 'error' : ''}
                help={errors.alamat_petani}
            >
                <Input.TextArea
                    rows={3}
                    value={data.alamat_petani}
                    onChange={(e) => setData('alamat_petani', e.target.value)}
                    placeholder="Alamat lengkap"
                />
            </Form.Item>

            <Divider orientation="left" orientationMargin={0} className="!text-gray-500 !text-sm">
                Titik Koordinat Lahan
            </Divider>

            <Row gutter={[24, 0]}>
                <Col xs={24} lg={10}>
                    <Form.Item
                        label="Latitude"
                        validateStatus={errors.latitude ? 'error' : ''}
                        help={errors.latitude || 'Kolom latitude pada tabel m_petani.'}
                    >
                        <InputNumber
                            className="w-full"
                            size="large"
                            step={0.000001}
                            min={-90}
                            max={90}
                            value={data.latitude}
                            onChange={(val) => setData('latitude', val)}
                            placeholder="Contoh: -6.914744"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Longitude"
                        validateStatus={errors.longitude ? 'error' : ''}
                        help={errors.longitude || 'Kolom longitude pada tabel m_petani.'}
                    >
                        <InputNumber
                            className="w-full"
                            size="large"
                            step={0.000001}
                            min={-180}
                            max={180}
                            value={data.longitude}
                            onChange={(val) => setData('longitude', val)}
                            placeholder="Contoh: 107.609810"
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} lg={14}>
                    <Form.Item label="Peta Lokasi Lahan">
                        <CoordinateMapPicker
                            latitude={parseCoordinate(data.latitude)}
                            longitude={parseCoordinate(data.longitude)}
                            onChange={handleCoordinateChange}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Divider orientation="left" orientationMargin={0} className="!text-gray-500 !text-sm">
                Foto Lahan
            </Divider>

            <Form.Item
                label="Upload Foto Lahan"
                validateStatus={errors.foto_lahan ? 'error' : ''}
                help={errors.foto_lahan || 'Disimpan ke kolom foto_lahan pada tabel m_petani (JPG/PNG/WebP, maks. 4MB).'}
            >
                <Upload.Dragger
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    maxCount={1}
                    beforeUpload={(file) => {
                        setData('foto_lahan', file);
                        return false;
                    }}
                    onRemove={() => setData('foto_lahan', null)}
                    fileList={data.foto_lahan instanceof File
                        ? [{ uid: '-1', name: data.foto_lahan.name, status: 'done' }]
                        : []}
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Klik atau seret foto lahan ke sini</p>
                </Upload.Dragger>

                {fotoPreview && (
                    <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
                        <img src={fotoPreview} alt="Preview foto lahan" className="max-h-56 w-full object-cover" />
                    </div>
                )}
            </Form.Item>
        </>
    );
}
