import PublicLayout from '@/Layouts/PublicLayout';
import PdfFlipbook from '@/Components/PdfFlipbook';
import { Head, router } from '@inertiajs/react';
import { FilePdfOutlined } from '@ant-design/icons';
import { Empty, Typography } from 'antd';

const { Title, Text, Paragraph } = Typography;

function formatTanggal(value) {
    if (!value) return '';
    return new Date(value).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric',
    });
}

export default function DokumenKegiatanIndex({ dokumen = [], selected = null }) {
    const selectDokumen = (slug) => {
        router.get(route('dokumen-kegiatan'), { dokumen: slug }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <PublicLayout>
            <Head title="Dokumen Kegiatan" />

            <div className="px-4 py-8 sm:px-6 lg:px-16">
                {dokumen.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white py-16 shadow-sm">
                        <Empty description="Belum ada dokumen kegiatan yang dipublikasikan." />
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr]">
                        <aside className="space-y-3">
                            <Text className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                Daftar Dokumen
                            </Text>
                            <div className="space-y-2">
                                {dokumen.map((item) => {
                                    const active = selected?.slug === item.slug;

                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => selectDokumen(item.slug)}
                                            className={`w-full rounded-xl border p-3 text-left transition ${
                                                active
                                                    ? 'border-green-500 bg-green-50 shadow-sm ring-1 ring-green-200'
                                                    : 'border-gray-200 bg-white hover:border-green-200 hover:bg-green-50/50'
                                            }`}
                                        >
                                            <div className="flex gap-3">
                                                {item.cover_url ? (
                                                    <img
                                                        src={item.cover_url}
                                                        alt=""
                                                        className="h-16 w-12 shrink-0 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-16 w-12 shrink-0 items-center justify-center rounded-lg bg-red-50">
                                                        <FilePdfOutlined className="text-lg text-red-500" />
                                                    </div>
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <p className={`line-clamp-2 text-sm font-semibold ${active ? 'text-green-800' : 'text-gray-800'}`}>
                                                        {item.judul}
                                                    </p>
                                                    {item.published_at && (
                                                        <p className="mt-1 text-xs text-gray-400">
                                                            {formatTanggal(item.published_at)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </aside>

                        <section className="min-w-0">
                            {selected ? (
                                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                                    <div className="mb-5 border-b border-gray-100 pb-4">
                                        <Title level={4} className="!mb-1 !text-gray-900">
                                            {selected.judul}
                                        </Title>
                                        {selected.deskripsi && (
                                            <Paragraph className="!mb-0 !text-gray-500">
                                                {selected.deskripsi}
                                            </Paragraph>
                                        )}
                                    </div>

                                    <PdfFlipbook
                                        key={selected.slug}
                                        pdfUrl={selected.file_url}
                                        title={selected.judul}
                                    />
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-gray-200 bg-white py-16 shadow-sm">
                                    <Empty description="Pilih dokumen dari daftar di sebelah kiri." />
                                </div>
                            )}
                        </section>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
