import CoordinateMapPicker from '@/Components/CoordinateMapPicker';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { Col, Divider, Form, Input, Row, Select } from 'antd';

const METODE_OPTIONS = [
    { value: 'Offline', label: 'Offline' },
    { value: 'Online', label: 'Online' },
    { value: 'Hybrid', label: 'Hybrid' },
    { value: 'Blended', label: 'Blended' },
];

function buildTimeOptions() {
    const options = [];

    for (let hour = 6; hour <= 22; hour += 1) {
        for (const minute of ['00', '30']) {
            const value = `${String(hour).padStart(2, '0')}:${minute}`;
            options.push({ value, label: value });
        }
    }

    return options;
}

const TIME_OPTIONS = buildTimeOptions();

function formatPeriode(mulai, selesai) {
    if (!mulai || !selesai) {
        return '';
    }

    const formatDate = (value) =>
        new Date(`${value}T00:00:00`).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });

    return `${formatDate(mulai)} — ${formatDate(selesai)}`;
}

function parseCoordinate(value) {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const parsed = typeof value === 'number'
        ? value
        : parseFloat(String(value).trim().replace(',', '.'));

    return Number.isFinite(parsed) ? parsed : null;
}

export default function JenisPelatihanFormFields({
    data,
    setData,
    errors = {},
    provinsis = [],
    topikOptions = [],
}) {
    const [kabKotas, setKabKotas] = useState([]);

    const periodeLabel = useMemo(
        () => formatPeriode(data.tanggal_mulai, data.tanggal_berakhir),
        [data.tanggal_mulai, data.tanggal_berakhir],
    );

    const loadKabKota = async (provinsiCode) => {
        if (!provinsiCode) {
            setKabKotas([]);
            return;
        }

        const response = await axios.get(route('admin.data-verval.jenis-pelatihan.api.kab-kota'), {
            params: { provinsi_code: provinsiCode },
        });

        setKabKotas(response.data);
    };

    useEffect(() => {
        if (data.provinsi_code) {
            loadKabKota(data.provinsi_code);
        }
    }, []);

    const handleProvinsiChange = async (value) => {
        setData((current) => ({
            ...current,
            provinsi_code: value ?? null,
            kode_kota: null,
        }));

        await loadKabKota(value);
    };

    const handleCoordinateChange = (latitude, longitude) => {
        setData('latitude', latitude);
        setData('longitude', longitude);
    };

    return (
        <>
            <Divider orientation="left" orientationMargin={0} className="!text-gray-500 !text-sm">
                Informasi Acara
            </Divider>

            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Form.Item
                        label="Nama Acara"
                        required
                        validateStatus={errors.nama_pelatihan ? 'error' : ''}
                        help={errors.nama_pelatihan}
                    >
                        <Input
                            size="large"
                            value={data.nama_pelatihan}
                            onChange={(e) => setData('nama_pelatihan', e.target.value)}
                            placeholder="Nama acara / pelatihan"
                            maxLength={100}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        label="Metode Acara"
                        required
                        validateStatus={errors.metode_acara ? 'error' : ''}
                        help={errors.metode_acara}
                    >
                        <Select
                            size="large"
                            placeholder="Pilih metode acara"
                            value={data.metode_acara || undefined}
                            onChange={(value) => setData('metode_acara', value ?? '')}
                            options={METODE_OPTIONS}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                label="Jenis Topik"
                required
                validateStatus={errors.kd_pelatihan ? 'error' : ''}
                help={errors.kd_pelatihan}
            >
                <Select
                    allowClear
                    showSearch
                    size="large"
                    placeholder="Pilih topik dari Management Topik"
                    optionFilterProp="label"
                    value={data.kd_pelatihan ?? undefined}
                    onChange={(value) => setData('kd_pelatihan', value ?? null)}
                    options={topikOptions}
                />
            </Form.Item>

            <Divider orientation="left" orientationMargin={0} className="!text-gray-500 !text-sm">
                Lokasi Acara
            </Divider>

            <Row gutter={16}>
                <Col xs={24} lg={8}>
                    <Form.Item
                        label="Latitude"
                        validateStatus={errors.latitude ? 'error' : ''}
                        help={errors.latitude}
                    >
                        <Input
                            size="large"
                            value={data.latitude ?? ''}
                            onChange={(e) => setData('latitude', e.target.value === '' ? null : e.target.value)}
                            placeholder="-6.200000"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Longitude"
                        validateStatus={errors.longitude ? 'error' : ''}
                        help={errors.longitude}
                    >
                        <Input
                            size="large"
                            value={data.longitude ?? ''}
                            onChange={(e) => setData('longitude', e.target.value === '' ? null : e.target.value)}
                            placeholder="106.816666"
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} lg={16}>
                    <Form.Item label="Koordinat GPS Lokasi Acara">
                        <CoordinateMapPicker
                            latitude={parseCoordinate(data.latitude)}
                            longitude={parseCoordinate(data.longitude)}
                            onChange={handleCoordinateChange}
                        />
                        <p className="mt-2 text-xs text-gray-500">
                            Klik pada peta untuk menambahkan penanda atau seret penanda untuk mengubah posisi.
                        </p>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} md={8}>
                    <Form.Item
                        label="Provinsi"
                        validateStatus={errors.provinsi_code ? 'error' : ''}
                        help={errors.provinsi_code}
                    >
                        <Select
                            allowClear
                            showSearch
                            size="large"
                            placeholder="Pilih provinsi"
                            optionFilterProp="label"
                            value={data.provinsi_code || undefined}
                            onChange={handleProvinsiChange}
                            options={provinsis.map((provinsi) => ({
                                value: provinsi.code,
                                label: provinsi.name,
                            }))}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                    <Form.Item
                        label="Kabupaten"
                        validateStatus={errors.kode_kota ? 'error' : ''}
                        help={errors.kode_kota}
                    >
                        <Select
                            allowClear
                            showSearch
                            size="large"
                            placeholder="Pilih kabupaten/kota"
                            optionFilterProp="label"
                            value={data.kode_kota || undefined}
                            onChange={(value) => setData('kode_kota', value ?? null)}
                            options={kabKotas.map((kab) => ({
                                value: kab.code,
                                label: kab.name,
                            }))}
                            disabled={!data.provinsi_code}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                    <Form.Item
                        label="Lokasi Acara"
                        validateStatus={errors.gedung ? 'error' : ''}
                        help={errors.gedung}
                    >
                        <Input
                            size="large"
                            value={data.gedung ?? ''}
                            onChange={(e) => setData('gedung', e.target.value)}
                            placeholder="Nama lokasi acara"
                            maxLength={150}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} md={8}>
                    <Form.Item
                        label="Kategori"
                        validateStatus={errors.kategori ? 'error' : ''}
                        help={errors.kategori}
                    >
                        <Input
                            size="large"
                            value={data.kategori ?? ''}
                            onChange={(e) => setData('kategori', e.target.value)}
                            placeholder="Kategori acara"
                            maxLength={100}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                    <Form.Item
                        label="Topik"
                        validateStatus={errors.topik ? 'error' : ''}
                        help={errors.topik}
                    >
                        <Input
                            size="large"
                            value={data.topik ?? ''}
                            onChange={(e) => setData('topik', e.target.value)}
                            placeholder="Topik acara"
                            maxLength={100}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                    <Form.Item
                        label="Subtopik"
                        validateStatus={errors.subtopik ? 'error' : ''}
                        help={errors.subtopik}
                    >
                        <Input
                            size="large"
                            value={data.subtopik ?? ''}
                            onChange={(e) => setData('subtopik', e.target.value)}
                            placeholder="Subtopik acara"
                            maxLength={100}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Divider orientation="left" orientationMargin={0} className="!text-gray-500 !text-sm">
                Jadwal Acara
            </Divider>

            <Row gutter={16}>
                <Col xs={24} md={8}>
                    <Form.Item
                        label="Tanggal Mulai"
                        validateStatus={errors.tanggal_mulai ? 'error' : ''}
                        help={errors.tanggal_mulai}
                    >
                        <Input
                            type="date"
                            size="large"
                            value={data.tanggal_mulai ?? ''}
                            onChange={(e) => setData('tanggal_mulai', e.target.value || null)}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                    <Form.Item
                        label="Tanggal Berakhir"
                        validateStatus={errors.tanggal_berakhir ? 'error' : ''}
                        help={errors.tanggal_berakhir}
                    >
                        <Input
                            type="date"
                            size="large"
                            value={data.tanggal_berakhir ?? ''}
                            onChange={(e) => setData('tanggal_berakhir', e.target.value || null)}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                    <Form.Item label="Periode Acara">
                        <Input size="large" value={periodeLabel} disabled placeholder="Otomatis dari tanggal" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Form.Item
                        label="Waktu Mulai"
                        validateStatus={errors.waktu_mulai ? 'error' : ''}
                        help={errors.waktu_mulai}
                    >
                        <Select
                            allowClear
                            size="large"
                            placeholder="Pilih waktu mulai"
                            value={data.waktu_mulai || undefined}
                            onChange={(value) => setData('waktu_mulai', value ?? null)}
                            options={TIME_OPTIONS}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        label="Waktu Berakhir"
                        validateStatus={errors.waktu_berakhir ? 'error' : ''}
                        help={errors.waktu_berakhir}
                    >
                        <Select
                            allowClear
                            size="large"
                            placeholder="Pilih waktu berakhir"
                            value={data.waktu_berakhir || undefined}
                            onChange={(value) => setData('waktu_berakhir', value ?? null)}
                            options={TIME_OPTIONS}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </>
    );
}

export function emptyJenisPelatihanForm() {
    return {
        kd_pelatihan: null,
        nama_pelatihan: '',
        metode_acara: '',
        latitude: null,
        longitude: null,
        provinsi_code: null,
        kode_kota: null,
        gedung: '',
        kategori: '',
        topik: '',
        subtopik: '',
        tanggal_mulai: null,
        tanggal_berakhir: null,
        waktu_mulai: null,
        waktu_berakhir: null,
    };
}

export function jenisPelatihanFormFromRecord(record) {
    return {
        kd_pelatihan: record.kd_pelatihan ?? null,
        nama_pelatihan: record.nama_pelatihan || '',
        metode_acara: record.metode_acara || '',
        latitude: record.latitude ?? null,
        longitude: record.longitude ?? null,
        provinsi_code: record.provinsi_code ?? null,
        kode_kota: record.kode_kota ?? null,
        gedung: record.gedung || '',
        kategori: record.kategori || '',
        topik: record.topik || '',
        subtopik: record.subtopik || '',
        tanggal_mulai: record.tanggal_mulai || null,
        tanggal_berakhir: record.tanggal_berakhir || null,
        waktu_mulai: record.waktu_mulai || null,
        waktu_berakhir: record.waktu_berakhir || null,
    };
}
