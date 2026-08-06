import AdminLayout from '@/Layouts/AdminLayout';
import DokumenKegiatanFormFields from '@/Pages/Admin/DokumenKegiatan/FormFields';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftOutlined, HomeOutlined, SaveOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Form, Space, Typography } from 'antd';

const { Title } = Typography;

export default function DokumenKegiatanEdit({ dokumen }) {
    const { data, setData, post, processing, errors } = useForm({
        judul: dokumen.judul ?? '',
        deskripsi: dokumen.deskripsi ?? '',
        file: null,
        cover: null,
        published_at: dokumen.published_at?.slice(0, 10) ?? '',
        is_published: dokumen.is_published ?? false,
        urutan: dokumen.urutan ?? 0,
        _method: 'put',
    });

    const handleSubmit = () => {
        post(route('admin.dokumen-kegiatan.update', dokumen.id), { forceFormData: true });
    };

    return (
        <AdminLayout title="Edit Dokumen Kegiatan">
            <Head title="Edit Dokumen Kegiatan" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { href: route('admin.dokumen-kegiatan.index'), title: 'Dokumen Kegiatan' },
                    { title: 'Edit' },
                ]}
            />

            <Card
                className="max-w-3xl rounded-xl border border-gray-100 shadow-sm"
                title={<Title level={5} className="!mb-0 !text-gray-800">Edit Dokumen Kegiatan</Title>}
            >
                <Form layout="vertical" onFinish={handleSubmit}>
                    <DokumenKegiatanFormFields
                        data={data}
                        setData={setData}
                        errors={errors}
                        existingFileUrl={dokumen.file_url}
                        existingCoverUrl={dokumen.cover_url}
                        isEdit
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
                                Simpan Perubahan
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
