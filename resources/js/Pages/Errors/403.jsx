import { Head, Link } from '@inertiajs/react';
import { Button, Result } from 'antd';
import { HomeOutlined, LoginOutlined } from '@ant-design/icons';

export default function Forbidden() {
    return (
        <>
            <Head title="403 Forbidden" />
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
                <Result
                    status="403"
                    title="403"
                    subTitle="Maaf, Anda tidak memiliki akses ke halaman ini."
                    extra={[
                        <Link key="home" href="/">
                            <Button type="primary" icon={<HomeOutlined />} className="!bg-emerald-500 !border-emerald-500">
                                Ke Beranda
                            </Button>
                        </Link>,
                        <Link key="dashboard" href={route('dashboard')}>
                            <Button icon={<LoginOutlined />}>Ke Dashboard</Button>
                        </Link>,
                    ]}
                />
            </div>
        </>
    );
}
