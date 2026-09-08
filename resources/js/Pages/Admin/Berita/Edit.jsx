import AdminLayout from '@/Layouts/AdminLayout';
import BeritaFormFields, { fotoKegiatanFormFromRecord, transformBeritaForm } from '@/Pages/Admin/Berita/FormFields';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftOutlined, HomeOutlined, SaveOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Form, Space, Typography } from 'antd';

const { Title } = Typography;

export default function BeritaEdit({
    berita,
    tipeOptions = [],
    showKabKota = true,
    kabKotaOptions = [],
    defaultKodeKota = null,
}) {
    const { data, setData, post, processing, errors, transform } = useForm({
        judul: berita.judul ?? '',
        tipe: berita.tipe ?? 'berita',
        kode_kota: berita.kode_kota ?? defaultKodeKota ?? null,
        ringkasan: berita.ringkasan ?? '',
        konten: berita.konten ?? '',
        image: null,
        image_url: berita.image_url?.startsWith('http') ? berita.image_url : '',
        published_at: berita.published_at ? berita.published_at.slice(0, 10) : null,
        is_published: !!berita.is_published,
        urutan: berita.urutan ?? 0,
        foto_kegiatan: fotoKegiatanFormFromRecord(berita.foto_kegiatan ?? []),
        _method: 'put',
    });

    const handleSubmit = () => {
        transform((formData) => transformBeritaForm(formData));
        post(route('admin.berita.update', berita.id), { forceFormData: true });
    };

    return (
        <AdminLayout title="Edit Berita">
            <Head title="Edit Berita" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { href: route('admin.berita.index'), title: 'Berita & Agenda' },
                    { title: 'Edit' },
                ]}
            />

            <Card
                className="max-w-3xl rounded-xl border border-gray-100 shadow-sm"
                title={<Title level={5} className="!mb-0 !text-gray-800">Edit Berita / Agenda</Title>}
            >
                <Form layout="vertical" onFinish={handleSubmit}>
                    <BeritaFormFields
                        data={data}
                        setData={setData}
                        errors={errors}
                        existingImageUrl={berita.image_url}
                        existingFotoKegiatan={berita.foto_kegiatan ?? []}
                        tipeOptions={tipeOptions}
                        showKabKota={showKabKota}
                        kabKotaOptions={kabKotaOptions}
                        defaultKodeKota={defaultKodeKota}
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
                                Update
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
