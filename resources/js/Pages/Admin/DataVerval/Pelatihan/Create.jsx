import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftOutlined, HomeOutlined, SaveOutlined } from '@ant-design/icons';
import {
    Breadcrumb,
    Button,
    Card,
    Form,
    Input,
    Space,
    Typography,
} from 'antd';

const { Title } = Typography;

export default function PelatihanCreate() {
    const { data, setData, post, processing, errors } = useForm({
        komponen: '',
        nama_kegiatan: '',
        kode_owp: '',
    });

    const handleSubmit = () => {
        post(route('admin.data-verval.pelatihan.store'));
    };

    return (
        <AdminLayout title="Tambah management topik">
            <Head title="Tambah management topik" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { href: route('admin.data-verval.pelatihan.index'), title: 'Management Topik' },
                    { title: 'Tambah' },
                ]}
            />

            <Card
                className="rounded-xl border border-gray-100 shadow-sm"
                title={<Title level={5} className="!mb-0 !text-gray-800">Tambah Management Topik</Title>}
            >
                <Form layout="vertical" onFinish={handleSubmit} className="max-w-2xl">
                    <Form.Item
                        label="Komponen"
                        required
                        validateStatus={errors.komponen ? 'error' : ''}
                        help={errors.komponen}
                    >
                        <Input
                            value={data.komponen}
                            onChange={(e) => setData('komponen', e.target.value)}
                            placeholder="Contoh: Komponen 1"
                            maxLength={100}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Item Kegiatan"
                        required
                        validateStatus={errors.nama_kegiatan ? 'error' : ''}
                        help={errors.nama_kegiatan}
                    >
                        <Input.TextArea
                            value={data.nama_kegiatan}
                            onChange={(e) => setData('nama_kegiatan', e.target.value)}
                            placeholder="Nama kegiatan bimtek/sosialisasi/pelatihan"
                            maxLength={255}
                            rows={3}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Kode Komponen OWP"
                        required
                        validateStatus={errors.kode_owp ? 'error' : ''}
                        help={errors.kode_owp}
                    >
                        <Input
                            value={data.kode_owp}
                            onChange={(e) => setData('kode_owp', e.target.value)}
                            placeholder="Contoh: 1.1.3.1"
                            maxLength={20}
                            size="large"
                        />
                    </Form.Item>

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
                            <Link href={route('admin.data-verval.pelatihan.index')}>
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
