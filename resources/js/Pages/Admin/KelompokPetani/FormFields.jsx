import axios from 'axios';
import { Alert, Col, Divider, Form, Input, Row, Select } from 'antd';
import { useEffect, useState } from 'react';

export default function KelompokPetaniFormFields({ data, setData, errors, provinsis, isEdit = false }) {
    const [kabKotas, setKabKotas] = useState([]);
    const [clusters, setClusters] = useState([]);
    const [loadingKab, setLoadingKab] = useState(false);
    const [loadingCluster, setLoadingCluster] = useState(false);

    const clusterSelected = Boolean(data.kode_cluster);
    const lokasiReady = Boolean(data.kode_kota);

    const loadKabKota = async (provinsiCode) => {
        if (!provinsiCode) {
            setKabKotas([]);
            return;
        }

        setLoadingKab(true);
        try {
            const response = await axios.get(route('admin.kelompok-petani.api.kab-kota'), {
                params: { provinsi_code: provinsiCode },
            });
            setKabKotas(response.data);
        } finally {
            setLoadingKab(false);
        }
    };

    const loadClusters = async (kodeKota) => {
        if (!kodeKota) {
            setClusters([]);
            return;
        }

        setLoadingCluster(true);
        try {
            const response = await axios.get(route('admin.kelompok-petani.api.cluster'), {
                params: { kode_kota: kodeKota },
            });
            setClusters(response.data);
        } finally {
            setLoadingCluster(false);
        }
    };

    useEffect(() => {
        if (!isEdit || !data.provinsi_code) {
            return;
        }

        loadKabKota(data.provinsi_code);
    }, [isEdit, data.provinsi_code]);

    useEffect(() => {
        if (!isEdit || !data.kode_kota) {
            return;
        }

        loadClusters(data.kode_kota);
    }, [isEdit, data.kode_kota]);

    const handleProvinsiChange = async (value) => {
        setData((current) => ({
            ...current,
            provinsi_code: value ?? null,
            kode_kota: null,
            kode_cluster: null,
        }));
        setKabKotas([]);
        setClusters([]);
        await loadKabKota(value ?? null);
    };

    const handleKabKotaChange = async (value) => {
        setData((current) => ({
            ...current,
            kode_kota: value ?? null,
            kode_cluster: null,
        }));
        setClusters([]);
        await loadClusters(value ?? null);
    };

    const handleClusterChange = (value) => {
        setData('kode_cluster', value ?? null);
    };

    return (
        <>
            <Divider orientation="left" orientationMargin={0} className="!text-gray-500 !text-sm">
                Pilih Kluster Petani
            </Divider>

            {!clusterSelected && (
                <Alert
                    type="info"
                    showIcon
                    className="!mb-4"
                    message="Pilih Provinsi, Kab/Kota, dan Kluster Petani terlebih dahulu sebelum mengisi data kelompok tani."
                />
            )}

            <Row gutter={[16, 0]}>
                <Col xs={24} sm={12} lg={8}>
                    <Form.Item
                        label="Provinsi"
                        required
                        validateStatus={errors.provinsi_code ? 'error' : ''}
                        help={errors.provinsi_code}
                    >
                        <Select
                            showSearch
                            allowClear
                            placeholder="Pilih Provinsi"
                            value={data.provinsi_code ?? undefined}
                            onChange={handleProvinsiChange}
                            options={provinsis.map((item) => ({ value: item.code, label: item.name }))}
                            optionFilterProp="label"
                        />
                    </Form.Item>
                </Col>
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
                            placeholder="Pilih Kab/Kota"
                            value={data.kode_kota ?? undefined}
                            onChange={handleKabKotaChange}
                            options={kabKotas.map((item) => ({ value: item.code, label: item.name }))}
                            optionFilterProp="label"
                            disabled={!data.provinsi_code}
                            loading={loadingKab}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Form.Item
                        label="Kluster Petani"
                        required
                        validateStatus={errors.kode_cluster ? 'error' : ''}
                        help={errors.kode_cluster}
                    >
                        <Select
                            showSearch
                            allowClear
                            placeholder="Pilih Kluster Petani"
                            value={data.kode_cluster ?? undefined}
                            onChange={handleClusterChange}
                            options={clusters.map((item) => ({ value: item.id, label: item.nama_cluster }))}
                            optionFilterProp="label"
                            disabled={!lokasiReady}
                            loading={loadingCluster}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Divider orientation="left" orientationMargin={0} className="!text-gray-500 !text-sm">
                Data Kelompok Tani
            </Divider>

            <fieldset disabled={!clusterSelected} className="min-w-0 border-0 p-0 m-0">
                <Row gutter={[16, 0]}>
                    <Col xs={24} sm={12} lg={8}>
                        <Form.Item
                            label="Nama Poktan"
                            required
                            validateStatus={errors.nama_poktan ? 'error' : ''}
                            help={errors.nama_poktan}
                        >
                            <Input
                                value={data.nama_poktan}
                                onChange={(event) => setData('nama_poktan', event.target.value)}
                                placeholder="Nama kelompok tani"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Form.Item
                            label="Ketua"
                            validateStatus={errors.ketua ? 'error' : ''}
                            help={errors.ketua}
                        >
                            <Input
                                value={data.ketua}
                                onChange={(event) => setData('ketua', event.target.value)}
                                placeholder="Nama ketua poktan"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Form.Item
                            label="Telepon"
                            validateStatus={errors.telp ? 'error' : ''}
                            help={errors.telp}
                        >
                            <Input
                                value={data.telp}
                                onChange={(event) => setData('telp', event.target.value)}
                                placeholder="08xx"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            label="Alamat"
                            validateStatus={errors.alamat ? 'error' : ''}
                            help={errors.alamat}
                        >
                            <Input.TextArea
                                rows={3}
                                value={data.alamat}
                                onChange={(event) => setData('alamat', event.target.value)}
                                placeholder="Alamat sekretariat / lokasi poktan"
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </fieldset>
        </>
    );
}
