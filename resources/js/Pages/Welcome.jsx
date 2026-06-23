import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

const heroVideos = [
    '/videos/hero-1.mp4',
    '/videos/hero-2.mp4',
    '/videos/hero-3.mp4',
];

const aiTaniStats = [
    { label: 'Total Petani Terdaftar', value: '1.248.390', color: 'text-green-300' },
    { label: 'Kelompok Tani Aktif', value: '84.720', color: 'text-emerald-300' },
    { label: 'Kabupaten/Kota Tercover', value: '514', color: 'text-teal-300' },
];

export default function Welcome({ auth, canLogin, canRegister }) {
    const { social } = usePage().props;
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [aiTaniModalOpen, setAiTaniModalOpen] = useState(false);
    const [showAiTaniStats, setShowAiTaniStats] = useState(false);
    const [activeHeroSlide, setActiveHeroSlide] = useState(0);
    const aiTaniVideoRef = useRef(null);
    const heroVideoRefs = useRef([]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [menuOpen]);

    useEffect(() => {
        heroVideos.forEach((_, index) => {
            const video = heroVideoRefs.current[index];
            if (!video) {
                return;
            }

            if (index === activeHeroSlide) {
                video.currentTime = 0;
                video.play().catch(() => {});
            } else {
                video.pause();
                video.currentTime = 0;
            }
        });
    }, [activeHeroSlide]);

    const goToHeroSlide = (index) => {
        setActiveHeroSlide(index);
    };

    const goToNextHeroSlide = () => {
        setActiveHeroSlide((current) => (current + 1) % heroVideos.length);
    };

    const goToPrevHeroSlide = () => {
        setActiveHeroSlide((current) => (current - 1 + heroVideos.length) % heroVideos.length);
    };

    const openAiTaniModal = () => {
        setShowAiTaniStats(false);
        const video = aiTaniVideoRef.current;
        if (video) {
            video.currentTime = 0;
            video.play().catch(() => {});
        }
        setAiTaniModalOpen(true);
    };

    const closeAiTaniModal = () => {
        const video = aiTaniVideoRef.current;
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
        setShowAiTaniStats(false);
        setAiTaniModalOpen(false);
    };

    const handleAiTaniTimeUpdate = () => {
        const video = aiTaniVideoRef.current;
        if (video && video.currentTime >= 6) {
            setShowAiTaniStats(true);
        }
    };

    const features = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            title: 'Data Petani',
            desc: 'Pengelolaan data petani secara terpusat, akurat, dan mudah diakses kapan saja.',
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            title: 'Kelompok Tani',
            desc: 'Manajemen kelompok tani yang terstruktur untuk meningkatkan koordinasi dan produktivitas.',
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            ),
            title: 'Kartu Keluarga Petani',
            desc: 'Registrasi dan pencatatan kartu keluarga petani untuk mendukung program bantuan yang tepat sasaran.',
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            title: 'Laporan & Statistik',
            desc: 'Dashboard analitik lengkap untuk pemantauan dan pelaporan data pertanian secara real-time.',
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            title: 'Pemetaan Wilayah',
            desc: 'Pengelolaan data wilayah dari tingkat provinsi hingga desa untuk distribusi informasi yang akurat.',
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            ),
            title: 'Keamanan Data',
            desc: 'Sistem autentikasi dan otorisasi berlapis untuk menjaga keamanan dan kerahasiaan data.',
        },
    ];

    const stats = [
        { value: '34', label: 'Provinsi', suffix: '' },
        { value: '500', label: 'Kabupaten/Kota', suffix: '+' },
        { value: '1 Juta', label: 'Data Petani', suffix: '+' },
        { value: '99.9', label: 'Uptime Sistem', suffix: '%' },
    ];

    const navItems = [
        { label: 'Beranda', href: '#beranda' },
        { label: 'Fitur', href: '#fitur' },
        { label: 'Statistik', href: '/statistik', external: true },
        { label: 'Tentang', href: '#tentang' },
    ];

    return (
        <>
            <Head title="Sistem Informasi Pertanian — Kementan RI" />
            <div className="min-h-screen bg-white font-sans antialiased">

                {/* ── Navbar ── */}
                <nav
                    className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
                        scrolled
                            ? 'bg-white/95 backdrop-blur-md shadow-sm'
                            : 'bg-transparent'
                    }`}
                >
                    <div className="px-4 sm:px-6 lg:px-16">
                        <div className="flex h-16 items-center justify-between">
                            {/* Logo */}
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600">
                                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className={`text-sm font-bold leading-tight ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                                        HDDAP
                                    </p>
                                    <p className={`text-[10px] leading-tight ${scrolled ? 'text-gray-500' : 'text-green-200'}`}>
                                        Kementerian Pertanian RI
                                    </p>
                                </div>
                            </div>

                            {/* Nav links + Auth */}
                            <div className="flex items-center gap-6">
                                <div className="hidden lg:flex items-center gap-6">
                                    {navItems.map((item) => (
                                        <a
                                            key={item.label}
                                            href={item.href}
                                            className={`text-sm font-medium transition hover:text-green-400 ${
                                                scrolled ? 'text-gray-600' : 'text-white/80'
                                            }`}
                                        >
                                            {item.label}
                                        </a>
                                    ))}
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="hidden lg:flex items-center gap-3">
                                        {auth.user ? (
                                            <Link
                                                href={route('dashboard')}
                                                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
                                            >
                                                Dashboard
                                            </Link>
                                        ) : (
                                            <>
                                                {canLogin && (
                                                    <Link
                                                        href={route('login')}
                                                        className={`text-sm font-medium transition ${
                                                            scrolled ? 'text-gray-700 hover:text-green-700' : 'text-white/90 hover:text-white'
                                                        }`}
                                                    >
                                                        Masuk
                                                    </Link>
                                                )}
                                                {canRegister && (
                                                    <Link
                                                        href={route('register')}
                                                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
                                                    >
                                                        Daftar
                                                    </Link>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* Mobile menu toggle */}
                                    <button
                                        className="ml-1 lg:hidden"
                                        onClick={() => setMenuOpen(!menuOpen)}
                                        aria-label="Toggle menu"
                                    >
                                        <svg className={`h-6 w-6 ${scrolled ? 'text-gray-700' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {menuOpen
                                                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                            }
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className={`fixed inset-0 z-[55] bg-black/50 transition-opacity duration-300 lg:hidden ${
                            menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
                        }`}
                        onClick={() => setMenuOpen(false)}
                        aria-hidden={!menuOpen}
                    />

                    <div
                        className={`fixed left-0 top-0 z-[60] flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
                            menuOpen ? 'translate-x-0' : 'pointer-events-none -translate-x-full'
                        }`}
                        aria-hidden={!menuOpen}
                    >
                        <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600">
                                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-bold text-gray-900">HDDAP</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setMenuOpen(false)}
                                aria-label="Tutup menu"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <nav className="flex-1 overflow-y-auto px-4 py-4">
                            {navItems.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="block rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-green-50 hover:text-green-700"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {item.label}
                                </a>
                            ))}
                        </nav>

                        <div className="space-y-2 border-t border-gray-100 px-4 py-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="block rounded-lg bg-green-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-green-700"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    {canLogin && (
                                        <Link
                                            href={route('login')}
                                            className="block rounded-lg border border-gray-200 px-4 py-2.5 text-center text-sm font-medium text-gray-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            Masuk
                                        </Link>
                                    )}
                                    {canRegister && (
                                        <Link
                                            href={route('register')}
                                            className="block rounded-lg bg-green-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-green-700"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            Daftar
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* ── Hero ── */}
                <section
                    id="beranda"
                    className="relative flex min-h-screen items-center overflow-hidden"
                >
                    <div className="absolute inset-0">
                        {heroVideos.map((src, index) => (
                            <video
                                key={src}
                                ref={(element) => {
                                    heroVideoRefs.current[index] = element;
                                }}
                                src={src}
                                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                                    index === activeHeroSlide ? 'opacity-100' : 'opacity-0'
                                }`}
                                muted
                                playsInline
                                preload="auto"
                                onEnded={goToNextHeroSlide}
                            />
                        ))}
                        <div className="absolute inset-0 bg-gradient-to-r from-green-950/90 via-green-900/75 to-green-900/50" />
                    </div>

                    <div className="relative z-10 w-full px-4 py-32 sm:px-6 lg:px-16">
                        <div className="max-w-3xl text-center lg:text-left">
                            <span className="inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-green-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                                Sistem Informasi Terpadu
                            </span>
                            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                                Digitalisasi Data
                                <span className="block text-green-300">Pertanian Indonesia</span>
                            </h1>
                            <p className="mt-6 text-lg leading-relaxed text-green-100/80">
                                Platform pengelolaan data petani, kelompok tani, dan kartu keluarga petani
                                secara terintegrasi untuk mendukung ketahanan pangan nasional.
                            </p>
                            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-green-800 shadow-lg transition hover:bg-green-50 hover:shadow-xl"
                                    >
                                        Buka Dashboard
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </Link>
                                ) : (
                                    <>
                                        {canLogin && (
                                            <Link
                                                href={route('login')}
                                                className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-green-800 shadow-lg transition hover:bg-green-50 hover:shadow-xl"
                                            >
                                                Masuk Sekarang
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </Link>
                                        )}
                                        {canRegister && (
                                            <Link
                                                href={route('register')}
                                                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                                            >
                                                Daftar Akun
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-4">
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={goToPrevHeroSlide}
                                    aria-label="Video sebelumnya"
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-sm transition hover:bg-black/40"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <div className="flex items-center gap-2">
                                    {heroVideos.map((src, index) => (
                                        <button
                                            key={src}
                                            type="button"
                                            onClick={() => goToHeroSlide(index)}
                                            aria-label={`Video ${index + 1}`}
                                            className={`h-2.5 rounded-full transition-all duration-300 ${
                                                index === activeHeroSlide
                                                    ? 'w-8 bg-white'
                                                    : 'w-2.5 bg-white/40 hover:bg-white/70'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={goToNextHeroSlide}
                                    aria-label="Video berikutnya"
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-sm transition hover:bg-black/40"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex flex-col items-center gap-1 text-green-300/60">
                                <span className="text-xs">Scroll</span>
                                <svg className="h-4 w-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Stats ── */}
                <section id="statistik" className="bg-green-700 py-12">
                    <div className="px-4 sm:px-6 lg:px-16">
                        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                            {stats.map((s) => (
                                <div key={s.label} className="text-center">
                                    <p className="text-3xl font-extrabold text-white">
                                        {s.value}<span className="text-green-300">{s.suffix}</span>
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-green-200">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Features ── */}
                <section
                    id="fitur"
                    className="relative overflow-hidden bg-cover bg-center bg-no-repeat py-24"
                    style={{ backgroundImage: "url('/images/bg-fitur-section.png')" }}
                >
                    <button
                        type="button"
                        onClick={openAiTaniModal}
                        aria-label="Sapa AI Tani"
                        className="group absolute bottom-0 right-0 z-20 hidden cursor-pointer sm:block md:right-2 xl:right-8"
                    >
                        <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-green-700 px-3 py-1 text-xs font-semibold text-white opacity-0 shadow-lg transition-all duration-300 group-hover:-translate-y-1 group-hover:opacity-100">
                            Klik untuk menyapa!
                        </span>
                        <img
                            src="/images/ai-tani.png"
                            alt="AI Tani"
                            className="w-40 object-contain drop-shadow-xl transition duration-300 group-hover:scale-110 group-hover:-translate-y-2 group-active:scale-105 md:w-52 lg:w-64 xl:w-80"
                        />
                    </button>

                    <div className="relative z-10 px-4 sm:px-6 lg:px-16">
                        <div className="text-center lg:max-w-3xl lg:mx-auto">
                            <span className="text-xs font-bold uppercase tracking-widest text-green-600">Fitur Unggulan</span>
                            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                Semua yang Anda butuhkan<br className="hidden sm:block" /> dalam satu platform
                            </h2>
                            <p className="mt-4 text-base text-gray-500">
                                Dirancang khusus untuk mendukung pengelolaan data sektor pertanian Indonesia secara efisien, akurat, dan terintegrasi.
                            </p>
                        </div>

                        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:pr-44 xl:pr-72">
                            {features.map((f) => (
                                <div
                                    key={f.title}
                                    className="group relative overflow-hidden rounded-2xl bg-white/95 p-8 shadow-sm ring-1 ring-gray-200 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-green-500/30"
                                >
                                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-50 text-green-600 transition group-hover:bg-green-600 group-hover:text-white">
                                        {f.icon}
                                    </div>
                                    <h3 className="mt-5 text-lg font-bold text-gray-900">{f.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-gray-500">{f.desc}</p>
                                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-green-500 transition-all duration-300 group-hover:w-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── CTA ── */}
                <section id="tentang" className="relative overflow-hidden bg-gradient-to-br from-green-800 to-emerald-700 py-24">
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-green-600/30 blur-3xl" />
                        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/30 blur-3xl" />
                    </div>
                    <div className="relative px-4 text-center sm:px-6 lg:px-16">
                        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                            Mulai kelola data pertanian
                            <span className="block text-green-300">Indonesia dengan lebih baik</span>
                        </h2>
                        <p className="mt-5 text-lg text-green-100/80">
                            Bergabunglah bersama ribuan petugas pertanian di seluruh Indonesia yang telah menggunakan SIPERTAN untuk mewujudkan pertanian yang modern dan berdaya saing.
                        </p>
                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-green-800 shadow-lg transition hover:bg-green-50"
                                >
                                    Buka Dashboard
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                            ) : (
                                <>
                                    {canRegister && (
                                        <Link
                                            href={route('register')}
                                            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-green-800 shadow-lg transition hover:bg-green-50"
                                        >
                                            Daftar Sekarang — Gratis
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </Link>
                                    )}
                                    {canLogin && (
                                        <Link
                                            href={route('login')}
                                            className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-sm font-semibold text-white transition hover:bg-white/20"
                                        >
                                            Sudah punya akun? Masuk
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* ── Footer ── */}
                <footer className="bg-gray-900 py-10 text-center text-sm text-gray-400">
                    <div className="flex flex-col items-center gap-3 px-4 sm:px-6 lg:px-16">
                        <div className="flex items-center gap-2 font-semibold text-white">
                            <div className="flex h-6 w-6 items-center justify-center rounded bg-green-600">
                                <svg className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            HDDAP
                        </div>
                        <p>Sistem Informasi Pertanian — Kementerian Pertanian Republik Indonesia</p>
                        {(social?.youtube || social?.instagram) && (
                            <div className="flex items-center justify-center gap-4">
                                {social?.youtube && (
                                    <a
                                        href={social.youtube}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="YouTube HDDAP Horti"
                                        className="text-gray-400 transition hover:text-red-500"
                                    >
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                        </svg>
                                    </a>
                                )}
                                {social?.instagram && (
                                    <a
                                        href={social.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Instagram HDDAP Horti"
                                        className="text-gray-400 transition hover:text-pink-500"
                                    >
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                        </svg>
                                    </a>
                                )}
                            </div>
                        )}
                        <p className="text-gray-600">© {new Date().getFullYear()} Kementan RI. Hak cipta dilindungi undang-undang.</p>
                    </div>
                </footer>
            </div>

            <div
                className={`fixed inset-0 z-[60] flex items-center justify-center px-4 py-6 transition-opacity duration-200 ${
                    aiTaniModalOpen ? 'visible opacity-100' : 'invisible pointer-events-none opacity-0'
                }`}
                aria-hidden={!aiTaniModalOpen}
            >
                <button
                    type="button"
                    aria-label="Tutup"
                    className="absolute inset-0 bg-gray-500/75"
                    onClick={closeAiTaniModal}
                    tabIndex={aiTaniModalOpen ? 0 : -1}
                />
                <div
                    className={`relative z-10 flex w-full overflow-hidden rounded-xl bg-gradient-to-br from-green-900 via-green-800 to-emerald-800 shadow-xl transition-all duration-500 ease-out ${
                        showAiTaniStats ? 'max-w-5xl flex-col sm:flex-row' : 'max-w-xl'
                    }`}
                >
                    <button
                        type="button"
                        onClick={closeAiTaniModal}
                        aria-label="Tutup"
                        className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                        tabIndex={aiTaniModalOpen ? 0 : -1}
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div
                        className={`relative overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-emerald-800 transition-all duration-500 ${
                            showAiTaniStats
                                ? 'h-[300px] w-full sm:h-[420px] sm:w-1/2 lg:h-[720px]'
                                : 'h-[360px] w-full sm:h-[480px] lg:h-[780px]'
                        }`}
                    >
                        <video
                            ref={aiTaniVideoRef}
                            src="/videos/ai-tani-menyapa.mp4"
                            className="h-full w-full object-cover"
                            playsInline
                            preload="auto"
                            onTimeUpdate={handleAiTaniTimeUpdate}
                        />
                    </div>

                    <div
                        className={`overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-emerald-800 transition-all duration-500 ease-out ${
                            showAiTaniStats
                                ? 'h-auto w-full opacity-100 sm:h-[420px] sm:w-1/2 lg:h-[720px]'
                                : 'max-h-0 w-0 opacity-0 sm:max-h-0'
                        }`}
                    >
                        <div className="flex h-full min-h-0 flex-col justify-center p-5 sm:p-6">
                            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md sm:p-6">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="h-3 w-3 rounded-full bg-red-400" />
                                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                                    <div className="h-3 w-3 rounded-full bg-green-400" />
                                </div>
                                {aiTaniStats.map((item) => (
                                    <div key={item.label} className="mt-4 rounded-xl bg-white/10 p-4 first:mt-0">
                                        <p className="text-xs text-green-200/70">{item.label}</p>
                                        <p className={`mt-1 text-2xl font-bold ${item.color}`}>{item.value}</p>
                                    </div>
                                ))}
                                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                                    <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-green-400 to-emerald-300 animate-pulse" />
                                </div>
                                <p className="mt-2 text-xs text-green-200/60">Sinkronisasi data real-time...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
