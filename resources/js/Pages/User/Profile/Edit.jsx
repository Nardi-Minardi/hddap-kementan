import UserLayout from '@/Layouts/UserLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    Alert,
    Avatar,
    Breadcrumb,
    Button,
    Card,
    Descriptions,
    Form,
    Input,
    Modal,
    Space,
    Tabs,
    Typography,
    message,
} from 'antd';
import {
    DeleteOutlined,
    ExclamationCircleOutlined,
    HomeOutlined,
    IdcardOutlined,
    LockOutlined,
    SaveOutlined,
    UserOutlined,
} from '@ant-design/icons';

const { Text, Paragraph } = Typography;

const errorMessages = {
    'The name field is required.': 'Nama wajib diisi.',
    'The email field is required.': 'Email wajib diisi.',
    'The email has already been taken.': 'Email sudah digunakan.',
    'The current password field is required.': 'Password saat ini wajib diisi.',
    'The password field is required.': 'Password baru wajib diisi.',
    'The password field confirmation does not match.': 'Konfirmasi password tidak cocok.',
    'The password field must be at least 8 characters.': 'Password minimal 8 karakter.',
    'The provided password is incorrect.': 'Password yang Anda masukkan salah.',
};

function translateError(error) {
    if (!error) {
        return undefined;
    }

    return errorMessages[error] || error;
}

export default function Edit({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const profileForm = useForm({
        name: user.name,
        email: user.email,
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const deleteForm = useForm({
        password: '',
    });

    useEffect(() => {
        if (profileForm.recentlySuccessful) {
            message.success('Informasi profile berhasil disimpan.');
        }
    }, [profileForm.recentlySuccessful]);

    useEffect(() => {
        if (passwordForm.recentlySuccessful) {
            message.success('Password berhasil diperbarui.');
        }
    }, [passwordForm.recentlySuccessful]);

    const submitProfile = () => {
        profileForm.patch(route('user.profile.update'));
    };

    const submitPassword = () => {
        passwordForm.put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
            onError: (errors) => {
                if (errors.password) {
                    passwordForm.reset('password', 'password_confirmation');
                }

                if (errors.current_password) {
                    passwordForm.reset('current_password');
                }
            },
        });
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        deleteForm.clearErrors();
        deleteForm.reset();
    };

    const submitDelete = () => {
        deleteForm.delete(route('user.profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeDeleteModal(),
            onFinish: () => deleteForm.reset(),
        });
    };

    const primaryButtonClass = '!bg-emerald-500 hover:!bg-emerald-600 !border-emerald-500';

    const profileTab = (
        <div className="max-w-2xl">
            <Descriptions
                bordered
                size="small"
                column={1}
                className="mb-6"
                items={[
                    { label: 'Role', children: user?.role?.label || 'User' },
                    { label: 'Email terverifikasi', children: user?.email_verified_at ? 'Ya' : 'Belum' },
                ]}
            />

            {mustVerifyEmail && !user.email_verified_at && (
                <Alert
                    type="warning"
                    showIcon
                    className="mb-4"
                    message="Email belum diverifikasi"
                    description={
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="text-emerald-600 hover:text-emerald-700"
                        >
                            Klik di sini untuk kirim ulang email verifikasi.
                        </Link>
                    }
                />
            )}

            {status === 'verification-link-sent' && (
                <Alert
                    type="success"
                    showIcon
                    className="mb-4"
                    message="Link verifikasi baru telah dikirim ke email Anda."
                />
            )}

            <Form layout="vertical" onFinish={submitProfile}>
                <Form.Item
                    label="Nama Lengkap"
                    validateStatus={profileForm.errors.name ? 'error' : ''}
                    help={translateError(profileForm.errors.name)}
                >
                    <Input
                        value={profileForm.data.name}
                        onChange={(e) => profileForm.setData('name', e.target.value)}
                        placeholder="Masukkan nama lengkap"
                        size="large"
                        prefix={<UserOutlined className="text-gray-400" />}
                    />
                </Form.Item>

                <Form.Item
                    label="Email"
                    validateStatus={profileForm.errors.email ? 'error' : ''}
                    help={translateError(profileForm.errors.email)}
                >
                    <Input
                        type="email"
                        value={profileForm.data.email}
                        onChange={(e) => profileForm.setData('email', e.target.value)}
                        placeholder="contoh@email.com"
                        size="large"
                    />
                </Form.Item>

                <Form.Item className="mb-0">
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SaveOutlined />}
                        loading={profileForm.processing}
                        className={primaryButtonClass}
                        size="large"
                    >
                        Simpan Perubahan
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );

    const passwordTab = (
        <div className="max-w-2xl">
            <Paragraph type="secondary">
                Pastikan akun menggunakan password yang kuat dan unik.
            </Paragraph>

            <Form layout="vertical" onFinish={submitPassword}>
                <Form.Item
                    label="Password Saat Ini"
                    validateStatus={passwordForm.errors.current_password ? 'error' : ''}
                    help={translateError(passwordForm.errors.current_password)}
                >
                    <Input.Password
                        value={passwordForm.data.current_password}
                        onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                        placeholder="Masukkan password saat ini"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    label="Password Baru"
                    validateStatus={passwordForm.errors.password ? 'error' : ''}
                    help={translateError(passwordForm.errors.password)}
                >
                    <Input.Password
                        value={passwordForm.data.password}
                        onChange={(e) => passwordForm.setData('password', e.target.value)}
                        placeholder="Masukkan password baru"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    label="Konfirmasi Password Baru"
                    validateStatus={passwordForm.errors.password_confirmation ? 'error' : ''}
                    help={translateError(passwordForm.errors.password_confirmation)}
                >
                    <Input.Password
                        value={passwordForm.data.password_confirmation}
                        onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                        placeholder="Ulangi password baru"
                        size="large"
                    />
                </Form.Item>

                <Form.Item className="mb-0">
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SaveOutlined />}
                        loading={passwordForm.processing}
                        className={primaryButtonClass}
                        size="large"
                    >
                        Perbarui Password
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );

    const dangerTab = (
        <div className="max-w-2xl">
            <Alert
                type="error"
                showIcon
                message="Zona berbahaya"
                description="Setelah akun dihapus, seluruh data akan dihapus permanen. Pastikan data penting sudah disimpan."
                className="mb-6"
            />

            <Button
                danger
                type="primary"
                icon={<DeleteOutlined />}
                size="large"
                onClick={() => setDeleteModalOpen(true)}
            >
                Hapus Akun
            </Button>

            <Modal
                title={(
                    <Space>
                        <ExclamationCircleOutlined className="text-red-500" />
                        <span>Konfirmasi Hapus Akun</span>
                    </Space>
                )}
                open={deleteModalOpen}
                onCancel={closeDeleteModal}
                footer={null}
                destroyOnClose
            >
                <Paragraph type="secondary">
                    Tindakan ini tidak dapat dibatalkan. Masukkan password untuk melanjutkan.
                </Paragraph>

                <Form layout="vertical" onFinish={submitDelete}>
                    <Form.Item
                        label="Password"
                        validateStatus={deleteForm.errors.password ? 'error' : ''}
                        help={translateError(deleteForm.errors.password)}
                    >
                        <Input.Password
                            value={deleteForm.data.password}
                            onChange={(e) => deleteForm.setData('password', e.target.value)}
                            placeholder="Masukkan password Anda"
                            size="large"
                            autoFocus
                        />
                    </Form.Item>

                    <div className="flex justify-end gap-2">
                        <Button onClick={closeDeleteModal} size="large">
                            Batal
                        </Button>
                        <Button
                            danger
                            type="primary"
                            htmlType="submit"
                            loading={deleteForm.processing}
                            size="large"
                        >
                            Hapus Akun
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );

    return (
        <UserLayout title="Profile">
            <Head title="Profile" />

            <Breadcrumb
                className="mb-4"
                items={[
                    { href: route('user.dashboard'), title: <><HomeOutlined /> Dashboard</> },
                    { title: 'Profile' },
                ]}
            />

            <Card className="shadow-sm border border-gray-100 rounded-xl">
                <div className="mb-6 flex items-center gap-4 border-b border-gray-100 pb-6">
                    <Avatar size={64} className="!bg-emerald-500" icon={<UserOutlined />} />
                    <div>
                        <Text className="block text-lg font-semibold text-gray-800">{user?.name}</Text>
                        <Text type="secondary">{user?.email}</Text>
                    </div>
                </div>

                <Tabs
                    defaultActiveKey="info"
                    items={[
                        {
                            key: 'info',
                            label: (
                                <span>
                                    <IdcardOutlined /> Informasi
                                </span>
                            ),
                            children: profileTab,
                        },
                        {
                            key: 'password',
                            label: (
                                <span>
                                    <LockOutlined /> Password
                                </span>
                            ),
                            children: passwordTab,
                        },
                        {
                            key: 'danger',
                            label: (
                                <span className="text-red-500">
                                    <DeleteOutlined /> Hapus Akun
                                </span>
                            ),
                            children: dangerTab,
                        },
                    ]}
                />
            </Card>
        </UserLayout>
    );
}
