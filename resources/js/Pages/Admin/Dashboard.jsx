import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import {
    UserOutlined,
    TeamOutlined,
    SafetyOutlined,
    RiseOutlined,
    GlobalOutlined,
    BankOutlined,
    EnvironmentOutlined,
    HomeOutlined,
    PieChartOutlined,
    BarChartOutlined,
    ApartmentOutlined,
    AppstoreOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

function formatNumber(value) {
    return Number(value || 0).toLocaleString('id-ID');
}

function CpclTotalChart({ total }) {
    const maxReference = Math.max(total, 1000);
    const barWidth = total > 0 ? Math.max((total / maxReference) * 100, 8) : 0;

    return (
        <div className="flex h-full flex-col justify-center">
            <Statistic
                title="Total CPCL"
                value={total}
                valueStyle={{ color: '#059669', fontSize: 40, fontWeight: 700 }}
                formatter={(value) => formatNumber(value)}
            />
            <Text type="secondary" className="mt-1 block text-xs">
                Data petani dengan jmlah_petani = 1
            </Text>
            <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
                    <span>Distribusi</span>
                    <span>{formatNumber(total)} petani</span>
                </div>
                <div className="h-8 overflow-hidden rounded-lg bg-gray-100">
                    <div
                        className="flex h-full items-center rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 px-3 text-xs font-semibold text-white transition-all"
                        style={{ width: `${barWidth}%` }}
                    >
                        CPCL
                    </div>
                </div>
            </div>
        </div>
    );
}

function CpclGenderChart({ gender = [], total = 0 }) {
    const circumference = 2 * Math.PI * 54;
    let offset = 0;

    const segments = gender.map((item) => {
        const percentage = total > 0 ? (item.value / total) * 100 : 0;
        const dash = (percentage / 100) * circumference;
        const segment = {
            ...item,
            percentage,
            dash,
            offset,
        };
        offset += dash;

        return segment;
    });

    return (
        <div className="flex h-full flex-col gap-6 lg:flex-row lg:items-center">
            <div className="relative mx-auto h-40 w-40 shrink-0">
                <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#f3f4f6" strokeWidth="12" />
                    {segments.map((segment) => (
                        <circle
                            key={segment.key}
                            cx="60"
                            cy="60"
                            r="54"
                            fill="none"
                            stroke={segment.color}
                            strokeWidth="12"
                            strokeDasharray={`${segment.dash} ${circumference - segment.dash}`}
                            strokeDashoffset={-segment.offset}
                            strokeLinecap="butt"
                        />
                    ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <div className="text-2xl font-bold text-gray-800">{formatNumber(total)}</div>
                    <div className="text-xs text-gray-500">Total</div>
                </div>
            </div>

            <div className="flex-1 space-y-4">
                {segments.map((segment) => (
                    <div key={segment.key}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <span
                                    className="inline-block h-3 w-3 rounded-full"
                                    style={{ backgroundColor: segment.color }}
                                />
                                <span className="font-medium text-gray-700">
                                    {segment.label} ({segment.key})
                                </span>
                            </div>
                            <span className="font-semibold text-gray-800">
                                {formatNumber(segment.value)} ({segment.percentage.toFixed(1)}%)
                            </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                            <div
                                className="h-full rounded-full"
                                style={{
                                    width: `${segment.percentage}%`,
                                    backgroundColor: segment.color,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function KabupatenBarChart({ data = [], color = '#059669' }) {
    const maxValue = Math.max(...data.map((item) => item.value), 1);

    if (data.length === 0) {
        return <Text type="secondary">Belum ada data.</Text>;
    }

    return (
        <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
            {data.map((item) => (
                <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                        <span className="font-medium text-gray-700">{item.label}</span>
                        <span className="font-semibold text-gray-800">{formatNumber(item.value)}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                        <div
                            className="h-full rounded-full transition-all"
                            style={{
                                width: `${(item.value / maxValue) * 100}%`,
                                backgroundColor: color,
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function Dashboard({ stats, wilayah, cpcl }) {
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
            subtitle: 'Dampingan HDDAP',
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
                <Text className="text-gray-500">Wilayah dampingan HDDAP — 13 kabupaten/kota.</Text>
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
                                        <Text className="text-emerald-600 text-xs mt-2 inline-block">
                                            {card.subtitle ?? 'Lihat daftar →'}
                                        </Text>
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

            <div className="mb-4">
                <Title level={5} className="!mb-1 !text-gray-800">Rekap CPCL</Title>
                <Text className="text-gray-500">Ringkasan data petani dari tabel m_petani (jmlah_petani = 1).</Text>
            </div>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={10}>
                    <Card
                        title={(
                            <span className="font-semibold text-gray-700">
                                <BarChartOutlined className="mr-2 text-emerald-600" />
                                Grafik Total CPCL
                            </span>
                        )}
                        className="shadow-sm border border-gray-100 rounded-xl h-full"
                    >
                        <CpclTotalChart total={cpcl.total} />
                    </Card>
                </Col>

                <Col xs={24} lg={14}>
                    <Card
                        title={(
                            <span className="font-semibold text-gray-700">
                                <PieChartOutlined className="mr-2 text-emerald-600" />
                                Grafik Gender (L/P)
                            </span>
                        )}
                        className="shadow-sm border border-gray-100 rounded-xl h-full"
                    >
                        <CpclGenderChart gender={cpcl.gender} total={cpcl.total} />
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card
                        title={(
                            <span className="font-semibold text-gray-700">
                                <ApartmentOutlined className="mr-2 text-emerald-600" />
                                Jumlah Cluster by Kabupaten/Kota
                            </span>
                        )}
                        className="shadow-sm border border-gray-100 rounded-xl h-full"
                    >
                        <KabupatenBarChart data={cpcl.clusterByKabupaten} color="#059669" />
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card
                        title={(
                            <span className="font-semibold text-gray-700">
                                <AppstoreOutlined className="mr-2 text-teal-600" />
                                Jumlah Komoditas by Kabupaten/Kota
                            </span>
                        )}
                        className="shadow-sm border border-gray-100 rounded-xl h-full"
                    >
                        <KabupatenBarChart data={cpcl.komoditasByKabupaten} color="#0d9488" />
                    </Card>
                </Col>
            </Row>
        </AdminLayout>
    );
}
