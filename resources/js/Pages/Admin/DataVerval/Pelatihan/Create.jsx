import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftOutlined, HomeOutlined, SaveOutlined } from '@ant-design/icons';
import {
    Breadcrumb,
    Button,
    Card,
    Form,
    Input,
    InputNumber,
    Select,
    Space,
    Typography,
} from 'antd';

const { Title } = Typography;

export default function PelatihanCreate({ jenisPelatihanOptions = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        kdjenis: null,
        tanggal: '',
        lokasi: '',
        jumlah_jpl: null,
        laki_laki: null,
        perempuan: null,
    });

    const handleSubmit = () => {
        post(route('admin.data-verval.pelatihan.store'));
    };

    return (
        <AdminLayout title="Tambah Pelatihan">
            <Head title="Tambah Pelatihan" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { href: route('admin.data-verval.pelatihan.index'), title: 'Pelatihan' },
                    { title: 'Tambah' },
                ]}
            />

            <Card
                className="rounded-xl border border-gray-100 shadow-sm"
                title={<Title level={5} className="!mb-0 !text-gray-800">Tambah Data Pelatihan</Title>}
            >
                <Form layout="vertical" onFinish={handleSubmit} className="max-w-xl">
                    <Form.Item
                        label="Jenis Pelatihan"
                        required
                        validateStatus={errors.kdjenis ? 'error' : ''}
                        help={errors.kdjenis}
                    >
                        <Select
                            showSearch
                            allowClear
                            placeholder="Pilih jenis pelatihan"
                            size="large"
                            value={data.kdjenis}
                            onChange={(value) => setData('kdjenis', value ?? null)}
                            options={jenisPelatihanOptions}
                            optionFilterProp="label"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Tanggal"
                        required
                        validateStatus={errors.tanggal ? 'error' : ''}
                        help={errors.tanggal}
                    >
                        <Input
                            type="date"
                            value={data.tanggal}
                            onChange={(e) => setData('tanggal', e.target.value)}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Lokasi"
                        required
                        validateStatus={errors.lokasi ? 'error' : ''}
                        help={errors.lokasi}
                    >
                        <Input
                            value={data.lokasi}
                            onChange={(e) => setData('lokasi', e.target.value)}
                            placeholder="Contoh: Aula Dinas Pertanian"
                            maxLength={100}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Jumlah JPL"
                        required
                        validateStatus={errors.jumlah_jpl ? 'error' : ''}
                        help={errors.jumlah_jpl}
                    >
                        <InputNumber
                            className="w-full"
                            min={0}
                            value={data.jumlah_jpl}
                            onChange={(value) => setData('jumlah_jpl', value)}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Laki-laki"
                        required
                        validateStatus={errors.laki_laki ? 'error' : ''}
                        help={errors.laki_laki}
                    >
                        <InputNumber
                            className="w-full"
                            min={0}
                            value={data.laki_laki}
                            onChange={(value) => setData('laki_laki', value)}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Perempuan"
                        required
                        validateStatus={errors.perempuan ? 'error' : ''}
                        help={errors.perempuan}
                    >
                        <InputNumber
                            className="w-full"
                            min={0}
                            value={data.perempuan}
                            onChange={(value) => setData('perempuan', value)}
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
