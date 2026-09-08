import AdminLayout from '@/Layouts/AdminLayout';
import SubMenuDokumenFormFields from '@/Pages/Admin/SubMenuDokumen/FormFields';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftOutlined, HomeOutlined, SaveOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Form, Space, Typography } from 'antd';

const { Title } = Typography;

export default function SubMenuDokumenCreate() {
    const { data, setData, post, processing, errors } = useForm({
        nama: '',
        urutan: 0,
        is_active: true,
    });

    return (
        <AdminLayout title="Tambah Sub Menu Dokumen">
            <Head title="Tambah Sub Menu Dokumen" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { href: route('admin.sub-menu-dokumen.index'), title: 'Sub Menu Dokumen' },
                    { title: 'Tambah' },
                ]}
            />

            <Card
                className="max-w-xl rounded-xl border border-gray-100 shadow-sm"
                title={<Title level={5} className="!mb-0 !text-gray-800">Tambah Sub Menu Dokumen</Title>}
            >
                <Form layout="vertical" onFinish={() => post(route('admin.sub-menu-dokumen.store'))}>
                    <SubMenuDokumenFormFields data={data} setData={setData} errors={errors} />
                    <Form.Item className="mb-0 pt-2">
                        <Space>
                            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={processing} className="!border-emerald-500 !bg-emerald-500 hover:!bg-emerald-600" size="large">
                                Simpan
                            </Button>
                            <Link href={route('admin.sub-menu-dokumen.index')}>
                                <Button icon={<ArrowLeftOutlined />} size="large">Kembali</Button>
                            </Link>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </AdminLayout>
    );
}
