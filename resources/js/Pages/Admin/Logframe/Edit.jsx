import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftOutlined, HomeOutlined, SaveOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Form, Input, Row, Col, Space, Typography } from 'antd';

const { Title } = Typography;
const { TextArea } = Input;

const fields = [
    { name: 'tingkat', label: 'Tingkat' },
    { name: 'component', label: 'Component' },
    { name: 'nama_indikator', label: 'Nama Indikator', required: true },
    { name: 'definisi_indikator', label: 'Definisi Indikator', rows: 4 },
    { name: 'data_yg_dikumpulkan', label: 'Data yang Dikumpulkan', rows: 4 },
    { name: 'sumber_data', label: 'Sumber Data' },
    { name: 'nilai_dasar', label: 'Nilai Dasar' },
    { name: 'target_pertengahan_proyek', label: 'Target Pertengahan Proyek' },
    { name: 'target_akhir_proyek', label: 'Target Akhir Proyek' },
    { name: 'realisasi', label: 'Realisasi' },
];

export default function LogframeEdit({ logframe }) {
    const { data, setData, patch, processing, errors } = useForm({
        tingkat: logframe.tingkat || '',
        component: logframe.component || '',
        nama_indikator: logframe.nama_indikator || '',
        definisi_indikator: logframe.definisi_indikator || '',
        nilai_dasar: logframe.nilai_dasar || '',
        target_pertengahan_proyek: logframe.target_pertengahan_proyek || '',
        target_akhir_proyek: logframe.target_akhir_proyek || '',
        realisasi: logframe.realisasi || '',
        sumber_data: logframe.sumber_data || '',
        data_yg_dikumpulkan: logframe.data_yg_dikumpulkan || '',
    });

    const handleSubmit = () => {
        patch(route('admin.logframe.update', logframe.id));
    };

    return (
        <AdminLayout title="Edit Logframe">
            <Head title="Edit Logframe" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { href: route('admin.logframe.index'), title: 'Logframe' },
                    { title: 'Edit' },
                ]}
            />

            <Card
                className="rounded-xl border border-gray-100 shadow-sm"
                title={<Title level={5} className="!mb-0 !text-gray-800">Edit Data Logframe</Title>}
            >
                <Form layout="vertical" onFinish={handleSubmit}>
                    <Row gutter={16}>
                        {fields.map((field) => (
                            <Col xs={24} md={field.rows ? 24 : 12} key={field.name}>
                                <Form.Item
                                    label={field.label}
                                    required={field.required}
                                    validateStatus={errors[field.name] ? 'error' : ''}
                                    help={errors[field.name]}
                                >
                                    {field.rows ? (
                                        <TextArea
                                            rows={field.rows}
                                            value={data[field.name]}
                                            onChange={(e) => setData(field.name, e.target.value)}
                                            placeholder={field.label}
                                        />
                                    ) : (
                                        <Input
                                            value={data[field.name]}
                                            onChange={(e) => setData(field.name, e.target.value)}
                                            placeholder={field.label}
                                            size="large"
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        ))}
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
                                Update
                            </Button>
                            <Link href={route('admin.logframe.index')}>
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
