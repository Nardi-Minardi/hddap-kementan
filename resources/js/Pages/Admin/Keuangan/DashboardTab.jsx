import { Card, Col, Progress, Row, Statistic, Table, Tag, Typography } from 'antd';
import { formatRupiah } from './utils';

const { Title, Text } = Typography;

export default function DashboardTab({ summary, awpMonitoring }) {
    const cards = [
        { title: 'Total Pagu', value: summary.total_pagu, color: '#123b36' },
        { title: 'Total Cair (SP2D)', value: summary.total_cair, color: '#0369a1' },
        { title: 'Total Pemanfaatan (SP2D)', value: summary.total_pemanfaatan, color: '#087f5b' },
        { title: 'Total Sisa', value: summary.total_sisa, color: '#b45309' },
    ];

    const columns = [
        {
            title: 'Kegiatan',
            key: 'kegiatan',
            ellipsis: true,
            render: (_, row) => (
                <div>
                    <div className="font-semibold text-gray-800">
                        {row.uraian_kegiatan || row.nama_awp}
                    </div>
                    <div className="text-xs text-gray-500">
                        {row.kode_awp} · OWP {row.kode_owp} · POK {row.kode_pok} · C{row.component}
                    </div>
                </div>
            ),
        },
        {
            title: 'Pagu',
            dataIndex: 'pagu',
            key: 'pagu',
            align: 'right',
            width: 140,
            render: formatRupiah,
        },
        {
            title: 'Cair',
            dataIndex: 'cair',
            key: 'cair',
            align: 'right',
            width: 140,
            render: (val) => <span className="text-sky-700">{formatRupiah(val)}</span>,
        },
        {
            title: 'Pemanfaatan (SP2D)',
            dataIndex: 'pemanfaatan',
            key: 'pemanfaatan',
            align: 'right',
            width: 140,
            render: (val) => <span className="text-emerald-700">{formatRupiah(val)}</span>,
        },
        {
            title: 'Sisa',
            dataIndex: 'sisa',
            key: 'sisa',
            align: 'right',
            width: 140,
            render: (val) => (
                <span className={val < 0 ? 'text-red-600' : 'text-amber-700'}>
                    {formatRupiah(val)}
                </span>
            ),
        },
        {
            title: '% Pakai',
            dataIndex: 'persen',
            key: 'persen',
            width: 120,
            render: (persen) => (
                <div>
                    <Progress
                        percent={persen}
                        size="small"
                        strokeColor={persen >= 80 ? '#f59e0b' : '#087f5b'}
                        format={(p) => `${p}%`}
                    />
                </div>
            ),
        },
        {
            title: 'Status',
            key: 'status',
            width: 100,
            align: 'center',
            render: (_, row) => {
                if (row.pemanfaatan <= 0) {
                    return <Tag color="default">Belum dipakai</Tag>;
                }
                if (row.sisa <= 0) {
                    return <Tag color="orange">Habis</Tag>;
                }
                return <Tag color="green">Berjalan</Tag>;
            },
        },
    ];

    return (
        <div>
            <div className="mb-5">
                <Title level={4} className="!mb-1 !text-emerald-900">Monitoring Keuangan</Title>
                <Text type="secondary">
                    Pantau berapa yang sudah cair, sudah dimanfaatkan, dan sisa anggaran per kegiatan.
                </Text>
            </div>

            <Row gutter={[16, 16]} className="mb-5">
                {cards.map((card) => (
                    <Col xs={24} sm={12} lg={6} key={card.title}>
                        <Card className="rounded-xl border-l-4 shadow-sm" style={{ borderLeftColor: card.color }}>
                            <Statistic
                                title={card.title}
                                value={formatRupiah(card.value)}
                                valueStyle={{ color: card.color, fontWeight: 700, fontSize: '1.1rem' }}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>

            <Card
                title={`Monitoring per Kegiatan (${summary.jumlah_kegiatan} kegiatan)`}
                extra={
                    <Text type="secondary">
                        Pemanfaatan: {summary.persen_pemanfaatan}% dari pagu
                    </Text>
                }
                className="rounded-xl shadow-sm"
            >
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={awpMonitoring}
                    scroll={{ x: 900 }}
                    locale={{ emptyText: 'Belum ada data kegiatan. Input AWP & Pagu terlebih dahulu.' }}
                    pagination={{ pageSize: 10 }}
                    summary={() => awpMonitoring.length > 0 ? (
                        <Table.Summary fixed>
                            <Table.Summary.Row className="bg-gray-50 font-semibold">
                                <Table.Summary.Cell index={0}>TOTAL</Table.Summary.Cell>
                                <Table.Summary.Cell index={1} align="right">
                                    {formatRupiah(summary.total_pagu)}
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={2} align="right">
                                    {formatRupiah(summary.total_cair)}
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={3} align="right">
                                    {formatRupiah(summary.total_pemanfaatan)}
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={4} align="right">
                                    {formatRupiah(summary.total_sisa)}
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={5} />
                                <Table.Summary.Cell index={6} />
                            </Table.Summary.Row>
                        </Table.Summary>
                    ) : null}
                />
            </Card>
        </div>
    );
}
