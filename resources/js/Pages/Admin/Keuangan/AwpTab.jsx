import { router, useForm } from '@inertiajs/react';
import { Alert, Button, Card, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Table, Tooltip, Typography, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useMemo, useState } from 'react';
import { formatRupiah } from './utils';

const { Title, Text } = Typography;

const emptyForm = {
    nama_awp: '',
    component: null,
    sub_component: null,
    kode_pok: null,
    kode_owp: null,
    uraian_kegiatan: '',
    pagu: null,
    sumber_dana: 'ADB',
};

function useStrukturHelpers(keuanganStruktur) {
    const tree = keuanganStruktur ?? {};

    const componentOptions = useMemo(
        () => Object.values(tree).map((item) => ({ value: item.value, label: item.label })),
        [tree],
    );

    const subComponentOptions = (component) => {
        const node = tree[component];
        if (!node) return [];
        return (node.sub_components ?? []).map((item) => ({ value: item.value, label: item.label }));
    };

    const pokOptions = (component, subComponent) => {
        const node = tree[component];
        const sub = node?.sub_components?.find((item) => item.value === subComponent);
        if (!sub) return [];
        return (sub.pok ?? []).map((item) => ({ value: item.value, label: item.label }));
    };

    const owpOptions = (component, subComponent, kodePok) => {
        const node = tree[component];
        const sub = node?.sub_components?.find((item) => item.value === subComponent);
        const pok = sub?.pok?.find((item) => item.value === kodePok);
        if (!pok) return [];
        return (pok.owp ?? []).map((item) => ({ value: item.value, label: item.label }));
    };

    return {
        componentOptions,
        subComponentOptions,
        pokOptions,
        owpOptions,
    };
}

export default function AwpTab({ awpList, keuanganStruktur }) {
    const [editOpen, setEditOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);

    const createForm = useForm({ ...emptyForm });
    const editForm = useForm({ ...emptyForm });

    const createHelpers = useStrukturHelpers(keuanganStruktur);
    const editHelpers = useStrukturHelpers(keuanganStruktur);

    const applyHierarchyChange = (form, field, value) => {
        const next = { ...form.data, [field]: value ?? null };

        if (field === 'component') {
            next.sub_component = null;
            next.kode_pok = null;
            next.kode_owp = null;
            next.uraian_kegiatan = '';
        } else if (field === 'sub_component') {
            next.kode_pok = null;
            next.kode_owp = null;
            next.uraian_kegiatan = '';
        } else if (field === 'kode_pok') {
            next.kode_owp = null;
            next.uraian_kegiatan = '';
        } else if (field === 'kode_owp') {
            next.uraian_kegiatan = '';
        }

        form.setData(next);
    };

    const handleCreate = () => {
        createForm.post(route('admin.keuangan.awp.store'), {
            preserveScroll: true,
            onSuccess: () => createForm.reset(),
        });
    };

    const handleEditClick = (record) => {
        if (record.transaksi_count > 0) {
            message.warning('AWP tidak dapat diedit karena sudah ada transaksi.');
            return;
        }

        setEditingRecord(record);
        editForm.setData({
            nama_awp: record.nama_awp,
            component: record.component ?? null,
            sub_component: record.sub_component ?? null,
            kode_pok: record.kode_pok ?? null,
            kode_owp: record.kode_owp ?? null,
            uraian_kegiatan: record.uraian_kegiatan ?? '',
            pagu: record.pagu,
            sumber_dana: record.sumber_dana,
        });
        setEditOpen(true);
    };

    const handleUpdate = () => {
        if (!editingRecord) return;

        editForm.put(route('admin.keuangan.awp.update', editingRecord.id), {
            preserveScroll: true,
            onSuccess: () => {
                setEditOpen(false);
                setEditingRecord(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = (record) => {
        if (record.transaksi_count > 0) {
            message.error('AWP tidak dapat dihapus karena sudah ada transaksi.');
            return;
        }

        router.delete(route('admin.keuangan.awp.destroy', record.id), { preserveScroll: true });
    };

    const renderFormFields = (form, errors, helpers) => {
        const subOptions = helpers.subComponentOptions(form.data.component);
        const pokOpts = helpers.pokOptions(form.data.component, form.data.sub_component);
        const owpOpts = helpers.owpOptions(form.data.component, form.data.sub_component, form.data.kode_pok);

        return (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Form.Item label="Nama AWP / Tahun" validateStatus={errors.nama_awp ? 'error' : ''} help={errors.nama_awp}>
                    <Input
                        value={form.data.nama_awp}
                        onChange={(e) => form.setData('nama_awp', e.target.value)}
                        placeholder="Contoh: AWP 2026"
                    />
                </Form.Item>
                <Form.Item label="Component" validateStatus={errors.component ? 'error' : ''} help={errors.component}>
                    <Select
                        allowClear
                        showSearch
                        placeholder="Pilih component"
                        optionFilterProp="label"
                        value={form.data.component ?? undefined}
                        onChange={(val) => applyHierarchyChange(form, 'component', val)}
                        options={helpers.componentOptions}
                    />
                </Form.Item>
                <Form.Item label="Sub Component" validateStatus={errors.sub_component ? 'error' : ''} help={errors.sub_component}>
                    <Select
                        allowClear
                        showSearch
                        disabled={!form.data.component}
                        placeholder="Pilih sub component"
                        optionFilterProp="label"
                        value={form.data.sub_component ?? undefined}
                        onChange={(val) => applyHierarchyChange(form, 'sub_component', val)}
                        options={subOptions}
                    />
                </Form.Item>
                <Form.Item label="Kode Kegiatan POK" validateStatus={errors.kode_pok ? 'error' : ''} help={errors.kode_pok}>
                    <Select
                        allowClear
                        showSearch
                        disabled={!form.data.sub_component}
                        placeholder="Pilih POK"
                        optionFilterProp="label"
                        value={form.data.kode_pok ?? undefined}
                        onChange={(val) => applyHierarchyChange(form, 'kode_pok', val)}
                        options={pokOpts}
                    />
                </Form.Item>
                <Form.Item label="Kode OWP" validateStatus={errors.kode_owp ? 'error' : ''} help={errors.kode_owp}>
                    <Select
                        allowClear
                        showSearch
                        disabled={!form.data.kode_pok}
                        placeholder="Pilih kegiatan OWP"
                        optionFilterProp="label"
                        value={form.data.kode_owp ?? undefined}
                        onChange={(val) => applyHierarchyChange(form, 'kode_owp', val)}
                        options={owpOpts}
                    />
                </Form.Item>
                <Form.Item label="Uraian Kegiatan" validateStatus={errors.uraian_kegiatan ? 'error' : ''} help={errors.uraian_kegiatan}>
                    <Input
                        value={form.data.uraian_kegiatan}
                        onChange={(e) => form.setData('uraian_kegiatan', e.target.value)}
                        placeholder="Isi uraian kegiatan secara manual"
                    />
                </Form.Item>
                <Form.Item label="Pagu" validateStatus={errors.pagu ? 'error' : ''} help={errors.pagu}>
                    <InputNumber
                        className="!w-full"
                        value={form.data.pagu}
                        onChange={(val) => form.setData('pagu', val)}
                        placeholder="5000000000"
                        min={0}
                    />
                </Form.Item>
                <Form.Item label="Sumber Dana" validateStatus={errors.sumber_dana ? 'error' : ''} help={errors.sumber_dana}>
                    <Select
                        value={form.data.sumber_dana}
                        onChange={(val) => form.setData('sumber_dana', val)}
                        options={[
                            { value: 'ADB', label: 'ADB (68%)' },
                            { value: 'IFAD', label: 'IFAD (32%)' },
                        ]}
                    />
                </Form.Item>
            </div>
        );
    };

    const renderNama = (nama, kode) => (
        <Tooltip title={kode ? `Kode: ${kode}` : undefined}>
            <span>{nama || kode || '-'}</span>
        </Tooltip>
    );

    const columns = [
        { title: 'ID', dataIndex: 'kode_awp', key: 'kode_awp', width: 110 },
        { title: 'AWP', dataIndex: 'nama_awp', key: 'nama_awp', width: 120 },
        {
            title: 'Component',
            dataIndex: 'nama_component',
            key: 'nama_component',
            width: 220,
            ellipsis: true,
            render: (val, record) => renderNama(val, record.component),
        },
        {
            title: 'Sub',
            dataIndex: 'nama_sub_komponen',
            key: 'nama_sub_komponen',
            width: 220,
            ellipsis: true,
            render: (val, record) => renderNama(val, record.sub_component),
        },
        {
            title: 'POK',
            dataIndex: 'nama_kegiatan_pok',
            key: 'nama_kegiatan_pok',
            width: 220,
            ellipsis: true,
            render: (val, record) => renderNama(val, record.kode_pok),
        },
        {
            title: 'OWP',
            dataIndex: 'nama_komponen_detail',
            key: 'nama_komponen_detail',
            width: 240,
            ellipsis: true,
            render: (val, record) => renderNama(val, record.kode_owp),
        },
        {
            title: 'Kegiatan',
            dataIndex: 'uraian_kegiatan',
            key: 'uraian_kegiatan',
            ellipsis: true,
        },
        { title: 'Sumber', dataIndex: 'sumber_dana', key: 'sumber_dana', width: 70 },
        {
            title: 'Pagu',
            dataIndex: 'pagu',
            key: 'pagu',
            width: 140,
            render: (val) => formatRupiah(val),
        },
        {
            title: 'Aksi',
            key: 'aksi',
            width: 140,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title={record.transaksi_count > 0 ? 'Sudah ada transaksi, tidak bisa diedit' : 'Edit AWP'}>
                        <Button size="small" icon={<EditOutlined />} onClick={() => handleEditClick(record)}>
                            Edit
                        </Button>
                    </Tooltip>
                    <Popconfirm
                        title="Hapus data AWP ini?"
                        disabled={record.transaksi_count > 0}
                        onConfirm={() => handleDelete(record)}
                    >
                        <Button danger size="small" disabled={record.transaksi_count > 0}>
                            Hapus
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div className="mb-5">
                <Title level={4} className="!mb-1 !text-emerald-900">Input AWP & Pagu</Title>
                <Text type="secondary">
                    Component → Sub Component → POK → OWP diambil dari master topik HDDAP (selaras pedoman/PAM).
                </Text>
            </div>

            <Alert
                type="info"
                showIcon
                className="mb-4"
                message="Pilih berurutan: Component → Sub Component → POK → Kode OWP. Uraian kegiatan diisi manual."
            />

            <Card title="Form AWP & Pagu" className="mb-5 rounded-xl shadow-sm">
                <Form layout="vertical" onFinish={handleCreate}>
                    {renderFormFields(createForm, createForm.errors, createHelpers)}
                    <Space className="mt-2">
                        <Button type="primary" htmlType="submit" loading={createForm.processing} className="!bg-emerald-600">
                            Simpan AWP
                        </Button>
                        <Button onClick={() => createForm.reset()}>Reset</Button>
                    </Space>
                </Form>
            </Card>

            <Card title="Daftar AWP & Pagu" className="rounded-xl shadow-sm">
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={awpList}
                    scroll={{ x: 1600 }}
                    locale={{ emptyText: 'Belum ada data AWP.' }}
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Modal
                title={`Edit AWP — ${editingRecord?.kode_awp ?? ''}`}
                open={editOpen}
                onCancel={() => {
                    setEditOpen(false);
                    setEditingRecord(null);
                    editForm.reset();
                }}
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => {
                            setEditOpen(false);
                            setEditingRecord(null);
                            editForm.reset();
                        }}
                    >
                        Batal
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={editForm.processing}
                        className="!bg-emerald-600"
                        onClick={handleUpdate}
                    >
                        Simpan Perubahan
                    </Button>,
                ]}
                width={760}
                destroyOnClose
            >
                <Form layout="vertical" className="mt-4">
                    {renderFormFields(editForm, editForm.errors, editHelpers)}
                </Form>
            </Modal>
        </div>
    );
}
