import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    Table,
    Card,
    Typography,
    Breadcrumb,
    Tag,
    Button,
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    Space,
    Popconfirm,
    Tooltip,
    message,
} from 'antd';
import {
    HomeOutlined,
    UserOutlined,
    TeamOutlined,
    ArrowLeftOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { usePermissions } from '@/utils/permissions';

const { Title, Text } = Typography;

const GENDER_OPTIONS = [
    { value: 'L', label: 'Laki-laki' },
    { value: 'P', label: 'Perempuan' },
];

const GENDER_LABEL = { L: 'Laki-laki', P: 'Perempuan' };

const EMPTY_FORM = {
    nama: '',
    nik: '',
    gender: null,
    usia: null,
    status: null,
};

export default function PetaniKeluarga({ petani, keluarga, statusOptions = [] }) {
    const { can } = usePermissions();
    const { flash } = usePage().props;
    const [modalOpen, setModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        ...EMPTY_FORM,
    });

    useEffect(() => {
        if (flash?.success) {
            message.success(flash.success);
        }
    }, [flash?.success]);

    const openCreateModal = () => {
        setEditingMember(null);
        reset();
        clearErrors();
        setModalOpen(true);
    };

    const openEditModal = (member) => {
        setEditingMember(member);
        setData({
            nama: member.nama ?? '',
            nik: member.nik ?? '',
            gender: member.gender ?? null,
            usia: member.usia ?? null,
            status: member.status ?? null,
        });
        clearErrors();
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingMember(null);
        reset();
        clearErrors();
    };

    const handleSubmit = () => {
        if (editingMember) {
            put(route('admin.petani.keluarga.update', [petani.id, editingMember.id]), {
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
            return;
        }

        post(route('admin.petani.keluarga.store', petani.id), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
        });
    };

    const columns = [
        {
            title: 'No',
            key: 'no',
            width: 55,
            render: (_, __, i) => i + 1,
        },
        {
            title: 'Nama',
            dataIndex: 'nama',
            key: 'nama',
            width: 200,
            render: (v) => v ?? '-',
        },
        {
            title: 'NIK',
            dataIndex: 'nik',
            key: 'nik',
            width: 180,
            render: (v) => v ?? '-',
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            width: 120,
            align: 'center',
            render: (v) => v
                ? <Tag color={v === 'L' ? 'blue' : 'pink'}>{GENDER_LABEL[v] ?? v}</Tag>
                : '-',
        },
        {
            title: 'Usia',
            dataIndex: 'usia',
            key: 'usia',
            width: 80,
            align: 'center',
            render: (v) => v != null ? `${v} th` : '-',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 150,
            render: (v) => v ? <Tag>{v}</Tag> : '-',
        },
        {
            title: 'Aksi',
            key: 'action',
            width: 110,
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
                <Space size={4}>
                    {can('petani.update') && (
                        <Tooltip title="Edit">
                            <Button
                                size="small"
                                type="primary"
                                ghost
                                icon={<EditOutlined />}
                                onClick={() => openEditModal(record)}
                            />
                        </Tooltip>
                    )}
                    {can('petani.delete') && (
                        <Popconfirm
                            title="Hapus anggota keluarga ini?"
                            okText="Hapus"
                            okType="danger"
                            cancelText="Batal"
                            onConfirm={() => router.delete(
                                route('admin.petani.keluarga.destroy', [petani.id, record.id]),
                                { preserveScroll: true },
                            )}
                        >
                            <Tooltip title="Hapus">
                                <Button size="small" danger icon={<DeleteOutlined />} />
                            </Tooltip>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout title="Data Keluarga Petani">
            <Head title="Data Keluarga Petani" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: 'Master' },
                    { href: route('admin.petani.index'), title: <><UserOutlined /> Petani</> },
                    { title: <><TeamOutlined /> Keluarga</> },
                ]}
            />

            <Card className="mb-4 rounded-xl border border-gray-100 shadow-sm" size="small">
                <div className="grid grid-cols-1 gap-x-8 gap-y-1 text-sm md:grid-cols-2">
                    <div><Text type="secondary">Nama Petani:</Text> <Text strong>{petani.nama_petani}</Text></div>
                    <div><Text type="secondary">NIK:</Text> <Text>{petani.nik_petani ?? '-'}</Text></div>
                    <div><Text type="secondary">No HP:</Text> <Text>{petani.no_hp_petani ?? '-'}</Text></div>
                    <div><Text type="secondary">Alamat:</Text> <Text>{petani.alamat_petani ?? '-'}</Text></div>
                </div>
            </Card>

            <Card
                className="rounded-xl border border-gray-100 shadow-sm"
                title={
                    <div className="flex flex-wrap items-center justify-between gap-3 py-1">
                        <Title level={5} className="!mb-0 !text-gray-800">
                            <TeamOutlined className="mr-2" />
                            Data Keluarga ({keluarga.length})
                        </Title>
                        <Space>
                            {can('petani.update') && (
                                <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
                                    Tambah Anggota
                                </Button>
                            )}
                            <Button icon={<ArrowLeftOutlined />} onClick={() => router.visit(route('admin.petani.index'))}>
                                Kembali
                            </Button>
                        </Space>
                    </div>
                }
            >
                <Table
                    dataSource={keluarga}
                    columns={columns}
                    rowKey="id"
                    scroll={{ x: 'max-content' }}
                    pagination={keluarga.length > 20 ? { pageSize: 20, showTotal: (t) => `Total ${t} anggota keluarga` } : false}
                    rowClassName="hover:!bg-gray-50"
                    locale={{ emptyText: 'Belum ada data keluarga. Klik "Tambah Anggota" untuk menambahkan.' }}
                />
            </Card>

            <Modal
                title={editingMember ? 'Edit Anggota Keluarga' : 'Tambah Anggota Keluarga'}
                open={modalOpen}
                onCancel={closeModal}
                onOk={handleSubmit}
                okText={editingMember ? 'Simpan Perubahan' : 'Simpan'}
                cancelText="Batal"
                confirmLoading={processing}
                destroyOnHidden
                width={520}
            >
                <Form layout="vertical" className="mt-4">
                    <Form.Item
                        label="Nama"
                        required
                        validateStatus={errors.nama ? 'error' : ''}
                        help={errors.nama}
                    >
                        <Input
                            size="large"
                            value={data.nama}
                            onChange={(e) => setData('nama', e.target.value)}
                            placeholder="Nama lengkap anggota keluarga"
                        />
                    </Form.Item>

                    <Form.Item
                        label="NIK"
                        validateStatus={errors.nik ? 'error' : ''}
                        help={errors.nik}
                    >
                        <Input
                            size="large"
                            value={data.nik}
                            onChange={(e) => setData('nik', e.target.value)}
                            placeholder="16 digit NIK"
                            maxLength={16}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Gender"
                        validateStatus={errors.gender ? 'error' : ''}
                        help={errors.gender}
                    >
                        <Select
                            allowClear
                            size="large"
                            placeholder="Pilih gender"
                            value={data.gender}
                            onChange={(val) => setData('gender', val ?? null)}
                            options={GENDER_OPTIONS}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Usia"
                        validateStatus={errors.usia ? 'error' : ''}
                        help={errors.usia}
                    >
                        <InputNumber
                            className="w-full"
                            size="large"
                            min={0}
                            max={120}
                            value={data.usia}
                            onChange={(val) => setData('usia', val)}
                            placeholder="Tahun"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Status Hubungan"
                        validateStatus={errors.status ? 'error' : ''}
                        help={errors.status || 'Contoh: Suami, Istri, Anak, Orang Tua'}
                    >
                        <Select
                            allowClear
                            size="large"
                            placeholder="Pilih status hubungan"
                            value={data.status}
                            onChange={(val) => setData('status', val ?? null)}
                            options={statusOptions}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </AdminLayout>
    );
}
