import { useForm } from '@inertiajs/react';
import { Alert, Button, Card, Divider, Form, Input, InputNumber, Select, Space, Typography } from 'antd';
import { useMemo } from 'react';
import { formatRupiah } from './utils';

const { Title, Text } = Typography;

const PAGU_EXCEEDED_MSG = 'Nilai melebihi pagu AWP.';

function exceedsPagu(value, pagu) {
    if (pagu == null) return false;
    return Number(value || 0) > Number(pagu);
}

export default function TransaksiTab({ awpList }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        keuangan_awp_id: null,
        no_spm: '',
        tgl_spm: '',
        nilai_spm: null,
        no_sp2d: '',
        tgl_sp2d: '',
        nilai_sp2d: null,
        mekanisme_pembayaran: 'Advance Account',
        keterangan: '',
    });

    const availableAwpList = useMemo(
        () => awpList.filter((item) => Number(item.sisa_pagu ?? item.pagu) > 0),
        [awpList],
    );

    const selectedAwp = useMemo(
        () => awpList.find((item) => item.id === data.keuangan_awp_id),
        [awpList, data.keuangan_awp_id],
    );

    const awpOptions = availableAwpList.map((item) => ({
        value: item.id,
        label: `${item.kode_owp ?? '-'} — ${item.uraian_kegiatan ?? item.nama_awp} (Sisa ${formatRupiah(item.sisa_pagu ?? item.pagu)})`,
    }));

    const pagu = selectedAwp?.pagu ?? null;
    const sisaPagu = selectedAwp?.sisa_pagu ?? null;

    const paguErrors = useMemo(() => ({
        nilai_spm: exceedsPagu(data.nilai_spm, pagu) ? PAGU_EXCEEDED_MSG : null,
        nilai_sp2d: exceedsPagu(data.nilai_sp2d, pagu) ? PAGU_EXCEEDED_MSG : null,
    }), [data.nilai_spm, data.nilai_sp2d, pagu]);

    const hasPaguError = Object.values(paguErrors).some(Boolean);

    const handleSubmit = () => {
        if (hasPaguError) return;

        post(route('admin.keuangan.transaksi.store'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <div>
            <div className="mb-5">
                <Title level={4} className="!mb-1 !text-emerald-900">Input Transaksi HDDAP</Title>
                <Text type="secondary">Satu form untuk SPM dan SP2D.</Text>
            </div>

            <Alert
                type="success"
                showIcon
                className="mb-4"
                message="Pilih AWP terlebih dahulu. AWP yang pagunya sudah habis tidak ditampilkan. Nilai SPM dan SP2D tidak boleh melebihi pagu."
            />

            <Card className="rounded-xl shadow-sm">
                <Form layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        label="Pilih Komponen/Subkomponen/Kegiatan"
                        validateStatus={errors.keuangan_awp_id ? 'error' : ''}
                        help={errors.keuangan_awp_id ?? (availableAwpList.length === 0 ? 'Semua AWP sudah habis pagunya.' : undefined)}
                    >
                        <Select
                            allowClear
                            placeholder="-- Pilih AWP --"
                            options={awpOptions}
                            value={data.keuangan_awp_id}
                            onChange={(val) => setData('keuangan_awp_id', val ?? null)}
                            disabled={availableAwpList.length === 0}
                        />
                    </Form.Item>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Form.Item label="Component">
                            <Input readOnly value={selectedAwp?.component ?? ''} />
                        </Form.Item>
                        <Form.Item label="Sub Component">
                            <Input readOnly value={selectedAwp?.sub_component ?? ''} />
                        </Form.Item>
                        <Form.Item label="Kode OWP">
                            <Input readOnly value={selectedAwp?.kode_owp ?? ''} />
                        </Form.Item>
                        <Form.Item label="Uraian Kegiatan">
                            <Input readOnly value={selectedAwp?.uraian_kegiatan ?? ''} />
                        </Form.Item>
                        <Form.Item label="Kode Kegiatan POK">
                            <Input readOnly value={selectedAwp?.kode_pok ?? ''} />
                        </Form.Item>
                        <Form.Item label="Nama Kegiatan POK">
                            <Input readOnly value={selectedAwp?.nama_kegiatan_pok ?? ''} />
                        </Form.Item>
                        <Form.Item label="Sumber Dana">
                            <Input readOnly value={selectedAwp?.sumber_dana ?? ''} />
                        </Form.Item>
                        <Form.Item label="Pagu AWP">
                            <Input readOnly value={selectedAwp ? formatRupiah(selectedAwp.pagu) : ''} />
                        </Form.Item>
                        <Form.Item label="Sisa Pagu">
                            <Input readOnly value={selectedAwp ? formatRupiah(selectedAwp.sisa_pagu ?? selectedAwp.pagu) : ''} />
                        </Form.Item>
                    </div>

                    <Divider />
                    <Title level={5}>Data SPM</Title>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Form.Item label="No. SPM" validateStatus={errors.no_spm ? 'error' : ''} help={errors.no_spm}>
                            <Input value={data.no_spm} onChange={(e) => setData('no_spm', e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Tanggal SPM" validateStatus={errors.tgl_spm ? 'error' : ''} help={errors.tgl_spm}>
                            <Input type="date" value={data.tgl_spm} onChange={(e) => setData('tgl_spm', e.target.value)} />
                        </Form.Item>
                        <Form.Item
                            label="Nilai SPM"
                            validateStatus={errors.nilai_spm || paguErrors.nilai_spm ? 'error' : ''}
                            help={errors.nilai_spm || paguErrors.nilai_spm}
                        >
                            <InputNumber className="!w-full" min={0} value={data.nilai_spm} onChange={(v) => setData('nilai_spm', v)} />
                        </Form.Item>
                    </div>

                    <Divider />
                    <Title level={5}>Data SP2D</Title>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Form.Item label="No. SP2D">
                            <Input value={data.no_sp2d} onChange={(e) => setData('no_sp2d', e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Tanggal SP2D">
                            <Input type="date" value={data.tgl_sp2d} onChange={(e) => setData('tgl_sp2d', e.target.value)} />
                        </Form.Item>
                        <Form.Item
                            label="Nilai SP2D"
                            validateStatus={errors.nilai_sp2d || paguErrors.nilai_sp2d ? 'error' : ''}
                            help={errors.nilai_sp2d || paguErrors.nilai_sp2d}
                        >
                            <InputNumber className="!w-full" min={0} value={data.nilai_sp2d} onChange={(v) => setData('nilai_sp2d', v)} />
                        </Form.Item>
                    </div>

                    <Form.Item label="Keterangan" className="mt-2">
                        <Input.TextArea rows={3} value={data.keterangan} onChange={(e) => setData('keterangan', e.target.value)} />
                    </Form.Item>

                    <Space className="mt-2">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={processing}
                            disabled={hasPaguError || availableAwpList.length === 0}
                            className="!bg-emerald-600"
                        >
                            Simpan Transaksi
                        </Button>
                        <Button onClick={() => reset()}>Reset</Button>
                    </Space>
                </Form>
            </Card>
        </div>
    );
}
