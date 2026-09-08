import AdminLayout from '@/Layouts/AdminLayout';
import JenisPelatihanFormFields, { emptyJenisPelatihanForm } from './FormFields';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftOutlined, HomeOutlined, SaveOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Form, Space, Typography } from 'antd';

const { Title } = Typography;

export default function JenisPelatihanCreate({ provinsis, topikOptions = [] }) {
    const { data, setData, post, processing, errors } = useForm(emptyJenisPelatihanForm());

    const handleSubmit = () => {
        post(route('admin.data-verval.jenis-pelatihan.store'));
    };

    return (
        <AdminLayout title="Tambah Management event">
            <Head title="Tambah Management event" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { href: route('admin.data-verval.jenis-pelatihan.index'), title: 'Management event' },
                    { title: 'Tambah' },
                ]}
            />

            <Card
                className="mx-auto max-w-6xl overflow-hidden rounded-xl border border-gray-100 shadow-sm"
                styles={{
                    header: {
                        background: '#16a34a',
                        borderBottom: 'none',
                        padding: '14px 24px',
                    },
                }}
                title={(
                    <Title level={5} className="!mb-0 !text-white">
                        Form Management event
                    </Title>
                )}
            >
                <Form layout="vertical" onFinish={handleSubmit} className="pt-2">
                    <JenisPelatihanFormFields
                        data={data}
                        setData={setData}
                        errors={errors}
                        provinsis={provinsis}
                        topikOptions={topikOptions}
                    />

                    <Form.Item className="mb-0 pt-4">
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
