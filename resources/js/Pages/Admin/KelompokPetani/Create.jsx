import AdminLayout from '@/Layouts/AdminLayout';
import KelompokPetaniFormFields from '@/Pages/Admin/KelompokPetani/FormFields';
import { Head, router, useForm } from '@inertiajs/react';
import { Form, Button, Card, Typography, Breadcrumb } from 'antd';
import { HomeOutlined, UsergroupAddOutlined, PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function KelompokPetaniCreate({ provinsis }) {
    const { data, setData, post, processing, errors } = useForm({
        provinsi_code: null,
        kode_kota: null,
        kode_cluster: null,
        nama_poktan: '',
        ketua: '',
        telp: '',
        alamat: '',
    });

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
                className="max-w-5xl shadow-sm border border-gray-100 rounded-xl"
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
                    <KelompokPetaniFormFields
                        data={data}
                        setData={setData}
                        errors={errors}
                        provinsis={provinsis}
                    />

                    <div className="flex justify-end gap-3 pt-2">
                        <Button onClick={() => router.visit(route('admin.kelompok-petani.index'))}>Batal</Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<PlusOutlined />}
                            loading={processing}
                            disabled={!data.kode_cluster}
                        >
                            Simpan
                        </Button>
                    </div>
                </Form>
            </Card>
        </AdminLayout>
    );
}
