import AdminLayout from '@/Layouts/AdminLayout';
import SubMenuDokumenFormFields from '@/Pages/Admin/SubMenuDokumen/FormFields';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftOutlined, HomeOutlined, SaveOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Form, Space, Typography } from 'antd';

const { Title } = Typography;

export default function SubMenuDokumenEdit({ subMenu }) {
    const { data, setData, put, processing, errors } = useForm({
        nama: subMenu.nama ?? '',
        urutan: subMenu.urutan ?? 0,
        is_active: subMenu.is_active ?? true,
    });

    return (
        <AdminLayout title="Edit Sub Menu Dokumen">
            <Head title="Edit Sub Menu Dokumen" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { href: route('admin.sub-menu-dokumen.index'), title: 'Sub Menu Dokumen' },
                    { title: 'Edit' },
                ]}
            />

            <Card
                className="max-w-xl rounded-xl border border-gray-100 shadow-sm"
                title={<Title level={5} className="!mb-0 !text-gray-800">Edit Sub Menu Dokumen</Title>}
            >
                <Form layout="vertical" onFinish={() => put(route('admin.sub-menu-dokumen.update', subMenu.id))}>
                    <SubMenuDokumenFormFields data={data} setData={setData} errors={errors} />
                    <Form.Item className="mb-0 pt-2">
                        <Space>
                            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={processing} className="!border-emerald-500 !bg-emerald-500 hover:!bg-emerald-600" size="large">
                                Simpan Perubahan
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
