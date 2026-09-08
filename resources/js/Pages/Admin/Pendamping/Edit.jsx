import AdminLayout from '@/Layouts/AdminLayout';
import PendampingFormFields from '@/Pages/Admin/Pendamping/FormFields';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftOutlined, HomeOutlined, SaveOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Form, Space, Typography } from 'antd';

const { Title } = Typography;

function toDateInputValue(value) {
    if (!value) {
        return '';
    }

    return String(value).slice(0, 10);
}

export default function PendampingEdit({
    pendamping,
    kabKotaOptions = [],
    bidangOptions = [],
    pendampingOptions = [],
}) {
    const { data, setData, patch, processing, errors } = useForm({
        nama_fasilitator: pendamping.nama_fasilitator || '',
        gender: pendamping.gender ?? null,
        tanggal_lahir: toDateInputValue(pendamping.tanggal_lahir),
        domisili: pendamping.domisili || '',
        alamat: pendamping.alamat || '',
        pendidikan_terakhir: pendamping.pendidikan_terakhir || '',
        kode_kota: pendamping.kode_kota ?? null,
        bidang: pendamping.bidang ?? null,
        pendamping: pendamping.pendamping ?? null,
    });

    const handleSubmit = () => {
        patch(route('admin.pendamping.update', pendamping.no));
    };

    return (
        <AdminLayout title="Edit Fasilitator">
            <Head title="Edit Fasilitator" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { href: route('admin.pendamping.index'), title: 'Fasilitator' },
                    { title: 'Edit' },
                ]}
            />

            <Card
                className="rounded-xl border border-gray-100 shadow-sm"
                title={<Title level={5} className="!mb-0 !text-gray-800">Edit Data Fasilitator</Title>}
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
                                Update
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
