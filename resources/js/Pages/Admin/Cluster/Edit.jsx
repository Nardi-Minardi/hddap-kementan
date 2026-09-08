import AdminLayout from '@/Layouts/AdminLayout';
import ClusterFormFields from '@/Pages/Admin/Cluster/FormFields';
import { Head, router, useForm } from '@inertiajs/react';
import { Form, Button, Card, Typography, Breadcrumb } from 'antd';
import { HomeOutlined, ClusterOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function ClusterEdit({ cluster, kabKotaOptions, kumoditasOptions }) {
    const { data, setData, put, processing, errors } = useForm({
        kode_kota: cluster.kode_kota ?? null,
        nama_cluster: cluster.nama_cluster ?? '',
        kode_kumoditas: cluster.kode_kumoditas ?? null,
    });

    const handleSubmit = () => {
        put(route('admin.cluster.update', cluster.id));
    };

    return (
        <AdminLayout title="Edit Kluster Petani">
            <Head title="Edit Kluster Petani" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: 'Master' },
                    { href: route('admin.cluster.index'), title: <><ClusterOutlined /> Kluster Petani</> },
                    { title: 'Edit' },
                ]}
            />

            <Card
                className="max-w-4xl shadow-sm border border-gray-100 rounded-xl"
                title={
                    <div className="flex items-center justify-between py-1">
                        <Title level={5} className="!mb-0 !text-gray-800">Edit Kluster Petani</Title>
                        <Button icon={<ArrowLeftOutlined />} onClick={() => router.visit(route('admin.cluster.index'))}>
                            Kembali
                        </Button>
                    </div>
                }
            >
                <Form layout="vertical" onFinish={handleSubmit}>
                    <ClusterFormFields
                        data={data}
                        setData={setData}
                        errors={errors}
                        kabKotaOptions={kabKotaOptions}
                        kumoditasOptions={kumoditasOptions}
                    />

                    <div className="flex justify-end gap-3 pt-2">
                        <Button onClick={() => router.visit(route('admin.cluster.index'))}>Batal</Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            loading={processing}
                            disabled={!data.kode_kota}
                        >
                            Simpan Perubahan
                        </Button>
                    </div>
                </Form>
            </Card>
        </AdminLayout>
    );
}
