import { Head, Link, useForm } from "@inertiajs/react";
import { Form, Input, Button, Card, Typography, Divider } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const handleSubmit = () => {
        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <>
            <Head title="Register" />
            <div
                className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat p-6"
                style={{ backgroundImage: "url('/images/bg-fitur-section.png')" }}
            >
                <div className="absolute inset-0 bg-green-950/75" />

                <div className="relative z-10 w-full max-w-md">
                    <Link href="/" className="mb-8 block text-center transition hover:opacity-90">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-xl">
                            <span className="text-white font-black text-2xl">H</span>
                        </div>
                        <p className="mb-1 text-xl font-black text-white">HDDAP</p>
                        <Text className="!text-slate-400">Daftar untuk menggunakan sistem HDDAP</Text>
                    </Link>

                    <div className="text-center mb-6">
                        <Title level={3} className="!text-white !mb-0">Buat Akun</Title>
                    </div>

                    <Card
                        className="!bg-white/10 !backdrop-blur-md !border-white/20 !rounded-2xl shadow-2xl"
                        bodyStyle={{ padding: "28px" }}
                    >
                        <Form layout="vertical" onFinish={handleSubmit}>
                            <Form.Item
                                validateStatus={errors.name ? "error" : ""}
                                help={<span className="text-red-300 text-xs">{errors.name}</span>}
                            >
                                <Input
                                    prefix={<UserOutlined className="text-slate-400" />}
                                    placeholder="Nama lengkap"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                validateStatus={errors.email ? "error" : ""}
                                help={<span className="text-red-300 text-xs">{errors.email}</span>}
                            >
                                <Input
                                    prefix={<MailOutlined className="text-slate-400" />}
                                    type="email"
                                    placeholder="Email address"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    size="large"
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
                                />
                            </Form.Item>

                            <Form.Item
                                validateStatus={errors.password_confirmation ? "error" : ""}
                                help={<span className="text-red-300 text-xs">{errors.password_confirmation}</span>}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="text-slate-400" />}
                                    placeholder="Konfirmasi password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData("password_confirmation", e.target.value)}
                                    size="large"
                                />
                            </Form.Item>

                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                size="large"
                                loading={processing}
                                className="!bg-emerald-500 hover:!bg-emerald-600 !border-emerald-500 !h-12 font-semibold"
                            >
                                Daftar
                            </Button>
                        </Form>

                        <Divider className="!border-white/20 !text-slate-400 text-xs">atau</Divider>

                        <div className="text-center">
                            <Text className="!text-slate-400 text-sm">
                                Sudah punya akun?{" "}
                                <Link href={route("login")} className="text-emerald-400 hover:text-emerald-300 font-medium">
                                    Masuk
                                </Link>
                            </Text>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
}
