import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { Table, Card, Typography, Breadcrumb, Tag, Button } from 'antd';
import { HomeOutlined, UserOutlined, TeamOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const GENDER_LABEL = { L: 'Laki-laki', P: 'Perempuan' };

export default function PetaniKeluarga({ petani, keluarga }) {
    const columns = [
        {
            title: 'No',
            key: 'no',
            width: 55,
            render: (_, __, i) => i + 1,
        },
        {
            title: 'Nama',
            dataIndex: 'nama',
            key: 'nama',
            width: 200,
            render: (v) => v ?? '-',
        },
        {
            title: 'NIK',
            dataIndex: 'nik',
            key: 'nik',
            width: 180,
            render: (v) => v ?? '-',
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            width: 120,
            align: 'center',
            render: (v) => v
                ? <Tag color={v === 'L' ? 'blue' : 'pink'}>{GENDER_LABEL[v] ?? v}</Tag>
                : '-',
        },
        {
            title: 'Usia',
            dataIndex: 'usia',
            key: 'usia',
            width: 80,
            align: 'center',
            render: (v) => v != null ? `${v} th` : '-',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 150,
            render: (v) => v ? <Tag>{v}</Tag> : '-',
        },
    ];

    return (
        <AdminLayout title="Data Keluarga Petani">
            <Head title="Data Keluarga Petani" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: 'Master' },
                    { href: route('admin.petani.index'), title: <><UserOutlined /> Petani</> },
                    { title: <><TeamOutlined /> Keluarga</> },
                ]}
            />

            <Card
                className="shadow-sm border border-gray-100 rounded-xl mb-4"
                size="small"
            >
                <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
                    <div><Text type="secondary">Nama Petani:</Text> <Text strong>{petani.nama_petani}</Text></div>
                    <div><Text type="secondary">NIK:</Text> <Text>{petani.nik_petani ?? '-'}</Text></div>
                    <div><Text type="secondary">No HP:</Text> <Text>{petani.no_hp_petani ?? '-'}</Text></div>
                    <div><Text type="secondary">Alamat:</Text> <Text>{petani.alamat_petani ?? '-'}</Text></div>
                </div>
            </Card>

            <Card
                className="shadow-sm border border-gray-100 rounded-xl"
                title={
                    <div className="flex items-center justify-between py-1">
                        <Title level={5} className="!mb-0 !text-gray-800">
                            <TeamOutlined className="mr-2" />
                            Data Keluarga ({keluarga.length})
                        </Title>
                        <Button icon={<ArrowLeftOutlined />} onClick={() => router.visit(route('admin.petani.index'))}>
                            Kembali
                        </Button>
                    </div>
                }
            >
                <Table
                    dataSource={keluarga}
                    columns={columns}
                    rowKey="id"
                    scroll={{ x: 'max-content' }}
                    pagination={keluarga.length > 20 ? { pageSize: 20, showTotal: (t) => `Total ${t} anggota keluarga` } : false}
                    rowClassName="hover:!bg-gray-50"
                    locale={{ emptyText: 'Tidak ada data keluarga' }}
                />
            </Card>
        </AdminLayout>
    );
}
