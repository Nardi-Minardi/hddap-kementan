import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftOutlined, HomeOutlined, SaveOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Form, Input, Row, Col, Space, Typography } from 'antd';

const { Title } = Typography;

export default function JenisPelatihanCreate() {
    const { data, setData, post, processing, errors } = useForm({
        jenis_pelatihan: '',
        nama_pelatihan: '',
    });

    const handleSubmit = () => {
        post(route('admin.data-verval.jenis-pelatihan.store'));
    };

    return (
        <AdminLayout title="Tambah Jenis Pelatihan">
            <Head title="Tambah Jenis Pelatihan" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { href: route('admin.data-verval.jenis-pelatihan.index'), title: 'Jenis Pelatihan' },
                    { title: 'Tambah' },
                ]}
            />

            <Card
                className="rounded-xl border border-gray-100 shadow-sm"
                title={<Title level={5} className="!mb-0 !text-gray-800">Tambah Jenis Pelatihan</Title>}
            >
                <Form layout="vertical" onFinish={handleSubmit}>
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Jenis Pelatihan"
                                required
                                validateStatus={errors.jenis_pelatihan ? 'error' : ''}
                                help={errors.jenis_pelatihan}
                            >
                                <Input
                                    value={data.jenis_pelatihan}
                                    onChange={(e) => setData('jenis_pelatihan', e.target.value)}
                                    placeholder="Contoh: Teknis, Manajerial"
                                    maxLength={100}
                                    size="large"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Nama Pelatihan"
                                required
                                validateStatus={errors.nama_pelatihan ? 'error' : ''}
                                help={errors.nama_pelatihan}
                            >
                                <Input
                                    value={data.nama_pelatihan}
                                    onChange={(e) => setData('nama_pelatihan', e.target.value)}
                                    placeholder="Contoh: Pelatihan GAP Hortikultura"
                                    maxLength={100}
                                    size="large"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item className="mb-0 pt-2">
                        <Space>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<SaveOutlined />}
                                loading={processing}
                                className="!border-emerald-500 !bg-emerald-500 hover:!bg-emerald-600"
                                size="large"
                            >
                                Simpan
                            </Button>
                            <Link href={route('admin.data-verval.jenis-pelatihan.index')}>
                                <Button icon={<ArrowLeftOutlined />} size="large">
                                    Kembali
                                </Button>
                            </Link>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </AdminLayout>
    );
}
