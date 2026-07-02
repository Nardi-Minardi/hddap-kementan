import UserLayout from '@/Layouts/UserLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, Typography, Button } from 'antd';
import { SettingOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function Dashboard({ user }) {
    return (
        <UserLayout title="Dashboard">
            <Head title="Dashboard User" />

            <Card className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                            <UserOutlined className="text-2xl" />
                        </div>
                        <div>
                            <Title level={4} className="!mb-1 !text-gray-800">
                                Selamat datang, {user?.name}
                            </Title>
                            <Text type="secondary">{user?.email}</Text>
                        </div>
                    </div>
                    <Link href={route('user.profile.edit')}>
                        <Button
                            type="primary"
                            icon={<SettingOutlined />}
                            className="!border-emerald-500 !bg-emerald-500 hover:!bg-emerald-600"
                            size="large"
                        >
                            Profile
                        </Button>
                    </Link>
                </div>
            </Card>
        </UserLayout>
    );
}
