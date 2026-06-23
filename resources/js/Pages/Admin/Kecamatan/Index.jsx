import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { Table, Card, Input, Select, Typography, Breadcrumb, Tag, Space } from 'antd';
import { HomeOutlined, EnvironmentOutlined, SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title } = Typography;

export default function KecamatanIndex({ kecamatans, kabKotas, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleFilter = (params) => {
        router.get(route('admin.kecamatan.index'), { ...filters, ...params, page: 1 }, { preserveState: true, replace: true });
    };

    const columns = [
        {
            title: 'No',
            key: 'no',
            width: 60,
            render: (_, __, index) => (kecamatans.current_page - 1) * kecamatans.per_page + index + 1,
        },
        {
            title: 'Kode',
            dataIndex: 'code',
            key: 'code',
            width: 160,
            render: (code) => <Tag color="blue">{code}</Tag>,
        },
        {
            title: 'Nama Kecamatan',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Kab/Kota',
            dataIndex: 'kab_kota_code',
            key: 'kab_kota_code',
            render: (code, record) => record.kab_kota?.name ?? code,
        },
    ];

    return (
        <AdminLayout title="Kecamatan">
            <Head title="Kecamatan" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: 'Master' },
                    { title: <><EnvironmentOutlined /> Kecamatan</> },
                ]}
            />

            <Card
                className="shadow-sm border border-gray-100 rounded-xl"
                title={
                    <div className="flex items-center justify-between flex-wrap gap-3 py-1">
                        <Title level={5} className="!mb-0 !text-gray-800">Daftar Kecamatan</Title>
                        <Space wrap>
                            <Select
                                allowClear
                                placeholder="Filter Kab/Kota"
                                style={{ width: 220 }}
                                value={filters.kab_kota_code || undefined}
                                onChange={(val) => handleFilter({ kab_kota_code: val ?? '' })}
                                options={kabKotas.map((k) => ({ value: k.code, label: k.name }))}
                                showSearch
                                filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                            />
                            <Input
                                placeholder="Cari kode / nama..."
                                prefix={<SearchOutlined className="text-gray-400" />}
                                defaultValue={filters.search}
                                onPressEnter={(e) => handleFilter({ search: e.target.value })}
                                onChange={(e) => setSearch(e.target.value)}
                                onBlur={() => handleFilter({ search })}
                                style={{ width: 240 }}
                                allowClear
                                onClear={() => handleFilter({ search: '' })}
                            />
                        </Space>
                    </div>
                }
            >
                <Table
                    dataSource={kecamatans.data}
                    columns={columns}
                    rowKey="id"
                    pagination={{
                        current: kecamatans.current_page,
                        total: kecamatans.total,
                        pageSize: kecamatans.per_page,
                        showSizeChanger: false,
                        showTotal: (total) => `Total ${total} kecamatan`,
                        onChange: (page) => router.get(route('admin.kecamatan.index'), { ...filters, page }, { preserveState: true }),
                    }}
                    rowClassName="hover:!bg-gray-50"
                />
            </Card>
        </AdminLayout>
    );
}
