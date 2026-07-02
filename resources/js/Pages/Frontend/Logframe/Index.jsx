import PublicLayout from '@/Layouts/PublicLayout';
import LogframeComponentFilter from '@/Components/LogframeComponentFilter';
import { Head, router } from '@inertiajs/react';
import { Card, Input, Pagination, Table, Tag, Tooltip, Typography } from 'antd';
import { SearchOutlined, TableOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title, Text } = Typography;

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

function textCell(value, width = 220) {
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

export default function LogframeIndex({ logframes, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (value) => {
        router.get(
            route('logframe'),
            { search: value || undefined, component: filters.component, page: 1 },
            { preserveState: true, replace: true },
        );
    };

    const columns = [
        {
            title: 'No',
            key: 'no',
            width: 60,
            fixed: 'left',
            align: 'center',
            render: (_, __, index) => (logframes.current_page - 1) * logframes.per_page + index + 1,
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
            width: 260,
            render: (value) => textCell(value, 260),
        },
        {
            title: 'Definisi Indikator',
            dataIndex: 'definisi_indikator',
            key: 'definisi_indikator',
            width: 420,
            render: (value) => textCell(value, 420),
        },
        {
            title: 'Data yang Dikumpulkan',
            dataIndex: 'data_yg_dikumpulkan',
            key: 'data_yg_dikumpulkan',
            width: 380,
            render: (value) => textCell(value, 380),
        },
        {
            title: 'Sumber Data',
            dataIndex: 'sumber_data',
            key: 'sumber_data',
            width: 180,
            render: (value) => textCell(value, 180),
        },
        {
            title: 'Nilai Dasar',
            dataIndex: 'nilai_dasar',
            key: 'nilai_dasar',
            width: 140,
            render: (value) => textCell(value, 140),
        },
        {
            title: 'Target Pertengahan Proyek',
            dataIndex: 'target_pertengahan_proyek',
            key: 'target_pertengahan_proyek',
            width: 220,
            render: (value) => textCell(value, 220),
        },
        {
            title: 'Target Akhir Proyek',
            dataIndex: 'target_akhir_proyek',
            key: 'target_akhir_proyek',
            width: 220,
            render: (value) => textCell(value, 220),
        },
        {
            title: 'Realisasi',
            dataIndex: 'realisasi',
            key: 'realisasi',
            width: 140,
            render: (value) => textCell(value, 140),
        },
    ];

    return (
        <PublicLayout>
            <Head title="Logframe" />

            <div className="px-4 py-6 sm:px-6 lg:px-16">
                <div className="mb-4">
                    <Title level={3} className="!mb-1 !text-gray-900">
                        Logframe HDDAP
                    </Title>
                    <Text type="secondary">
                        Logical Framework Matrix — Kementerian Pertanian RI
                    </Text>
                </div>

                <Card
                    className="rounded-xl border border-gray-100 shadow-sm"
                    title={
                        <div className="flex flex-wrap items-center justify-between gap-3 py-1">
                            <div className="flex items-center gap-2">
                                <TableOutlined className="text-emerald-600" />
                                <Title level={5} className="!mb-0 !text-gray-800">
                                    Daftar Indikator Logframe
                                </Title>
                            </div>
                            <Input
                                placeholder="Cari tingkat, indikator, target..."
                                prefix={<SearchOutlined className="text-gray-400" />}
                                defaultValue={filters.search}
                                onPressEnter={(e) => handleSearch(e.target.value)}
                                onChange={(e) => setSearch(e.target.value)}
                                onBlur={() => handleSearch(search)}
                                style={{ width: 280 }}
                                allowClear
                                onClear={() => {
                                    setSearch('');
                                    handleSearch('');
                                }}
                            />
                        </div>
                    }
                >
                    <LogframeComponentFilter filters={filters} routeName="logframe" />
                    <Table
                        dataSource={logframes.data}
                        columns={columns}
                        rowKey="id"
                        pagination={false}
                        scroll={{ x: 1960 }}
                        size="middle"
                        bordered
                        rowClassName="align-top"
                    />
                    <div className="mt-4 flex justify-end">
                        <Pagination
                            current={logframes.current_page}
                            pageSize={logframes.per_page}
                            total={logframes.total}
                            showSizeChanger={false}
                            showTotal={(total) => `Total ${total} indikator`}
                            onChange={(page) =>
                                router.get(
                                    route('logframe'),
                                    { ...filters, page },
                                    { preserveState: true },
                                )
                            }
                        />
                    </div>
                </Card>
            </div>
        </PublicLayout>
    );
}
