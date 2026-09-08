import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import PilihPetaniModal from './PilihPetaniModal';
import {
    Button,
    Card,
    Dropdown,
    Form,
    Input,
    InputNumber,
    Modal,
    Popconfirm,
    Select,
    Space,
    Table,
    Typography,
    message,
} from 'antd';
import {
    DeleteOutlined,
    PlusOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const TIPE_MENU = [
    { key: 'petani', label: 'Petani' },
    { key: 'fasilitator', label: 'Fasilitator' },
    { key: 'dit', label: 'DIT' },
    { key: 'dinas', label: 'Dinas' },
    { key: 'tidak_terdaftar', label: 'Tidak Terdaftar' },
];

const TIPE_LABELS = Object.fromEntries(TIPE_MENU.map((item) => [item.key, item.label]));

const GENDER_OPTIONS = [
    { value: 'L', label: 'Laki-laki' },
    { value: 'P', label: 'Perempuan' },
];

const EMPTY_MANUAL_FORM = {
    nama: '',
    nik: '',
    alamat: '',
    umur: null,
    jenis_kelamin: null,
    no_hp: '',
};

function genderLabel(value) {
    if (value === 'L') {
        return 'Laki-laki';
    }

    if (value === 'P') {
        return 'Perempuan';
    }

    return '-';
}

export default function DetailPeserta({ kdjenis, peserta: initialPeserta = [], provinsis = [] }) {
    const [pesertaList, setPesertaList] = useState(initialPeserta);
    const [petaniModalOpen, setPetaniModalOpen] = useState(false);
    const [manualModalOpen, setManualModalOpen] = useState(false);
    const [manualTipe, setManualTipe] = useState('tidak_terdaftar');
    const [manualForm] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setPesertaList(initialPeserta);
    }, [initialPeserta]);

    const openManualModal = (tipe) => {
        setManualTipe(tipe);
        manualForm.setFieldsValue(EMPTY_MANUAL_FORM);
        setManualModalOpen(true);
    };

    const handleMenuClick = ({ key }) => {
        if (key === 'petani') {
            setPetaniModalOpen(true);
            return;
        }

        openManualModal(key);
    };

    const handleAddManual = () => {
        manualForm.validateFields().then((values) => {
            setSubmitting(true);
            router.post(
                route('admin.data-verval.jenis-pelatihan.peserta.store', kdjenis),
                {
                    tipe_peserta: manualTipe,
                    ...values,
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setManualModalOpen(false);
                        manualForm.resetFields();
                        message.success('Peserta berhasil ditambahkan.');
                    },
                    onError: (errors) => {
                        manualForm.setFields(
                            Object.entries(errors).map(([name, error]) => ({
                                name,
                                errors: Array.isArray(error) ? error : [error],
                            })),
                        );
                    },
                    onFinish: () => setSubmitting(false),
                },
            );
        });
    };

    const handleDelete = (pesertaId) => {
        router.delete(
            route('admin.data-verval.jenis-pelatihan.peserta.destroy', [kdjenis, pesertaId]),
            {
                preserveScroll: true,
                onSuccess: () => message.success('Peserta berhasil dihapus.'),
            },
        );
    };

    const columns = [
        {
            title: 'No',
            key: 'no',
            width: 60,
            align: 'center',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Tipe',
            dataIndex: 'tipe_peserta_label',
            key: 'tipe_peserta_label',
            width: 130,
        },
        {
            title: 'Nama',
            dataIndex: 'nama',
            key: 'nama',
        },
        {
            title: 'NIK',
            dataIndex: 'nik',
            key: 'nik',
            width: 150,
            render: (value) => value || '-',
        },
        {
            title: 'Alamat',
            dataIndex: 'alamat',
            key: 'alamat',
            ellipsis: true,
            render: (value) => value || '-',
        },
        {
            title: 'Umur',
            dataIndex: 'umur',
            key: 'umur',
            width: 70,
            align: 'center',
            render: (value) => value ?? '-',
        },
        {
            title: 'Jenis Kelamin',
            dataIndex: 'jenis_kelamin',
            key: 'jenis_kelamin',
            width: 120,
            render: (value) => genderLabel(value),
        },
        {
            title: 'No HP',
            dataIndex: 'no_hp',
            key: 'no_hp',
            width: 130,
            render: (value) => value || '-',
        },
        {
            title: 'Aksi',
            key: 'action',
            width: 70,
            align: 'center',
            render: (_, record) => (
                <Popconfirm
                    title="Hapus peserta ini?"
                    okText="Hapus"
                    okType="danger"
                    cancelText="Batal"
                    onConfirm={() => handleDelete(record.id)}
                >
                    <Button size="small" danger icon={<DeleteOutlined />} />
                </Popconfirm>
            ),
        },
    ];

    return (
        <>
            <Card
                id="detail-peserta"
                className="mx-auto mt-6 max-w-6xl overflow-hidden rounded-xl border-2 border-emerald-500 shadow-sm"
                styles={{
                    header: {
                        background: '#16a34a',
                        borderBottom: 'none',
                        padding: '14px 24px',
                    },
                    body: { padding: '16px 24px 24px' },
                }}
                title={(
                    <Title level={5} className="!mb-0 !text-white">
                        Detail Peserta Training
                    </Title>
                )}
            >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <Dropdown
                        menu={{
                            items: TIPE_MENU,
                            onClick: handleMenuClick,
                        }}
                        trigger={['click']}
                    >
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            className="!border-emerald-500 !bg-emerald-500 hover:!bg-emerald-600"
                        >
                            Tambah Peserta
                        </Button>
                    </Dropdown>
                    <Text type="secondary">
                        Total peserta: <strong>{pesertaList.length}</strong>
                    </Text>
                </div>

                <Table
                    dataSource={pesertaList}
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                    scroll={{ x: 900 }}
                    locale={{ emptyText: 'Belum ada peserta. Klik Tambah Peserta untuk menambahkan.' }}
                    size="middle"
                />
            </Card>

            <PilihPetaniModal
                open={petaniModalOpen}
                onClose={() => setPetaniModalOpen(false)}
                kdjenis={kdjenis}
                provinsis={provinsis}
            />

            <Modal
                title={`Tambah Peserta — ${TIPE_LABELS[manualTipe]}`}
                open={manualModalOpen}
                onCancel={() => setManualModalOpen(false)}
                onOk={handleAddManual}
                okText="Simpan"
                confirmLoading={submitting}
                okButtonProps={{
                    className: '!border-emerald-500 !bg-emerald-500 hover:!bg-emerald-600',
                }}
                width={560}
            >
                <Form form={manualForm} layout="vertical" initialValues={EMPTY_MANUAL_FORM} className="pt-2">
                    <Form.Item
                        name="nama"
                        label="Nama"
                        rules={[{ required: true, message: 'Nama wajib diisi.' }]}
                    >
                        <Input placeholder="Nama lengkap" size="large" />
                    </Form.Item>
                    <Form.Item name="nik" label="NIK (Optional)">
                        <Input placeholder="16 digit NIK" maxLength={16} size="large" />
                    </Form.Item>
                    <Form.Item name="alamat" label="Alamat">
                        <Input.TextArea rows={3} placeholder="Alamat lengkap" />
                    </Form.Item>
                    <Form.Item name="umur" label="Umur">
                        <InputNumber className="w-full" min={1} max={120} placeholder="Tahun" size="large" />
                    </Form.Item>
                    <Form.Item name="jenis_kelamin" label="Jenis Kelamin">
                        <Select
                            allowClear
                            placeholder="Pilih jenis kelamin"
                            options={GENDER_OPTIONS}
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item name="no_hp" label="No HP">
                        <Input placeholder="08xx" maxLength={20} size="large" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
