import AdminLayout from '@/Layouts/AdminLayout';
import LogframeComponentFilter from '@/Components/LogframeComponentFilter';
import { Head, Link, router } from '@inertiajs/react';
import {
    Breadcrumb,
    Button,
    Card,
    Input,
    Popconfirm,
    Space,
    Table,
    Tag,
    Tooltip,
    Typography,
    message,
} from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    HomeOutlined,
    PlusOutlined,
    SearchOutlined,
    TableOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

const { Title } = Typography;

function tingkatCell(value) {
    if (!value) {
        return <span className="text-gray-400">-</span>;
    }

    return (
        <Tag
            color="blue"
            className="!h-auto !max-w-full !whitespace-normal !break-words !py-1 !leading-snug !text-left"
        >
            {value}
        </Tag>
    );
}

function textCell(value, width = 180) {
    if (!value) {
        return <span className="text-gray-400">-</span>;
    }

    return (
        <Tooltip title={value} placement="topLeft">
            <span className="block whitespace-pre-wrap" style={{ maxWidth: width }}>
                {value}
            </span>
        </Tooltip>
    );
}

export default function LogframeIndex({ logframes, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        if (flash?.success) message.success(flash.success);
        if (flash?.error) message.error(flash.error);
    }, [flash]);

    const handleSearch = (value) => {
        router.get(
            route('admin.logframe.index'),
            { search: value || undefined, component: filters.component, page: 1 },
            { preserveState: true, replace: true },
        );
    };

    const handleDelete = (id) => {
        router.delete(route('admin.logframe.destroy', id), {
            preserveScroll: true,
            onSuccess: () => message.success('Data logframe berhasil dihapus.'),
        });
    };

    const columns = [
        {
            title: 'No',
            key: 'no',
            width: 60,
            fixed: 'left',
            align: 'center',
            render: (_, __, index) =>
                (logframes.current_page - 1) * logframes.per_page + index + 1,
        },
        {
            title: 'Aksi',
            key: 'action',
            width: 90,
            fixed: 'left',
            align: 'center',
            render: (_, record) => (
                <Space size={4}>
                    <Tooltip title="Edit">
                        <Button
                            size="small"
                            type="primary"
                            ghost
                            icon={<EditOutlined />}
                            onClick={() => router.visit(route('admin.logframe.edit', record.id))}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Hapus logframe ini?"
                        description="Data yang dihapus tidak dapat dikembalikan."
                        okText="Hapus"
                        okType="danger"
                        cancelText="Batal"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Tooltip title="Hapus">
                            <Button size="small" danger icon={<DeleteOutlined />} />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
        {
            title: 'Tingkat',
            dataIndex: 'tingkat',
            key: 'tingkat',
            width: 180,
            render: (value) => tingkatCell(value),
        },
        {
            title: 'Component',
            dataIndex: 'component',
            key: 'component',
            width: 140,
            render: (value) => textCell(value, 140),
        },
        {
            title: 'Nama Indikator',
            dataIndex: 'nama_indikator',
            key: 'nama_indikator',
            width: 220,
            render: (value) => textCell(value, 220),
        },
        {
            title: 'Definisi Indikator',
            dataIndex: 'definisi_indikator',
            key: 'definisi_indikator',
            width: 400,
            render: (value) => textCell(value, 400),
        },
        {
            title: 'Data yang Dikumpulkan',
            dataIndex: 'data_yg_dikumpulkan',
            key: 'data_yg_dikumpulkan',
            width: 360,
            render: (value) => textCell(value, 360),
        },
        {
            title: 'Sumber Data',
            dataIndex: 'sumber_data',
            key: 'sumber_data',
            width: 160,
            render: (value) => textCell(value, 160),
        },
        {
            title: 'Nilai Dasar',
            dataIndex: 'nilai_dasar',
            key: 'nilai_dasar',
            width: 120,
            render: (value) => textCell(value, 120),
        },
        {
            title: 'Target Pertengahan',
            dataIndex: 'target_pertengahan_proyek',
            key: 'target_pertengahan_proyek',
            width: 140,
            render: (value) => textCell(value, 140),
        },
        {
            title: 'Target Akhir',
            dataIndex: 'target_akhir_proyek',
            key: 'target_akhir_proyek',
            width: 120,
            render: (value) => textCell(value, 120),
        },
        {
            title: 'Realisasi',
            dataIndex: 'realisasi',
            key: 'realisasi',
            width: 120,
            render: (value) => textCell(value, 120),
        },
    ];

    return (
        <AdminLayout title="Logframe">
            <Head title="Logframe" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: <><TableOutlined /> Logframe</> },
                ]}
            />

            <Card
                className="rounded-xl border border-gray-100 shadow-sm"
                title={
                    <div className="flex flex-wrap items-center justify-between gap-3 py-1">
                        <Title level={5} className="!mb-0 !text-gray-800">
                            Daftar Logframe
                        </Title>
                        <div className="flex flex-wrap items-center gap-2">
                            <Input
                                placeholder="Cari logframe..."
                                prefix={<SearchOutlined className="text-gray-400" />}
                                defaultValue={filters.search}
                                onPressEnter={(e) => handleSearch(e.target.value)}
                                onChange={(e) => setSearch(e.target.value)}
                                onBlur={() => handleSearch(search)}
                                style={{ width: 260 }}
                                allowClear
                                onClear={() => handleSearch('')}
                            />
                            <Link href={route('admin.logframe.create')}>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    className="!border-emerald-500 !bg-emerald-500 hover:!bg-emerald-600"
                                >
                                    Tambah Logframe
                                </Button>
                            </Link>
                        </div>
                    </div>
                }
            >
                <LogframeComponentFilter filters={filters} routeName="admin.logframe.index" />
                <Table
                    dataSource={logframes.data}
                    columns={columns}
                    rowKey="id"
                    scroll={{ x: 2260 }}
                    pagination={{
                        current: logframes.current_page,
                        total: logframes.total,
                        pageSize: logframes.per_page,
                        showSizeChanger: false,
                        showTotal: (total) => `Total ${total} data`,
                        onChange: (page) => router.get(
                            route('admin.logframe.index'),
                            { ...filters, page },
                            { preserveState: true },
                        ),
                    }}
                    rowClassName="align-top hover:!bg-gray-50"
                />
            </Card>
        </AdminLayout>
    );
}
