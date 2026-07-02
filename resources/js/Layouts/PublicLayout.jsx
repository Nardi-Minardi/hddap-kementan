import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const navItems = [
    { label: 'Beranda', href: '/#beranda' },
    { label: 'Fitur', href: '/#fitur' },
    { label: 'Berita', href: '/#berita' },
    { label: 'Logframe', href: route('logframe'), routeName: 'logframe' },
    { label: 'Statistik', href: route('statistik'), routeName: 'statistik' },
    { label: 'Tentang', href: '/#tentang' },
];

function isNavActive(item) {
    if (item.routeName) {
        return route().current(item.routeName);
    }

    return false;
}

export default function PublicLayout({ children }) {
    const { auth, social } = usePage().props;
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.removeProperty('overflow');
        }

        return () => {
            document.body.style.removeProperty('overflow');
        };
    }, [menuOpen]);

    const navLinkClass = (item, mobile = false) => {
        const active = isNavActive(item);

        if (mobile) {
            return active
                ? 'border-green-600 bg-green-50 text-green-700'
                : 'border-transparent text-gray-700 hover:bg-green-50 hover:text-green-700';
        }

        return active
            ? 'border-green-600 text-green-700'
            : 'border-transparent text-gray-600 hover:border-green-300 hover:text-green-600';
    };

    return (
        <div className="min-h-screen overflow-x-hidden bg-gray-50 font-sans antialiased">
            <nav className="fixed inset-x-0 top-0 z-50 bg-white/95 shadow-sm backdrop-blur-md">
                <div className="px-4 sm:px-6 lg:px-16">
                    <div className="flex h-16 items-center justify-between">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600">
                                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold leading-tight text-gray-900">HDDAP</p>
                                <p className="text-[10px] leading-tight text-gray-500">Kementerian Pertanian RI</p>
                            </div>
                        </Link>

                        <div className="flex items-center gap-6">
                            <div className="hidden items-center gap-6 lg:flex">
                                {navItems.map((item) => (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        className={`inline-flex h-10 items-center border-b-2 text-sm font-medium transition ${navLinkClass(item)}`}
                                    >
                                        {item.label}
                                    </a>
                                ))}
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                                {auth?.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="hidden h-10 items-center justify-center rounded-lg bg-green-600 px-4 text-sm font-semibold leading-none text-white shadow-sm transition hover:bg-green-700 lg:inline-flex"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="hidden h-10 items-center justify-center rounded-lg border border-gray-200 px-4 text-sm font-semibold leading-none text-gray-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700 lg:inline-flex"
                                        >
                                            Masuk
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="hidden h-10 items-center justify-center rounded-lg bg-green-600 px-4 text-sm font-semibold leading-none text-white shadow-sm transition hover:bg-green-700 lg:inline-flex"
                                        >
                                            Daftar
                                        </Link>
                                    </>
                                )}

                                {!menuOpen && (
                                    <button
                                        type="button"
                                        className="ml-1 text-gray-700 lg:hidden"
                                        onClick={() => setMenuOpen(true)}
                                        aria-label="Buka menu"
                                    >
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div
                className={`fixed inset-0 z-[55] bg-black/50 transition-opacity duration-300 lg:hidden ${
                    menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
                onClick={() => setMenuOpen(false)}
                aria-hidden={!menuOpen}
            />

            <div
                className={`fixed inset-y-0 left-0 z-[60] flex h-dvh w-72 max-w-[85vw] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
                    menuOpen ? 'translate-x-0' : 'pointer-events-none -translate-x-full'
                }`}
                aria-hidden={!menuOpen}
            >
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 px-4">
                    <p className="text-sm font-bold text-gray-900">HDDAP</p>
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
                            className={`block rounded-lg border-b-2 px-3 py-3 text-sm font-medium transition ${navLinkClass(item, true)}`}
                            onClick={() => setMenuOpen(false)}
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                <div className="shrink-0 space-y-2 border-t border-gray-100 px-4 py-4">
                    {auth?.user ? (
                        <Link
                            href={route('dashboard')}
                            className="block rounded-lg bg-green-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-green-700"
                            onClick={() => setMenuOpen(false)}
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="block rounded-lg border border-gray-200 px-4 py-2.5 text-center text-sm font-medium text-gray-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                                onClick={() => setMenuOpen(false)}
                            >
                                Masuk
                            </Link>
                            <Link
                                href={route('register')}
                                className="block rounded-lg bg-green-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-green-700"
                                onClick={() => setMenuOpen(false)}
                            >
                                Daftar
                            </Link>
                        </>
                    )}
                </div>
            </div>

            <main className="pt-16">{children}</main>

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
                    <p>Horticulture Development in Dryland Areas Project — Kementerian Pertanian Republik Indonesia</p>

                    {(social?.youtube || social?.instagram) && (
                        <div className="flex items-center justify-center gap-4">
                            {social.youtube && (
                                <a href={social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-gray-400 transition hover:text-red-500">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                </a>
                            )}
                            {social.instagram && (
                                <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 transition hover:text-pink-500">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    )}

                    <p className="text-gray-600">&copy; {new Date().getFullYear()} Kementan RI. Hak cipta dilindungi undang-undang.</p>
                </div>
            </footer>
        </div>
    );
}
