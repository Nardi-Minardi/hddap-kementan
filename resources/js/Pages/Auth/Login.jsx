import { Head, Link, useForm } from "@inertiajs/react";
import { Form, Input, Button, Checkbox, Card, Typography, Divider, Alert } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const handleSubmit = () => {
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Login" />

            <div
                className="relative flex min-h-screen bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/images/bg-fitur-section.png')" }}
            >
                <div className="absolute inset-0 bg-green-950/75" />

                <div className="relative z-10 flex min-h-screen w-full">
                {/* Left Branding — 60% */}
                <div className="hidden lg:flex lg:w-[60%] items-center justify-center p-12">
                    <Link href="/" className="block text-center transition hover:opacity-90">
                        <div className="w-24 h-24 rounded-2xl bg-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-2xl">
                            <span className="text-white font-black text-4xl">H</span>
                        </div>
                        <h1 className="text-4xl font-black text-white mb-3">HDDAP</h1>
                        <p className="text-slate-400 text-lg max-w-xs">
                            Sistem Informasi Manajemen Kementerian Pertanian
                        </p>
                    </Link>
                </div>

                {/* Right Form — 40% */}
                <div className="flex-1 lg:w-[40%] lg:flex-none flex items-center justify-center p-6">
                    <div className="w-full max-w-md">
                        <div className="mb-8 text-center lg:text-left">
                            <Link href="/" className="inline-block transition hover:opacity-90">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center mb-4 mx-auto lg:mx-0">
                                    <span className="text-white font-bold text-lg">H</span>
                                </div>
                                <p className="mb-4 text-lg font-black text-white lg:hidden">HDDAP</p>
                            </Link>
                            <Title level={3} className="!text-white !mb-1">Selamat Datang</Title>
                            <Text className="!text-slate-400">Masuk ke akun Anda untuk melanjutkan</Text>
                        </div>

                        <Card
                            className="!bg-white/10 !backdrop-blur-md !border-white/20 !rounded-2xl shadow-2xl"
                            bodyStyle={{ padding: "28px" }}
                        >
                            {status && (
                                <Alert message={status} type="success" showIcon className="mb-4" />
                            )}

                            <Form layout="vertical" onFinish={handleSubmit}>
                                <Form.Item
                                    validateStatus={errors.email ? "error" : ""}
                                    help={<span className="text-red-300 text-xs">{errors.email}</span>}
                                >
                                    <Input
                                        prefix={<UserOutlined className="text-slate-400" />}
                                        type="email"
                                        placeholder="Email address"
                                        value={data.email}
                                        onChange={(e) => setData("email", e.target.value)}
                                        size="large"
                                        className="!bg-white/10 !border-white/20 !text-white placeholder:!text-slate-400"
                                    />
                                </Form.Item>

                                <Form.Item
                                    validateStatus={errors.password ? "error" : ""}
                                    help={<span className="text-red-300 text-xs">{errors.password}</span>}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined className="text-slate-400" />}
                                        placeholder="Password"
                                        value={data.password}
                                        onChange={(e) => setData("password", e.target.value)}
                                        size="large"
                                        className="!bg-white/10 !border-white/20 !text-white placeholder:!text-slate-400"
                                    />
                                </Form.Item>

                                <div className="flex items-center justify-between mb-4">
                                    <Checkbox
                                        checked={data.remember}
                                        onChange={(e) => setData("remember", e.target.checked)}
                                        className="!text-slate-300"
                                    >
                                        Ingat saya
                                    </Checkbox>
                                    {canResetPassword && (
                                        <Link href={route("password.request")} className="text-emerald-400 hover:text-emerald-300 text-sm">
                                            Lupa password?
                                        </Link>
                                    )}
                                </div>

                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    size="large"
                                    icon={<LoginOutlined />}
                                    loading={processing}
                                    className="!bg-emerald-500 hover:!bg-emerald-600 !border-emerald-500 !h-12 !text-base font-semibold"
                                >
                                    Masuk
                                </Button>
                            </Form>

                            <Divider className="!border-white/20 !text-slate-400 text-xs">atau</Divider>

                            <div className="text-center">
                                <Text className="!text-slate-400 text-sm">
                                    Belum punya akun?{" "}
                                    <Link href={route("register")} className="text-emerald-400 hover:text-emerald-300 font-medium">
                                        Daftar sekarang
                                    </Link>
                                </Text>
                            </div>
                        </Card>

                        <p className="text-center text-slate-500 text-xs mt-6">
                            © 2026 Kementerian Pertanian RI
                        </p>
                    </div>
                </div>
                </div>
            </div>
        </>
    );
}
