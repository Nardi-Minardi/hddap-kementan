import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    Form, Input, InputNumber, Select, Button, Card, Row, Col,
    Typography, Breadcrumb, Divider, Space,
} from 'antd';
import { HomeOutlined, UsergroupAddOutlined, PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useState } from 'react';
import axios from 'axios';

const { Title } = Typography;

const GENDER_OPTIONS = [
    { value: 'L', label: 'Laki-laki' },
    { value: 'P', label: 'Perempuan' },
];

export default function KelompokPetaniCreate({ provinsis }) {
    const { data, setData, post, processing, errors } = useForm({
        provinsi_id: null,
        kab_kota_id: null,
        kecamatan_id: null,
        kel_des_id: null,
        nama_poktan: '',
        luas_layanan_poktan: null,
        tahun_pembentukan: null,
        diketahui_pic: '',
        sk_bupati: '',
        akte_notaris: '',
        ket_terdaftar_pengadilan: '',
        nama_ketua_poktan: '',
        no_hp_ketua_poktan: '',
        gender_ketua_poktan: null,
        gender_wakil_poktan: null,
        gender_sekretaris_poktan: null,
        gender_bendahara_poktan: null,
        jumlah_pengurus_poktan: null,
        jumlah_anggota_poktan: null,
        jumlah_anggota_pria_poktan: null,
        jumlah_anggota_wanita_poktan: null,
        ad_art: '',
        alamat_kantor_sekretariat: '',
        pengisian_buku: '',
        iuran: '',
        keterangan: '',
    });

    const [kabKotas, setKabKotas]       = useState([]);
    const [kecamatans, setKecamatans]   = useState([]);
    const [kelDeses, setKelDeses]       = useState([]);
    const [loadingKab, setLoadingKab]   = useState(false);
    const [loadingKec, setLoadingKec]   = useState(false);
    const [loadingKel, setLoadingKel]   = useState(false);

    const handleProvinsiChange = async (val) => {
        setData(d => ({ ...d, provinsi_id: val ?? null, kab_kota_id: null, kecamatan_id: null, kel_des_id: null }));
        setKabKotas([]); setKecamatans([]); setKelDeses([]);
        if (!val) return;
        setLoadingKab(true);
        const res = await axios.get(route('admin.kelompok-petani.api.kab-kota'), { params: { provinsi_id: val } });
        setKabKotas(res.data);
        setLoadingKab(false);
    };

    const handleKabKotaChange = async (val) => {
        setData(d => ({ ...d, kab_kota_id: val ?? null, kecamatan_id: null, kel_des_id: null }));
        setKecamatans([]); setKelDeses([]);
        if (!val) return;
        setLoadingKec(true);
        const res = await axios.get(route('admin.kelompok-petani.api.kecamatan'), { params: { kab_kota_id: val } });
        setKecamatans(res.data);
        setLoadingKec(false);
    };

    const handleKecamatanChange = async (val) => {
        setData(d => ({ ...d, kecamatan_id: val ?? null, kel_des_id: null }));
        setKelDeses([]);
        if (!val) return;
        setLoadingKel(true);
        const res = await axios.get(route('admin.kelompok-petani.api.kel-des'), { params: { kecamatan_id: val } });
        setKelDeses(res.data);
        setLoadingKel(false);
    };

    const handleSubmit = () => {
        post(route('admin.kelompok-petani.store'));
    };

    return (
        <AdminLayout title="Tambah Kelompok Petani">
            <Head title="Tambah Kelompok Petani" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: 'Master' },
                    { href: route('admin.kelompok-petani.index'), title: <><UsergroupAddOutlined /> Kelompok Petani</> },
                    { title: 'Tambah' },
                ]}
            />

            <Card
                className="shadow-sm border border-gray-100 rounded-xl"
                title={
                    <div className="flex items-center justify-between py-1">
                        <Title level={5} className="!mb-0 !text-gray-800">Tambah Kelompok Petani</Title>
                        <Button icon={<ArrowLeftOutlined />} onClick={() => router.visit(route('admin.kelompok-petani.index'))}>
                            Kembali
                        </Button>
                    </div>
                }
            >
                <Form layout="vertical" onFinish={handleSubmit}>

                    {/* === LOKASI === */}
                    <Divider orientation="left" orientationMargin={0} className="!text-gray-500 !text-sm">Lokasi</Divider>
                    <Row gutter={[16, 0]}>
                        <Col xs={24} sm={12} lg={6}>
                            <Form.Item
                                label="Provinsi"
                                validateStatus={errors.provinsi_id ? 'error' : ''}
                                help={errors.provinsi_id}
                            >
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder="Pilih Provinsi"
                                    value={data.provinsi_id}
                                    onChange={handleProvinsiChange}
                                    options={provinsis.map(p => ({ value: p.id, label: p.name }))}
                                    filterOption={(input, opt) => opt.label.toLowerCase().includes(input.toLowerCase())}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Form.Item
                                label="Kab/Kota"
                                validateStatus={errors.kab_kota_id ? 'error' : ''}
                                help={errors.kab_kota_id}
                            >
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder="Pilih Kab/Kota"
                                    value={data.kab_kota_id}
                                    onChange={handleKabKotaChange}
                                    options={kabKotas.map(k => ({ value: k.id, label: k.name }))}
                                    filterOption={(input, opt) => opt.label.toLowerCase().includes(input.toLowerCase())}
                                    disabled={!data.provinsi_id}
                                    loading={loadingKab}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Form.Item
                                label="Kecamatan"
                                validateStatus={errors.kecamatan_id ? 'error' : ''}
                                help={errors.kecamatan_id}
                            >
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder="Pilih Kecamatan"
                                    value={data.kecamatan_id}
                                    onChange={handleKecamatanChange}
                                    options={kecamatans.map(k => ({ value: k.id, label: k.name }))}
                                    filterOption={(input, opt) => opt.label.toLowerCase().includes(input.toLowerCase())}
                                    disabled={!data.kab_kota_id}
                                    loading={loadingKec}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Form.Item
                                label="Kel/Desa"
                                validateStatus={errors.kel_des_id ? 'error' : ''}
                                help={errors.kel_des_id}
                            >
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder="Pilih Kel/Desa"
                                    value={data.kel_des_id}
                                    onChange={(val) => setData('kel_des_id', val ?? null)}
                                    options={kelDeses.map(k => ({ value: k.id, label: k.name }))}
                                    filterOption={(input, opt) => opt.label.toLowerCase().includes(input.toLowerCase())}
                                    disabled={!data.kecamatan_id}
                                    loading={loadingKel}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* === DATA POKTAN === */}
                    <Divider orientation="left" orientationMargin={0} className="!text-gray-500 !text-sm">Data Poktan</Divider>
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
                                    onChange={e => setData('nama_poktan', e.target.value)}
                                    placeholder="Nama kelompok petani"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={4}>
                            <Form.Item
                                label="Luas Layanan (Ha)"
                                validateStatus={errors.luas_layanan_poktan ? 'error' : ''}
                                help={errors.luas_layanan_poktan}
                            >
                                <InputNumber
                                    className="w-full"
                                    min={0}
                                    step={0.01}
                                    value={data.luas_layanan_poktan}
                                    onChange={val => setData('luas_layanan_poktan', val)}
                                    placeholder="0.00"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={4}>
                            <Form.Item
                                label="Tahun Pembentukan"
                                validateStatus={errors.tahun_pembentukan ? 'error' : ''}
                                help={errors.tahun_pembentukan}
                            >
                                <InputNumber
                                    className="w-full"
                                    min={1900}
                                    max={new Date().getFullYear()}
                                    value={data.tahun_pembentukan}
                                    onChange={val => setData('tahun_pembentukan', val)}
                                    placeholder="2024"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item
                                label="Diketahui PIC"
                                validateStatus={errors.diketahui_pic ? 'error' : ''}
                                help={errors.diketahui_pic}
                            >
                                <Input value={data.diketahui_pic} onChange={e => setData('diketahui_pic', e.target.value)} placeholder="Kepala Desa / Camat" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item label="SK Bupati" validateStatus={errors.sk_bupati ? 'error' : ''} help={errors.sk_bupati}>
                                <Input value={data.sk_bupati} onChange={e => setData('sk_bupati', e.target.value)} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item label="Akte Notaris" validateStatus={errors.akte_notaris ? 'error' : ''} help={errors.akte_notaris}>
                                <Input value={data.akte_notaris} onChange={e => setData('akte_notaris', e.target.value)} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item label="Ket. Terdaftar Pengadilan" validateStatus={errors.ket_terdaftar_pengadilan ? 'error' : ''} help={errors.ket_terdaftar_pengadilan}>
                                <Input value={data.ket_terdaftar_pengadilan} onChange={e => setData('ket_terdaftar_pengadilan', e.target.value)} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item label="AD/ART" validateStatus={errors.ad_art ? 'error' : ''} help={errors.ad_art}>
                                <Input value={data.ad_art} onChange={e => setData('ad_art', e.target.value)} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item label="Pengisian Buku" validateStatus={errors.pengisian_buku ? 'error' : ''} help={errors.pengisian_buku}>
                                <Input value={data.pengisian_buku} onChange={e => setData('pengisian_buku', e.target.value)} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item label="Iuran" validateStatus={errors.iuran ? 'error' : ''} help={errors.iuran}>
                                <Input value={data.iuran} onChange={e => setData('iuran', e.target.value)} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Form.Item label="Alamat Kantor Sekretariat" validateStatus={errors.alamat_kantor_sekretariat ? 'error' : ''} help={errors.alamat_kantor_sekretariat}>
                                <Input.TextArea rows={2} value={data.alamat_kantor_sekretariat} onChange={e => setData('alamat_kantor_sekretariat', e.target.value)} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Form.Item label="Keterangan" validateStatus={errors.keterangan ? 'error' : ''} help={errors.keterangan}>
                                <Input.TextArea rows={2} value={data.keterangan} onChange={e => setData('keterangan', e.target.value)} />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* === DATA KETUA === */}
                    <Divider orientation="left" orientationMargin={0} className="!text-gray-500 !text-sm">Data Ketua</Divider>
                    <Row gutter={[16, 0]}>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item label="Nama Ketua Poktan" validateStatus={errors.nama_ketua_poktan ? 'error' : ''} help={errors.nama_ketua_poktan}>
                                <Input value={data.nama_ketua_poktan} onChange={e => setData('nama_ketua_poktan', e.target.value)} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Form.Item label="No HP Ketua" validateStatus={errors.no_hp_ketua_poktan ? 'error' : ''} help={errors.no_hp_ketua_poktan}>
                                <Input value={data.no_hp_ketua_poktan} onChange={e => setData('no_hp_ketua_poktan', e.target.value)} placeholder="08xx" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={5}>
                            <Form.Item label="Gender Ketua" validateStatus={errors.gender_ketua_poktan ? 'error' : ''} help={errors.gender_ketua_poktan}>
                                <Select allowClear placeholder="Pilih" value={data.gender_ketua_poktan} onChange={val => setData('gender_ketua_poktan', val ?? null)} options={GENDER_OPTIONS} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={5}>
                            <Form.Item label="Gender Wakil" validateStatus={errors.gender_wakil_poktan ? 'error' : ''} help={errors.gender_wakil_poktan}>
                                <Select allowClear placeholder="Pilih" value={data.gender_wakil_poktan} onChange={val => setData('gender_wakil_poktan', val ?? null)} options={GENDER_OPTIONS} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={5}>
                            <Form.Item label="Gender Sekretaris" validateStatus={errors.gender_sekretaris_poktan ? 'error' : ''} help={errors.gender_sekretaris_poktan}>
                                <Select allowClear placeholder="Pilih" value={data.gender_sekretaris_poktan} onChange={val => setData('gender_sekretaris_poktan', val ?? null)} options={GENDER_OPTIONS} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={5}>
                            <Form.Item label="Gender Bendahara" validateStatus={errors.gender_bendahara_poktan ? 'error' : ''} help={errors.gender_bendahara_poktan}>
                                <Select allowClear placeholder="Pilih" value={data.gender_bendahara_poktan} onChange={val => setData('gender_bendahara_poktan', val ?? null)} options={GENDER_OPTIONS} />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* === ACTIONS === */}
                    <div className="flex justify-end gap-3 pt-2">
                        <Button onClick={() => router.visit(route('admin.kelompok-petani.index'))}>Batal</Button>
                        <Button type="primary" htmlType="submit" icon={<PlusOutlined />} loading={processing}>
                            Simpan
                        </Button>
                    </div>
                </Form>
            </Card>
        </AdminLayout>
    );
}
