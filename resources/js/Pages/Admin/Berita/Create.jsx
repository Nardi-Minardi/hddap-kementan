import AdminLayout from '@/Layouts/AdminLayout';
import BeritaFormFields from '@/Pages/Admin/Berita/FormFields';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftOutlined, HomeOutlined, SaveOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Form, Space, Typography } from 'antd';

const { Title } = Typography;

export default function BeritaCreate({ tipeOptions = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        judul: '',
        tipe: 'berita',
        ringkasan: '',
        konten: '',
        image: null,
        image_url: '',
        published_at: new Date().toISOString().slice(0, 10),
        is_published: true,
        urutan: 0,
    });

    const handleSubmit = () => {
        post(route('admin.berita.store'), { forceFormData: true });
    };

    return (
        <AdminLayout title="Tambah Berita">
            <Head title="Tambah Berita" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { href: route('admin.berita.index'), title: 'Berita & Agenda' },
                    { title: 'Tambah' },
                ]}
            />

            <Card
                className="max-w-3xl rounded-xl border border-gray-100 shadow-sm"
                title={<Title level={5} className="!mb-0 !text-gray-800">Tambah Berita / Agenda</Title>}
            >
                <Form layout="vertical" onFinish={handleSubmit}>
                    <BeritaFormFields
                        data={data}
                        setData={setData}
                        errors={errors}
                        tipeOptions={tipeOptions}
                    />

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
                            <Link href={route('admin.berita.index')}>
                                <Button icon={<ArrowLeftOutlined />} size="large">Kembali</Button>
                            </Link>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </AdminLayout>
    );
}
