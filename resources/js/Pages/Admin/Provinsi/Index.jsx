import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { Table, Card, Input, Typography, Breadcrumb, Tag } from 'antd';
import { HomeOutlined, GlobalOutlined, SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title } = Typography;

export default function ProvinsiIndex({ provinsis, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (value) => {
        router.get(route('admin.provinsi.index'), { search: value }, { preserveState: true, replace: true });
    };

    const columns = [
        {
            title: 'No',
            key: 'no',
            width: 60,
            render: (_, __, index) => (provinsis.current_page - 1) * provinsis.per_page + index + 1,
        },
        {
            title: 'Kode',
            dataIndex: 'code',
            key: 'code',
            width: 120,
            render: (code) => <Tag color="blue">{code}</Tag>,
        },
        {
            title: 'Nama Provinsi',
            dataIndex: 'name',
            key: 'name',
        },
    ];

    return (
        <AdminLayout title="Provinsi">
            <Head title="Provinsi" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: 'Master' },
                    { title: <><GlobalOutlined /> Provinsi</> },
                ]}
            />

            <Card
                className="shadow-sm border border-gray-100 rounded-xl"
                title={
                    <div className="flex items-center justify-between flex-wrap gap-3 py-1">
                        <Title level={5} className="!mb-0 !text-gray-800">Daftar Provinsi</Title>
                        <Input
                            placeholder="Cari kode / nama..."
                            prefix={<SearchOutlined className="text-gray-400" />}
                            defaultValue={filters.search}
                            onPressEnter={(e) => handleSearch(e.target.value)}
                            onChange={(e) => setSearch(e.target.value)}
                            onBlur={() => handleSearch(search)}
                            style={{ width: 260 }}
                            allowClear
                            onClear={() => handleSearch('')}
                        />
                    </div>
                }
            >
                <Table
                    dataSource={provinsis.data}
                    columns={columns}
                    rowKey="id"
                    pagination={{
                        current: provinsis.current_page,
                        total: provinsis.total,
                        pageSize: provinsis.per_page,
                        showSizeChanger: false,
                        showTotal: (total) => `Total ${total} provinsi`,
                        onChange: (page) => router.get(route('admin.provinsi.index'), { ...filters, page }, { preserveState: true }),
                    }}
                    rowClassName="hover:!bg-gray-50"
                />
            </Card>
        </AdminLayout>
    );
}
