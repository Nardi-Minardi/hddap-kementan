import { useState } from 'react';
import BeritaKontenRenderer from '@/Components/BeritaKontenRenderer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function formatTanggal(iso) {
    if (!iso) {
        return '';
    }

    return new Date(iso).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default function BeritaSwiper({ items = [] }) {
    const [activeBerita, setActiveBerita] = useState(null);

    if (items.length === 0) {
        return null;
    }

    return (
        <>
            <section id="berita" className="relative overflow-x-clip bg-gray-50 py-24">
                <div
                    className="pointer-events-none absolute inset-0 opacity-40"
                    style={{
                        backgroundImage: "url('/images/bg-wave-pattern.svg')",
                        backgroundRepeat: 'repeat',
                        backgroundSize: '480px 160px',
                    }}
                />
                <div className="relative z-10 px-4 sm:px-6 lg:px-16">
                    <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <span className="text-lg font-bold uppercase tracking-widest text-green-600">
                                Berita Terkini
                            </span>
                            <p className="mt-3 max-w-2xl text-base text-gray-500">
                                Informasi dan perkembangan terbaru seputar program.
                            </p>
                        </div>

                        <div className="relative shrink-0 self-start overflow-hidden rounded-xl border border-green-100/80 shadow-sm sm:self-auto">
                            <div
                                className="absolute inset-0 bg-cover bg-top opacity-90"
                                style={{ backgroundImage: "url('/images/bg-wave-pattern.svg')" }}
                            />
                            <div className="relative flex items-center gap-2 p-3 pt-8">
                                <button
                                    type="button"
                                    aria-label="Berita sebelumnya"
                                    className="berita-swiper-prev flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-green-300 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    aria-label="Berita berikutnya"
                                    className="berita-swiper-next flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-green-300 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-clip">
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            className="berita-swiper !overflow-hidden !pb-14"
                            spaceBetween={24}
                            slidesPerView={1}
                            touchAngle={30}
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            breakpoints={{
                                1024: { slidesPerView: 1.35 },
                                1280: { slidesPerView: 1.5 },
                            }}
                            pagination={{ clickable: true }}
                        navigation={{
                            prevEl: '.berita-swiper-prev',
                            nextEl: '.berita-swiper-next',
                        }}
                        onSwiper={(swiper) => {
                            setTimeout(() => {
                                swiper.params.navigation.prevEl = '.berita-swiper-prev';
                                swiper.params.navigation.nextEl = '.berita-swiper-next';
                                swiper.navigation.destroy();
                                swiper.navigation.init();
                                swiper.navigation.update();
                            });
                        }}
                    >
                        {items.map((item) => (
                            <SwiperSlide key={item.id} className="!h-auto">
                                <article className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-200 md:min-h-[360px] md:flex-row">
                                    <div className="md:w-[45%] lg:w-1/2">
                                        <img
                                            src={item.image_url}
                                            alt={item.judul}
                                            className="h-56 w-full object-cover md:h-full md:min-h-[360px]"
                                        />
                                    </div>

                                    <div className="flex flex-1 flex-col p-6 sm:p-8 md:w-[55%] lg:w-1/2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
                                                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-wide text-green-700">HDDAP</p>
                                                <p className="text-[10px] text-gray-400">Kementerian Pertanian RI</p>
                                            </div>
                                        </div>

                                        {item.published_at && (
                                            <p className="mt-4 text-xs font-medium text-gray-400">
                                                {formatTanggal(item.published_at)}
                                            </p>
                                        )}

                                        <h3 className="mt-3 text-xl font-bold leading-snug text-gray-900 sm:text-2xl">
                                            {item.judul}
                                        </h3>

                                        {item.ringkasan && (
                                            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-500">
                                                {item.ringkasan}
                                            </p>
                                        )}

                                        <div className="mt-auto border-t border-gray-100 pt-6">
                                            <button
                                                type="button"
                                                onClick={() => setActiveBerita(item)}
                                                className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
                                            >
                                                Baca selengkapnya
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            </SwiperSlide>
                        ))}
                        </Swiper>
                    </div>
                </div>
            </section>

            {activeBerita && (
                <div
                    className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                    onClick={() => setActiveBerita(null)}
                    role="presentation"
                >
                    <div
                        className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-sm bg-[#faf9f6] shadow-2xl ring-1 ring-gray-300"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="berita-modal-title"
                    >
                        <button
                            type="button"
                            onClick={() => setActiveBerita(null)}
                            aria-label="Tutup"
                            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-gray-600 shadow transition hover:bg-white hover:text-gray-900"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <img
                            src={activeBerita.image_url}
                            alt={activeBerita.judul}
                            className="h-48 w-full border-b-2 border-gray-900 object-cover sm:h-56"
                        />

                        <div className="border-b border-gray-300 bg-white px-6 py-4 sm:px-10">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-3">
                                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-green-800">
                                    Berita HDDAP
                                </span>
                                {activeBerita.published_at && (
                                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
                                        {formatTanggal(activeBerita.published_at)}
                                    </p>
                                )}
                            </div>
                            <h3
                                id="berita-modal-title"
                                className="mt-4 font-serif text-2xl font-bold leading-tight text-gray-900 sm:text-3xl"
                            >
                                {activeBerita.judul}
                            </h3>
                            {activeBerita.ringkasan && (
                                <p className="mt-3 border-l-4 border-green-700 pl-3 font-serif text-sm font-semibold italic leading-relaxed text-gray-700">
                                    {activeBerita.ringkasan}
                                </p>
                            )}
                        </div>

                        <div className="px-6 pb-8 pt-2 sm:px-10">
                            <BeritaKontenRenderer
                                konten={activeBerita.konten}
                                fotoKegiatan={activeBerita.foto_kegiatan}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
