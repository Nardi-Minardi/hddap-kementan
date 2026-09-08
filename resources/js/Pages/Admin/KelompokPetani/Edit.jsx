import AdminLayout from '@/Layouts/AdminLayout';
import KelompokPetaniFormFields from '@/Pages/Admin/KelompokPetani/FormFields';
import { Head, router, useForm } from '@inertiajs/react';
import { Form, Button, Card, Typography, Breadcrumb } from 'antd';
import { HomeOutlined, UsergroupAddOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function KelompokPetaniEdit({ poktan, provinsis }) {
    const { data, setData, put, processing, errors } = useForm({
        provinsi_code: poktan.kab_kota?.provinsi?.code ?? null,
        kode_kota: poktan.kode_kota ?? null,
        kode_cluster: poktan.kode_cluster ?? null,
        nama_poktan: poktan.nama_poktan ?? '',
        ketua: poktan.ketua ?? '',
        telp: poktan.telp ?? '',
        alamat: poktan.alamat ?? '',
    });

    const handleSubmit = () => {
        put(route('admin.kelompok-petani.update', poktan.id));
    };

    return (
        <AdminLayout title="Edit Kelompok Petani">
            <Head title="Edit Kelompok Petani" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: 'Master' },
                    { href: route('admin.kelompok-petani.index'), title: <><UsergroupAddOutlined /> Kelompok Petani</> },
                    { title: 'Edit' },
                ]}
            />

            <Card
                className="max-w-5xl shadow-sm border border-gray-100 rounded-xl"
                title={
                    <div className="flex items-center justify-between py-1">
                        <Title level={5} className="!mb-0 !text-gray-800">Edit Kelompok Petani</Title>
                        <Button icon={<ArrowLeftOutlined />} onClick={() => router.visit(route('admin.kelompok-petani.index'))}>
                            Kembali
                        </Button>
                    </div>
                }
            >
                <Form layout="vertical" onFinish={handleSubmit}>
                    <KelompokPetaniFormFields
                        data={data}
                        setData={setData}
                        errors={errors}
                        provinsis={provinsis}
                        isEdit
                    />

                    <div className="flex justify-end gap-3 pt-2">
                        <Button onClick={() => router.visit(route('admin.kelompok-petani.index'))}>Batal</Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            loading={processing}
                            disabled={!data.kode_cluster}
                        >
                            Simpan Perubahan
                        </Button>
                    </div>
                </Form>
            </Card>
        </AdminLayout>
    );
}
