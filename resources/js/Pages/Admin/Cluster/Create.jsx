import AdminLayout from '@/Layouts/AdminLayout';
import ClusterFormFields from '@/Pages/Admin/Cluster/FormFields';
import { Head, router, useForm } from '@inertiajs/react';
import { Form, Button, Card, Typography, Breadcrumb } from 'antd';
import { HomeOutlined, ClusterOutlined, PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function ClusterCreate({ kabKotaOptions, kumoditasOptions }) {
    const { data, setData, post, processing, errors } = useForm({
        kode_kota: null,
        nama_cluster: '',
        kode_kumoditas: null,
    });

    const handleSubmit = () => {
        post(route('admin.cluster.store'));
    };

    return (
        <AdminLayout title="Tambah Kluster Petani">
            <Head title="Tambah Kluster Petani" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: 'Master' },
                    { href: route('admin.cluster.index'), title: <><ClusterOutlined /> Kluster Petani</> },
                    { title: 'Tambah' },
                ]}
            />

            <Card
                className="max-w-4xl shadow-sm border border-gray-100 rounded-xl"
                title={
                    <div className="flex items-center justify-between py-1">
                        <Title level={5} className="!mb-0 !text-gray-800">Tambah Kluster Petani</Title>
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
                            icon={<PlusOutlined />}
                            loading={processing}
                            disabled={!data.kode_kota}
                        >
                            Simpan
                        </Button>
                    </div>
                </Form>
            </Card>
        </AdminLayout>
    );
}
