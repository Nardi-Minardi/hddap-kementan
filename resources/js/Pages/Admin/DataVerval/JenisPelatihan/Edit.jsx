import AdminLayout from '@/Layouts/AdminLayout';
import JenisPelatihanFormFields, { jenisPelatihanFormFromRecord } from './FormFields';
import DetailPeserta from './DetailPeserta';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeftOutlined, HomeOutlined, SaveOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Form, Space, Typography, message } from 'antd';
import { useEffect } from 'react';

const { Title } = Typography;

export default function JenisPelatihanEdit({ jenisPelatihan, provinsis, topikOptions = [], peserta = [] }) {
    const { flash } = usePage().props;
    const { data, setData, patch, processing, errors } = useForm(
        jenisPelatihanFormFromRecord(jenisPelatihan),
    );

    useEffect(() => {
        if (flash?.success) {
            message.success(flash.success);
        }

        if (flash?.focus_peserta) {
            window.setTimeout(() => {
                document.getElementById('detail-peserta')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }, 300);
        }
    }, [flash]);

    const handleSubmit = () => {
        patch(route('admin.data-verval.jenis-pelatihan.update', jenisPelatihan.kdjenis), {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout title="Edit Management event">
            <Head title="Edit Management event" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { href: route('admin.data-verval.jenis-pelatihan.index'), title: 'Management event' },
                    { title: 'Edit' },
                ]}
            />

            <Card
                className="mx-auto max-w-6xl overflow-hidden rounded-xl border border-gray-100 shadow-sm"
                styles={{
                    header: {
                        background: '#16a34a',
                        borderBottom: 'none',
                        padding: '14px 24px',
                    },
                }}
                title={(
                    <Title level={5} className="!mb-0 !text-white">
                        Form Management event
                    </Title>
                )}
            >
                <Form layout="vertical" onFinish={handleSubmit} className="pt-2">
                    <JenisPelatihanFormFields
                        data={data}
                        setData={setData}
                        errors={errors}
                        provinsis={provinsis}
                        topikOptions={topikOptions}
                    />

                    <Form.Item className="mb-0 pt-4">
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
                            <Link href={route('admin.data-verval.jenis-pelatihan.index')}>
                                <Button icon={<ArrowLeftOutlined />} size="large">
                                    Kembali
                                </Button>
                            </Link>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>

            <DetailPeserta
                kdjenis={jenisPelatihan.kdjenis}
                peserta={peserta}
                provinsis={provinsis}
            />
        </AdminLayout>
    );
}
