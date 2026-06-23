import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { Table, Card, Input, Typography, Breadcrumb, Tag, Space } from 'antd';
import { HomeOutlined, SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title } = Typography;

export default function KelDesIndex({ kelDess, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleFilter = (params) => {
        router.get(route('admin.kel-des.index'), { ...filters, ...params, page: 1 }, { preserveState: true, replace: true });
    };

    const columns = [
        {
            title: 'No',
            key: 'no',
            width: 60,
            render: (_, __, index) => (kelDess.current_page - 1) * kelDess.per_page + index + 1,
        },
        {
            title: 'Kode',
            dataIndex: 'code',
            key: 'code',
            width: 180,
            render: (code) => <Tag color="blue">{code}</Tag>,
        },
        {
            title: 'Nama Kel/Desa',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Kecamatan',
            dataIndex: 'kecamatan_code',
            key: 'kecamatan_code',
            render: (code, record) => record.kecamatan?.name ?? code,
        },
    ];

    return (
        <AdminLayout title="Kel/Desa">
            <Head title="Kel/Desa" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: 'Master' },
                    { title: 'Kel/Desa' },
                ]}
            />

            <Card
                className="shadow-sm border border-gray-100 rounded-xl"
                title={
                    <div className="flex items-center justify-between flex-wrap gap-3 py-1">
                        <Title level={5} className="!mb-0 !text-gray-800">Daftar Kel/Desa</Title>
                        <Space wrap>
                            <Input
                                placeholder="Filter kode kecamatan"
                                defaultValue={filters.kecamatan_code}
                                onPressEnter={(e) => handleFilter({ kecamatan_code: e.target.value })}
                                onBlur={(e) => handleFilter({ kecamatan_code: e.target.value })}
                                style={{ width: 180 }}
                                allowClear
                                onClear={() => handleFilter({ kecamatan_code: '' })}
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
                    dataSource={kelDess.data}
                    columns={columns}
                    rowKey="id"
                    pagination={{
                        current: kelDess.current_page,
                        total: kelDess.total,
                        pageSize: kelDess.per_page,
                        showSizeChanger: false,
                        showTotal: (total) => `Total ${total} kel/desa`,
                        onChange: (page) => router.get(route('admin.kel-des.index'), { ...filters, page }, { preserveState: true }),
                    }}
                    rowClassName="hover:!bg-gray-50"
                />
            </Card>
        </AdminLayout>
    );
}
