import AdminLayout from '@/Layouts/AdminLayout';
import PetaniFormFields from '@/Pages/Admin/Petani/FormFields';
import { Head, router, useForm } from '@inertiajs/react';
import { Form, Button, Card, Typography, Breadcrumb } from 'antd';
import { HomeOutlined, UserOutlined, PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function PetaniCreate({
    showKabKota = true,
    kabKotaOptions = [],
    defaultKodeKota = null,
}) {
    const { data, setData, post, processing, errors } = useForm({
        nama_petani: '',
        nik_petani: '',
        no_hp_petani: '',
        gender_petani: null,
        usia_petani: null,
        difabel: false,
        alamat_petani: '',
        kode_kota: defaultKodeKota ?? null,
        kode_cluster: null,
        kode_poktan: null,
        latitude: null,
        longitude: null,
        foto_lahan: null,
    });

    const handleSubmit = () => {
        post(route('admin.petani.store'), { forceFormData: true });
    };

    return (
        <AdminLayout title="Tambah Petani">
            <Head title="Tambah Petani" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: 'Master' },
                    { href: route('admin.petani.index'), title: <><UserOutlined /> Petani</> },
                    { title: 'Tambah' },
                ]}
            />

            <Card
                className="max-w-6xl shadow-sm border border-gray-100 rounded-xl"
                title={
                    <div className="flex items-center justify-between py-1">
                        <Title level={5} className="!mb-0 !text-gray-800">Tambah Petani</Title>
                        <Button icon={<ArrowLeftOutlined />} onClick={() => router.visit(route('admin.petani.index'))}>Kembali</Button>
                    </div>
                }
            >
                <Form layout="vertical" onFinish={handleSubmit}>
                    <PetaniFormFields
                        data={data}
                        setData={setData}
                        errors={errors}
                        showKabKota={showKabKota}
                        kabKotaOptions={kabKotaOptions}
                        defaultKodeKota={defaultKodeKota}
                    />

                    <div className="flex justify-end gap-3 pt-2">
                        <Button onClick={() => router.visit(route('admin.petani.index'))}>Batal</Button>
                        <Button type="primary" htmlType="submit" icon={<PlusOutlined />} loading={processing}>Simpan</Button>
                    </div>
                </Form>
            </Card>
        </AdminLayout>
    );
}
