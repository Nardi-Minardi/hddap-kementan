import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { Form, Input, InputNumber, Select, Switch, Button, Card, Row, Col, Typography, Breadcrumb, Divider } from 'antd';
import { HomeOutlined, UserOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Title } = Typography;

const GENDER_OPTIONS = [
    { value: 'L', label: 'Laki-laki' },
    { value: 'P', label: 'Perempuan' },
];

export default function PetaniEdit({ petani }) {
    const { data, setData, put, processing, errors } = useForm({
        nama_petani: petani.nama_petani ?? '',
        nik_petani: petani.nik_petani ?? '',
        no_hp_petani: petani.no_hp_petani ?? '',
        gender_petani: petani.gender_petani ?? null,
        usia_petani: petani.usia_petani ?? null,
        difabel: petani.difabel ?? false,
        alamat_petani: petani.alamat_petani ?? '',
    });

    return (
        <AdminLayout title="Edit Petani">
            <Head title="Edit Petani" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: 'Master' },
                    { href: route('admin.petani.index'), title: <><UserOutlined /> Petani</> },
                    { title: 'Edit' },
                ]}
            />

            <Card
                className="shadow-sm border border-gray-100 rounded-xl"
                title={
                    <div className="flex items-center justify-between py-1">
                        <Title level={5} className="!mb-0 !text-gray-800">Edit Petani</Title>
                        <Button icon={<ArrowLeftOutlined />} onClick={() => router.visit(route('admin.petani.index'))}>Kembali</Button>
                    </div>
                }
            >
                <Form layout="vertical" onFinish={() => put(route('admin.petani.update', petani.id))}>
                    <Divider orientation="left" orientationMargin={0} className="!text-gray-500 !text-sm">Data Petani</Divider>
                    <Row gutter={[16, 0]}>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item label="Nama Petani" required validateStatus={errors.nama_petani ? 'error' : ''} help={errors.nama_petani}>
                                <Input value={data.nama_petani} onChange={e => setData('nama_petani', e.target.value)} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item label="NIK" validateStatus={errors.nik_petani ? 'error' : ''} help={errors.nik_petani}>
                                <Input value={data.nik_petani} onChange={e => setData('nik_petani', e.target.value)} maxLength={16} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item label="No HP" validateStatus={errors.no_hp_petani ? 'error' : ''} help={errors.no_hp_petani}>
                                <Input value={data.no_hp_petani} onChange={e => setData('no_hp_petani', e.target.value)} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Form.Item label="Gender" validateStatus={errors.gender_petani ? 'error' : ''} help={errors.gender_petani}>
                                <Select allowClear placeholder="Pilih gender" value={data.gender_petani} onChange={val => setData('gender_petani', val ?? null)} options={GENDER_OPTIONS} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={4}>
                            <Form.Item label="Usia" validateStatus={errors.usia_petani ? 'error' : ''} help={errors.usia_petani}>
                                <InputNumber className="w-full" min={1} max={120} value={data.usia_petani} onChange={val => setData('usia_petani', val)} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={4}>
                            <Form.Item label="Difabel" validateStatus={errors.difabel ? 'error' : ''} help={errors.difabel}>
                                <Switch checked={data.difabel} onChange={val => setData('difabel', val)} checkedChildren="Ya" unCheckedChildren="Tidak" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} lg={24}>
                            <Form.Item label="Alamat" validateStatus={errors.alamat_petani ? 'error' : ''} help={errors.alamat_petani}>
                                <Input.TextArea rows={3} value={data.alamat_petani} onChange={e => setData('alamat_petani', e.target.value)} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button onClick={() => router.visit(route('admin.petani.index'))}>Batal</Button>
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={processing}>Simpan Perubahan</Button>
                    </div>
                </Form>
            </Card>
        </AdminLayout>
    );
}
