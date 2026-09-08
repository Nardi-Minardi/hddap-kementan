import { router } from '@inertiajs/react';
import { Button, Card, Popconfirm, Table, Tag, Typography } from 'antd';
import { formatRupiah, rekonBadge } from './utils';

const { Title, Text } = Typography;

export default function RegisterTab({ transaksiList }) {
    const handleDelete = (id) => {
        router.delete(route('admin.keuangan.transaksi.destroy', id), { preserveScroll: true });
    };

    const columns = [
        { title: 'ID', dataIndex: 'kode_transaksi', key: 'kode_transaksi', width: 110 },
        { title: 'AWP', dataIndex: 'nama_awp', key: 'nama_awp' },
        { title: 'POK', dataIndex: 'kode_pok', key: 'kode_pok', width: 100 },
        { title: 'SPM', dataIndex: 'no_spm', key: 'no_spm' },
        { title: 'SP2D', dataIndex: 'no_sp2d', key: 'no_sp2d', render: (v) => v || '-' },
        { title: 'Nilai SP2D', dataIndex: 'nilai_sp2d', key: 'nilai_sp2d', render: formatRupiah },
        { title: 'Mekanisme', dataIndex: 'mekanisme_pembayaran', key: 'mekanisme_pembayaran', width: 140 },
        {
            title: 'Status',
            key: 'status',
            width: 120,
            render: (_, row) => {
                const badge = rekonBadge(row.rekon_status, row.rekon_selisih);
                return <Tag color={badge.color}>{badge.label}</Tag>;
            },
        },
        {
            title: 'Aksi',
            key: 'aksi',
            width: 90,
            render: (_, record) => (
                <Popconfirm title="Hapus transaksi ini?" onConfirm={() => handleDelete(record.id)}>
                    <Button danger size="small">Hapus</Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <div>
            <div className="mb-5">
                <Title level={4} className="!mb-1 !text-emerald-900">Register Transaksi</Title>
                <Text type="secondary">Seluruh transaksi keuangan HDDAP.</Text>
            </div>

            <Card className="rounded-xl shadow-sm">
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={transaksiList}
                    scroll={{ x: 1100 }}
                    locale={{ emptyText: 'Belum ada transaksi.' }}
                    pagination={{ pageSize: 10 }}
                />
            </Card>
        </div>
    );
}
