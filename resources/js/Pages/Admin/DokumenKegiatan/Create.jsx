import AdminLayout from '@/Layouts/AdminLayout';
import DokumenKegiatanFormFields from '@/Pages/Admin/DokumenKegiatan/FormFields';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftOutlined, HomeOutlined, SaveOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Form, Space, Typography } from 'antd';

const { Title } = Typography;

export default function DokumenKegiatanCreate() {
    const { data, setData, post, processing, errors } = useForm({
        judul: '',
        deskripsi: '',
        file: null,
        cover: null,
        published_at: new Date().toISOString().slice(0, 10),
        is_published: true,
        urutan: 0,
    });

    const handleSubmit = () => {
        post(route('admin.dokumen-kegiatan.store'), { forceFormData: true });
    };

    return (
        <AdminLayout title="Tambah Dokumen Kegiatan">
            <Head title="Tambah Dokumen Kegiatan" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { href: route('admin.dokumen-kegiatan.index'), title: 'Dokumen Kegiatan' },
                    { title: 'Tambah' },
                ]}
            />

            <Card
                className="max-w-3xl rounded-xl border border-gray-100 shadow-sm"
                title={<Title level={5} className="!mb-0 !text-gray-800">Tambah Dokumen Kegiatan (PDF)</Title>}
            >
                <Form layout="vertical" onFinish={handleSubmit}>
                    <DokumenKegiatanFormFields data={data} setData={setData} errors={errors} />

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
                            <Link href={route('admin.dokumen-kegiatan.index')}>
                                <Button icon={<ArrowLeftOutlined />} size="large">Kembali</Button>
                            </Link>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </AdminLayout>
    );
}
