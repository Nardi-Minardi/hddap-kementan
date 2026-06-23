import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { Table, Card, Input, Select, Typography, Breadcrumb, Tag, Space } from 'antd';
import { HomeOutlined, BankOutlined, SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title } = Typography;

export default function KabKotaIndex({ kabKotas, provinsis, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleFilter = (params) => {
        router.get(route('admin.kab-kota.index'), { ...filters, ...params, page: 1 }, { preserveState: true, replace: true });
    };

    const columns = [
        {
            title: 'No',
            key: 'no',
            width: 60,
            render: (_, __, index) => (kabKotas.current_page - 1) * kabKotas.per_page + index + 1,
        },
        {
            title: 'Kode',
            dataIndex: 'code',
            key: 'code',
            width: 140,
            render: (code) => <Tag color="blue">{code}</Tag>,
        },
        {
            title: 'Nama Kab/Kota',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Provinsi',
            dataIndex: 'provinsi_code',
            key: 'provinsi_code',
            render: (code, record) => record.provinsi?.name ?? code,
        },
    ];

    return (
        <AdminLayout title="Kab/Kota">
            <Head title="Kab/Kota" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: 'Master' },
                    { title: <><BankOutlined /> Kab/Kota</> },
                ]}
            />

            <Card
                className="shadow-sm border border-gray-100 rounded-xl"
                title={
                    <div className="flex items-center justify-between flex-wrap gap-3 py-1">
                        <Title level={5} className="!mb-0 !text-gray-800">Daftar Kab/Kota</Title>
                        <Space wrap>
                            <Select
                                allowClear
                                placeholder="Filter Provinsi"
                                style={{ width: 200 }}
                                value={filters.provinsi_code || undefined}
                                onChange={(val) => handleFilter({ provinsi_code: val ?? '' })}
                                options={provinsis.map((p) => ({ value: p.code, label: p.name }))}
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
                    dataSource={kabKotas.data}
                    columns={columns}
                    rowKey="id"
                    pagination={{
                        current: kabKotas.current_page,
                        total: kabKotas.total,
                        pageSize: kabKotas.per_page,
                        showSizeChanger: false,
                        showTotal: (total) => `Total ${total} kab/kota`,
                        onChange: (page) => router.get(route('admin.kab-kota.index'), { ...filters, page }, { preserveState: true }),
                    }}
                    rowClassName="hover:!bg-gray-50"
                />
            </Card>
        </AdminLayout>
    );
}
