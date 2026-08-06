import AdminLayout from '@/Layouts/AdminLayout';
import PendampingFormFields from '@/Pages/Admin/Pendamping/FormFields';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftOutlined, HomeOutlined, SaveOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Form, Space, Typography } from 'antd';

const { Title } = Typography;

export default function PendampingCreate({
    kabKotaOptions = [],
    bidangOptions = [],
    pendampingOptions = [],
}) {
    const { data, setData, post, processing, errors } = useForm({
        nama_fasilitator: '',
        gender: null,
        tanggal_lahir: '',
        domisili: '',
        alamat: '',
        pendidikan_terakhir: '',
        kode_kota: null,
        bidang: null,
        pendamping: null,
    });

    const handleSubmit = () => {
        post(route('admin.pendamping.store'));
    };

    return (
        <AdminLayout title="Tambah Pendamping">
            <Head title="Tambah Pendamping" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { href: route('admin.pendamping.index'), title: 'Pendamping' },
                    { title: 'Tambah' },
                ]}
            />

            <Card
                className="rounded-xl border border-gray-100 shadow-sm"
                title={<Title level={5} className="!mb-0 !text-gray-800">Tambah Data Pendamping</Title>}
            >
                <Form layout="vertical" onFinish={handleSubmit} className="max-w-xl">
                    <PendampingFormFields
                        data={data}
                        setData={setData}
                        errors={errors}
                        kabKotaOptions={kabKotaOptions}
                        bidangOptions={bidangOptions}
                        pendampingOptions={pendampingOptions}
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
                            <Link href={route('admin.pendamping.index')}>
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
