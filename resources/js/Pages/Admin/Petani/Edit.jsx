import AdminLayout from '@/Layouts/AdminLayout';
import PetaniFormFields from '@/Pages/Admin/Petani/FormFields';
import { Head, router, useForm } from '@inertiajs/react';
import { Form, Button, Card, Typography, Breadcrumb } from 'antd';
import { HomeOutlined, UserOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Title } = Typography;

function parseCoordinate(value) {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const parsed = typeof value === 'number'
        ? value
        : parseFloat(String(value).trim().replace(',', '.'));

    return Number.isFinite(parsed) ? parsed : null;
}

export default function PetaniEdit({
    petani,
    showKabKota = true,
    kabKotaOptions = [],
    defaultKodeKota = null,
}) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        nama_petani: petani.nama_petani ?? '',
        nik_petani: petani.nik_petani ?? '',
        no_hp_petani: petani.no_hp_petani ?? '',
        gender_petani: petani.gender_petani ?? null,
        usia_petani: petani.usia_petani ?? null,
        difabel: petani.difabel ?? false,
        alamat_petani: petani.alamat_petani ?? '',
        kode_kota: petani.kode_kota ?? petani.poktan?.kode_kota ?? defaultKodeKota ?? null,
        kode_cluster: petani.poktan?.kode_cluster ?? null,
        kode_poktan: petani.kode_poktan ?? null,
        latitude: parseCoordinate(petani.latitude),
        longitude: parseCoordinate(petani.longitude),
        foto_lahan: null,
    });

    const existingFotoUrl = petani.foto_lahan ? `/storage/${petani.foto_lahan}` : null;

    const handleSubmit = () => {
        post(route('admin.petani.update', petani.id), { forceFormData: true });
    };

    return (
        <AdminLayout title="Edit Petani">
            <Head title="Edit Petani" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: 'Master' },
                    { href: route('admin.petani.index'), title: <><UserOutlined /> Petani</> },
                    { title: 'Edit' },
                ]}
            />

            <Card
                className="max-w-6xl shadow-sm border border-gray-100 rounded-xl"
                title={
                    <div className="flex items-center justify-between py-1">
                        <Title level={5} className="!mb-0 !text-gray-800">Edit Petani</Title>
                        <Button icon={<ArrowLeftOutlined />} onClick={() => router.visit(route('admin.petani.index'))}>Kembali</Button>
                    </div>
                }
            >
                <Form layout="vertical" onFinish={handleSubmit}>
                    <PetaniFormFields
                        data={data}
                        setData={setData}
                        errors={errors}
                        existingFotoUrl={existingFotoUrl}
                        showKabKota={showKabKota}
                        kabKotaOptions={kabKotaOptions}
                        defaultKodeKota={defaultKodeKota}
                    />

                    <div className="flex justify-end gap-3 pt-2">
                        <Button onClick={() => router.visit(route('admin.petani.index'))}>Batal</Button>
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={processing}>Simpan Perubahan</Button>
                    </div>
                </Form>
            </Card>
        </AdminLayout>
    );
}
