import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, Col, Row, Statistic, Typography, Timeline, Tag } from 'antd';
import {
    UserOutlined,
    TeamOutlined,
    SafetyOutlined,
    RiseOutlined,
    CheckCircleOutlined,
    GlobalOutlined,
    BankOutlined,
    EnvironmentOutlined,
    HomeOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function Dashboard({ stats, wilayah }) {
    const statCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: <UserOutlined />,
            color: 'bg-blue-500',
            textColor: 'text-blue-600',
            bgLight: 'bg-blue-50',
        },
        {
            title: 'Administrator',
            value: stats.adminCount,
            icon: <SafetyOutlined />,
            color: 'bg-emerald-500',
            textColor: 'text-emerald-600',
            bgLight: 'bg-emerald-50',
        },
        {
            title: 'Regular Users',
            value: stats.userCount,
            icon: <TeamOutlined />,
            color: 'bg-violet-500',
            textColor: 'text-violet-600',
            bgLight: 'bg-violet-50',
        },
        {
            title: 'Total Roles',
            value: stats.totalRoles,
            icon: <RiseOutlined />,
            color: 'bg-amber-500',
            textColor: 'text-amber-600',
            bgLight: 'bg-amber-50',
        },
    ];

    const wilayahCards = [
        {
            title: 'Provinsi',
            value: wilayah.provinsi,
            icon: <GlobalOutlined />,
            href: route('admin.provinsi.index'),
            textColor: 'text-emerald-600',
            bgLight: 'bg-emerald-50',
        },
        {
            title: 'Kab/Kota',
            value: wilayah.kabKota,
            icon: <BankOutlined />,
            href: route('admin.kab-kota.index'),
            textColor: 'text-teal-600',
            bgLight: 'bg-teal-50',
        },
        {
            title: 'Kecamatan',
            value: wilayah.kecamatan,
            icon: <EnvironmentOutlined />,
            href: route('admin.kecamatan.index'),
            textColor: 'text-green-600',
            bgLight: 'bg-green-50',
        },
        {
            title: 'Kel/Desa',
            value: wilayah.kelDes,
            icon: <HomeOutlined />,
            href: route('admin.kel-des.index'),
            textColor: 'text-lime-600',
            bgLight: 'bg-lime-50',
        },
    ];

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="mb-6">
                <Title level={4} className="!mb-1 !text-gray-800">Selamat Datang! 👋</Title>
                <Text className="text-gray-500">Berikut ringkasan data sistem HDDAP.</Text>
            </div>

            {/* Stat Cards */}
            <Row gutter={[16, 16]} className="mb-6">
                {statCards.map((card) => (
                    <Col xs={24} sm={12} lg={6} key={card.title}>
                        <Card
                            className="shadow-sm hover:shadow-md transition-shadow border border-gray-100 rounded-xl"
                            bodyStyle={{ padding: 20 }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <Text className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                                        {card.title}
                                    </Text>
                                    <div className={`text-3xl font-bold mt-1 ${card.textColor}`}>
                                        {card.value}
                                    </div>
                                </div>
                                <div className={`w-12 h-12 rounded-xl ${card.bgLight} flex items-center justify-center`}>
                                    <span className={`text-xl ${card.textColor}`}>{card.icon}</span>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            <div className="mb-4">
                <Title level={5} className="!mb-1 !text-gray-800">Data Wilayah</Title>
                <Text className="text-gray-500">Master data provinsi hingga kelurahan/desa.</Text>
            </div>

            <Row gutter={[16, 16]} className="mb-6">
                {wilayahCards.map((card) => (
                    <Col xs={24} sm={12} lg={6} key={card.title}>
                        <Link href={card.href}>
                            <Card
                                hoverable
                                className="shadow-sm hover:shadow-md transition-shadow border border-gray-100 rounded-xl"
                                bodyStyle={{ padding: 20 }}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Text className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                                            {card.title}
                                        </Text>
                                        <div className={`text-3xl font-bold mt-1 ${card.textColor}`}>
                                            {card.value.toLocaleString('id-ID')}
                                        </div>
                                        <Text className="text-emerald-600 text-xs mt-2 inline-block">Lihat daftar →</Text>
                                    </div>
                                    <div className={`w-12 h-12 rounded-xl ${card.bgLight} flex items-center justify-center`}>
                                        <span className={`text-xl ${card.textColor}`}>{card.icon}</span>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>

            <Row gutter={[16, 16]}>
                {/* Quick Info */}
                <Col xs={24} lg={12}>
                    <Card
                        title={<span className="font-semibold text-gray-700">Informasi Sistem</span>}
                        className="shadow-sm border border-gray-100 rounded-xl h-full"
                    >
                        <div className="space-y-3">
                            {[
                                { label: 'Aplikasi', value: 'HDDAP Admin', color: 'processing' },
                                { label: 'Framework', value: 'Laravel 13', color: 'success' },
                                { label: 'UI Library', value: 'Ant Design', color: 'blue' },
                                { label: 'Frontend', value: 'React + Inertia.js', color: 'purple' },
                                { label: 'Status', value: 'Aktif', color: 'success' },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                    <Text className="text-gray-500">{item.label}</Text>
                                    <Tag color={item.color}>{item.value}</Tag>
                                </div>
                            ))}
                        </div>
                    </Card>
                </Col>

                {/* Recent Activity */}
                <Col xs={24} lg={12}>
                    <Card
                        title={<span className="font-semibold text-gray-700">Aktivitas Terbaru</span>}
                        className="shadow-sm border border-gray-100 rounded-xl h-full"
                    >
                        <Timeline
                            items={[
                                {
                                    dot: <CheckCircleOutlined className="text-emerald-500" />,
                                    children: (
                                        <div>
                                            <Text className="font-medium text-gray-700">Sistem berhasil diinisialisasi</Text>
                                            <br />
                                            <Text className="text-gray-400 text-xs">Baru saja</Text>
                                        </div>
                                    ),
                                },
                                {
                                    dot: <UserOutlined className="text-blue-500" />,
                                    children: (
                                        <div>
                                            <Text className="font-medium text-gray-700">Roles default dibuat</Text>
                                            <br />
                                            <Text className="text-gray-400 text-xs">Admin & User</Text>
                                        </div>
                                    ),
                                },
                                {
                                    dot: <SafetyOutlined className="text-violet-500" />,
                                    children: (
                                        <div>
                                            <Text className="font-medium text-gray-700">Middleware dan Policy aktif</Text>
                                            <br />
                                            <Text className="text-gray-400 text-xs">Keamanan terkonfigurasi</Text>
                                        </div>
                                    ),
                                },
                            ]}
                        />
                    </Card>
                </Col>
            </Row>
        </AdminLayout>
    );
}
