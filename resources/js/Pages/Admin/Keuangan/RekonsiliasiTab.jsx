import { useForm } from '@inertiajs/react';
import { Alert, Button, Card, Form, Input, InputNumber, Select, Table, Tag, Typography } from 'antd';
import { useMemo } from 'react';
import { formatRupiah } from './utils';

const { Title, Text } = Typography;

export default function RekonsiliasiTab({ transaksiList, rekonList }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        keuangan_transaksi_id: null,
        nilai_sakti: null,
        nilai_omspan: null,
        nilai_bank: null,
    });

    const selectedTrx = useMemo(
        () => transaksiList.find((item) => item.id === data.keuangan_transaksi_id),
        [transaksiList, data.keuangan_transaksi_id],
    );

    const trxOptions = transaksiList.map((item) => ({
        value: item.id,
        label: `${item.kode_transaksi} | ${item.no_sp2d || 'Belum SP2D'} | ${formatRupiah(item.nilai_sp2d)}`,
    }));

    const handleSubmit = () => {
        post(route('admin.keuangan.rekonsiliasi.store'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const columns = [
        { title: 'Transaksi', dataIndex: 'kode_transaksi', key: 'kode_transaksi' },
        { title: 'SP2D', dataIndex: 'no_sp2d', key: 'no_sp2d', render: (v) => v || '-' },
        { title: 'HDDAP', dataIndex: 'nilai_hddap', key: 'nilai_hddap', render: formatRupiah },
        { title: 'SAKTI', dataIndex: 'nilai_sakti', key: 'nilai_sakti', render: formatRupiah },
        { title: 'OM-SPAN', dataIndex: 'nilai_omspan', key: 'nilai_omspan', render: formatRupiah },
        { title: 'Bank', dataIndex: 'nilai_bank', key: 'nilai_bank', render: formatRupiah },
        { title: 'Selisih', dataIndex: 'selisih', key: 'selisih', render: formatRupiah },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status, row) => (
                <Tag color={row.selisih === 0 ? 'green' : 'red'}>{status}</Tag>
            ),
        },
    ];

    return (
        <div>
            <div className="mb-5">
                <Title level={4} className="!mb-1 !text-emerald-900">Rekonsiliasi</Title>
                <Text type="secondary">Bandingkan transaksi HDDAP dengan SAKTI, OM-SPAN dan Bank.</Text>
            </div>

            <Card title="Form Rekonsiliasi" className="mb-5 rounded-xl shadow-sm">
                <Form layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        label="Pilih Transaksi"
                        validateStatus={errors.keuangan_transaksi_id ? 'error' : ''}
                        help={errors.keuangan_transaksi_id}
                    >
                        <Select
                            allowClear
                            placeholder="-- Pilih Transaksi --"
                            options={trxOptions}
                            value={data.keuangan_transaksi_id}
                            onChange={(val) => setData('keuangan_transaksi_id', val ?? null)}
                        />
                    </Form.Item>

                    {selectedTrx && (
                        <Alert
                            type="info"
                            showIcon
                            className="mb-4"
                            message={
                                <div>
                                    <strong>{selectedTrx.kode_transaksi}</strong><br />
                                    AWP: {selectedTrx.nama_awp}<br />
                                    POK: {selectedTrx.kode_pok}<br />
                                    SP2D: {selectedTrx.no_sp2d || '-'}<br />
                                    Nilai SP2D: <strong>{formatRupiah(selectedTrx.nilai_sp2d)}</strong>
                                </div>
                            }
                        />
                    )}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Form.Item label="Nilai HDDAP (SP2D)">
                            <Input
                                readOnly
                                value={selectedTrx ? formatRupiah(selectedTrx.nilai_sp2d) : ''}
                            />
                        </Form.Item>
                        <Form.Item label="Nilai SAKTI" validateStatus={errors.nilai_sakti ? 'error' : ''} help={errors.nilai_sakti}>
                            <InputNumber className="!w-full" min={0} value={data.nilai_sakti} onChange={(v) => setData('nilai_sakti', v)} />
                        </Form.Item>
                        <Form.Item label="Nilai OM-SPAN" validateStatus={errors.nilai_omspan ? 'error' : ''} help={errors.nilai_omspan}>
                            <InputNumber className="!w-full" min={0} value={data.nilai_omspan} onChange={(v) => setData('nilai_omspan', v)} />
                        </Form.Item>
                        <Form.Item label="Nilai Bank" validateStatus={errors.nilai_bank ? 'error' : ''} help={errors.nilai_bank}>
                            <InputNumber className="!w-full" min={0} value={data.nilai_bank} onChange={(v) => setData('nilai_bank', v)} />
                        </Form.Item>
                    </div>

                    <Button type="primary" htmlType="submit" loading={processing} className="!bg-emerald-600">
                        Simpan Rekonsiliasi
                    </Button>
                </Form>
            </Card>

            <Card title="Hasil Rekonsiliasi" className="rounded-xl shadow-sm">
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={rekonList}
                    scroll={{ x: 900 }}
                    locale={{ emptyText: 'Belum ada data rekonsiliasi.' }}
                    pagination={{ pageSize: 10 }}
                />
            </Card>
        </div>
    );
}
