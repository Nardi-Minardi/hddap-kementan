import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    Alert,
    Breadcrumb,
    Button,
    Card,
    Col,
    Descriptions,
    Form,
    Input,
    Modal,
    Popconfirm,
    Row,
    Space,
    Table,
    Typography,
    Upload,
    message,
} from 'antd';
import {
    CloudDownloadOutlined,
    CloudUploadOutlined,
    DatabaseOutlined,
    DeleteOutlined,
    HomeOutlined,
    ReloadOutlined,
    SaveOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';

const { Title, Text, Paragraph } = Typography;

function formatDateTime(value) {
    if (!value) {
        return '-';
    }

    return new Date(value).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function DatabaseBackupIndex({ connection, backups }) {
    const { flash } = usePage().props;
    const [restoreModalOpen, setRestoreModalOpen] = useState(false);
    const [selectedBackup, setSelectedBackup] = useState(null);
    const [uploadFile, setUploadFile] = useState(null);
    const [creatingBackup, setCreatingBackup] = useState(false);

    const { data, setData, processing, errors, reset } = useForm({
        confirm: '',
        admin_password: '',
        backup_file: '',
        upload: null,
    });

    useEffect(() => {
        if (flash?.success) message.success(flash.success);
        if (flash?.error) message.error(flash.error);
    }, [flash]);

    const handleCreateBackup = () => {
        setCreatingBackup(true);
        router.post(route('admin.database-backup.store'), {}, {
            preserveScroll: true,
            onFinish: () => setCreatingBackup(false),
        });
    };

    const openRestoreModal = (filename = null) => {
        setSelectedBackup(filename);
        setUploadFile(null);
        reset();
        setRestoreModalOpen(true);
    };

    const closeRestoreModal = () => {
        setRestoreModalOpen(false);
        setSelectedBackup(null);
        setUploadFile(null);
        reset();
    };

    const handleRestore = () => {
        const formData = new FormData();
        formData.append('confirm', data.confirm);
        formData.append('admin_password', data.admin_password);

        if (uploadFile) {
            formData.append('upload', uploadFile);
        } else if (selectedBackup) {
            formData.append('backup_file', selectedBackup);
        }

        router.post(route('admin.database-backup.restore'), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => closeRestoreModal(),
        });
    };

    const handleDelete = (filename) => {
        router.delete(route('admin.database-backup.destroy', filename), {
            preserveScroll: true,
        });
    };

    const columns = [
        {
            title: 'No',
            key: 'no',
            width: 60,
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Nama File',
            dataIndex: 'filename',
            key: 'filename',
        },
        {
            title: 'Ukuran',
            dataIndex: 'size_human',
            key: 'size_human',
            width: 120,
        },
        {
            title: 'Dibuat',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 180,
            render: (value) => formatDateTime(value),
        },
        {
            title: 'Aksi',
            key: 'action',
            width: 220,
            render: (_, record) => (
                <Space size={4} wrap>
                    <Button
                        size="small"
                        icon={<CloudDownloadOutlined />}
                        href={route('admin.database-backup.download', record.filename)}
                    >
                        Download
                    </Button>
                    <Button
                        size="small"
                        type="primary"
                        ghost
                        icon={<ReloadOutlined />}
                        onClick={() => openRestoreModal(record.filename)}
                    >
                        Restore
                    </Button>
                    <Popconfirm
                        title="Hapus file backup ini?"
                        okText="Hapus"
                        okType="danger"
                        cancelText="Batal"
                        onConfirm={() => handleDelete(record.filename)}
                    >
                        <Button size="small" danger ghost icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const canRestore = data.confirm === 'RESTORE'
        && data.admin_password.trim() !== ''
        && (selectedBackup || uploadFile);

    return (
        <AdminLayout title="Backup dan Restore Database">
            <Head title="Backup dan Restore Database" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: <><DatabaseOutlined /> Backup dan Restore Database</> },
                ]}
            />

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={10}>
                    <Card className="shadow-sm border border-gray-100 rounded-xl h-full">
                        <Title level={5} className="!mb-3 !text-gray-800">Informasi Database</Title>
                        <Descriptions column={1} size="small" bordered>
                            <Descriptions.Item label="Driver">{connection.driver}</Descriptions.Item>
                            <Descriptions.Item label="Database">{connection.database}</Descriptions.Item>
                            <Descriptions.Item label="Host">{connection.host ?? '-'}</Descriptions.Item>
                            <Descriptions.Item label="Port">{connection.port ?? '-'}</Descriptions.Item>
                        </Descriptions>

                        <Alert
                            className="!mt-4"
                            type="warning"
                            showIcon
                            message="Restore akan menimpa seluruh data database saat ini. Pastikan sudah membuat backup terlebih dahulu."
                        />

                        <div className="mt-4">
                            <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                loading={creatingBackup}
                                onClick={handleCreateBackup}
                                className="!bg-emerald-500 !border-emerald-500 hover:!bg-emerald-600"
                            >
                                Buat Backup Sekarang
                            </Button>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={14}>
                    <Card className="shadow-sm border border-gray-100 rounded-xl h-full">
                        <Title level={5} className="!mb-3 !text-gray-800">Restore dari File Upload</Title>
                        <Paragraph type="secondary" className="!mb-3">
                            Unggah file backup (.sql / .sqlite) untuk restore database.
                        </Paragraph>
                        <Button
                            type="primary"
                            danger
                            icon={<CloudUploadOutlined />}
                            onClick={() => openRestoreModal(null)}
                        >
                            Upload & Restore
                        </Button>
                    </Card>
                </Col>
            </Row>

            <Card
                className="mt-4 shadow-sm border border-gray-100 rounded-xl"
                title={
                    <div className="flex items-center justify-between py-1">
                        <Title level={5} className="!mb-0 !text-gray-800">Daftar File Backup</Title>
                        <Text type="secondary">{backups.length} file</Text>
                    </div>
                }
            >
                <Table
                    dataSource={backups}
                    columns={columns}
                    rowKey="filename"
                    pagination={false}
                    locale={{ emptyText: 'Belum ada file backup. Klik "Buat Backup Sekarang" untuk membuat backup.' }}
                />
            </Card>

            <Modal
                title="Restore Database"
                open={restoreModalOpen}
                onCancel={closeRestoreModal}
                footer={[
                    <Button key="cancel" onClick={closeRestoreModal}>Batal</Button>,
                    <Button
                        key="restore"
                        type="primary"
                        danger
                        loading={processing}
                        disabled={!canRestore}
                        onClick={handleRestore}
                    >
                        Restore Database
                    </Button>,
                ]}
                destroyOnClose
            >
                <Alert
                    type="error"
                    showIcon
                    className="!mb-4"
                    message="Perhatian"
                    description="Semua data database saat ini akan diganti dengan isi file backup. Operasi ini tidak dapat dibatalkan."
                />

                {selectedBackup ? (
                    <div className="mb-4">
                        <Text strong>File backup:</Text>
                        <div>{selectedBackup}</div>
                    </div>
                ) : (
                    <Form.Item
                        label="File Backup"
                        validateStatus={errors.upload ? 'error' : ''}
                        help={errors.upload}
                        className="!mb-4"
                    >
                        <Upload
                            beforeUpload={(file) => {
                                setUploadFile(file);
                                return false;
                            }}
                            onRemove={() => setUploadFile(null)}
                            maxCount={1}
                            accept=".sql,.txt,.sqlite,.dump"
                        >
                            <Button icon={<CloudUploadOutlined />}>Pilih File</Button>
                        </Upload>
                    </Form.Item>
                )}

                <Form layout="vertical">
                    <Form.Item
                        label="Password Admin"
                        required
                        validateStatus={errors.admin_password ? 'error' : ''}
                        help={errors.admin_password || 'Masukkan password akun admin Anda untuk melanjutkan restore.'}
                        className="!mb-4"
                    >
                        <Input.Password
                            value={data.admin_password}
                            onChange={(event) => setData('admin_password', event.target.value)}
                            placeholder="Password admin"
                            autoComplete="current-password"
                        />
                    </Form.Item>
                    <Form.Item
                        label='Ketik "RESTORE" untuk konfirmasi'
                        required
                        validateStatus={errors.confirm ? 'error' : ''}
                        help={errors.confirm}
                    >
                        <Input
                            value={data.confirm}
                            onChange={(event) => setData('confirm', event.target.value)}
                            placeholder="RESTORE"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </AdminLayout>
    );
}
