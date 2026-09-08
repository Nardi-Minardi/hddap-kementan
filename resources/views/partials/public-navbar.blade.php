@php
    $navItems = [
        ['label' => 'Beranda', 'href' => url('/#beranda')],
        ['label' => 'Fitur', 'href' => url('/#fitur')],
        ['label' => 'Berita', 'href' => url('/#berita')],
        ['label' => 'Logframe', 'href' => route('logframe'), 'active' => request()->routeIs('logframe')],
        [
            'label' => 'Dashboard',
            'active' => request()->routeIs('sebaran-cpcl', 'statistik'),
            'children' => [
                ['label' => 'Sebaran CPCL', 'href' => route('sebaran-cpcl'), 'active' => request()->routeIs('sebaran-cpcl')],
                ['label' => 'Statistik', 'href' => route('statistik'), 'active' => request()->routeIs('statistik')],
            ],
        ],
        ['label' => 'Dokumen', 'href' => route('dokumen-kegiatan'), 'active' => request()->routeIs('dokumen-kegiatan')],
        ['label' => 'Tentang', 'href' => url('/#tentang')],
    ];
@endphp

<nav id="public-navbar" class="public-navbar-glow fixed inset-x-0 top-0 z-50 border-b border-white/60 bg-white/85 backdrop-blur-md transition-all duration-300">
    <div class="px-4 sm:px-6 lg:px-16">
        <div class="flex h-16 items-center justify-between">
            <a href="{{ url('/') }}" class="flex items-center gap-3">
                <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600">
                    <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <p class="text-sm font-bold leading-tight text-gray-900">HDDAP</p>
                    <p class="text-[10px] leading-tight text-gray-500">Kementerian Pertanian RI</p>
                </div>
            </a>

            <div class="flex items-center gap-6">
                <div class="hidden lg:flex items-center gap-6">
                    @foreach ($navItems as $item)
                        @if (!empty($item['children']))
                            <div class="public-nav-dropdown relative group">
                                <button
                                    type="button"
                                    class="inline-flex h-10 items-center gap-1 border-b-2 text-base font-medium transition hover:border-green-300 hover:text-green-600 {{ !empty($item['active']) ? 'border-green-600 text-green-700' : 'border-transparent text-gray-600' }}"
                                >
                                    {{ $item['label'] }}
                                    <svg class="h-4 w-4 transition group-hover:rotate-180 group-focus-within:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <div class="public-nav-dropdown-menu invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                                    <div class="min-w-[220px] overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                                        @foreach ($item['children'] as $child)
                                            <a
                                                href="{{ $child['href'] }}"
                                                class="block px-4 py-2.5 text-sm font-medium transition hover:bg-green-50 hover:text-green-700 {{ !empty($child['active']) ? 'bg-green-50 text-green-700' : 'text-gray-700' }}"
                                            >
                                                {{ $child['label'] }}
                                            </a>
                                        @endforeach
                                    </div>
                                </div>
                            </div>
                        @else
                            <a
                                href="{{ $item['href'] }}"
                                class="inline-flex h-10 items-center border-b-2 text-base font-medium transition hover:border-green-300 hover:text-green-600 {{ !empty($item['active']) ? 'border-green-600 text-green-700' : 'border-transparent text-gray-600' }}"
                            >
                                {{ $item['label'] }}
                            </a>
                        @endif
                    @endforeach
                </div>

                <div class="flex shrink-0 items-center gap-2">
                    @auth
                        <a
                            href="{{ route('dashboard') }}"
                            class="hidden h-10 items-center justify-center rounded-lg bg-green-600 px-4 text-sm font-semibold leading-none text-white shadow-sm transition hover:bg-green-700 lg:inline-flex"
                        >
                            Dashboard
                        </a>
                    @else
                        @if (Route::has('login'))
                            <a href="{{ route('login') }}" class="hidden h-10 items-center justify-center rounded-lg border border-gray-200 px-4 text-sm font-semibold leading-none text-gray-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700 lg:inline-flex">
                                Masuk
                            </a>
                        @endif
                        @if (Route::has('register'))
                            <a href="{{ route('register') }}" class="hidden h-10 items-center justify-center rounded-lg bg-green-600 px-4 text-sm font-semibold leading-none text-white shadow-sm transition hover:bg-green-700 lg:inline-flex">
                                Daftar
                            </a>
                        @endif
                    @endauth

                    <button
                        type="button"
                        id="mobile-menu-toggle"
                        class="ml-1 lg:hidden text-gray-700"
                        aria-label="Toggle menu"
                    >
                        <svg id="mobile-menu-icon-open" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <svg id="mobile-menu-icon-close" class="hidden h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</nav>

<div
    id="mobile-menu-backdrop"
    class="fixed inset-0 z-[55] bg-black/50 opacity-0 pointer-events-none transition-opacity duration-300 lg:hidden"
></div>

<div
    id="mobile-menu"
    class="fixed left-0 top-0 z-[60] flex h-full w-72 max-w-[85vw] -translate-x-full flex-col bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden"
>
    <div class="flex h-16 items-center justify-between border-b border-gray-100 px-4">
        <div class="flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600">
                <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <p class="text-sm font-bold text-gray-900">HDDAP</p>
        </div>
        <button
            type="button"
            id="mobile-menu-close"
            aria-label="Tutup menu"
            class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100"
        >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>

    <nav class="flex-1 overflow-y-auto px-4 py-4">
        @foreach ($navItems as $item)
            @if (!empty($item['children']))
                <div class="mobile-nav-group mb-1">
                    <button
                        type="button"
                        class="mobile-nav-group-toggle flex w-full items-center justify-between rounded-lg border-b-2 px-3 py-3 text-base font-medium transition hover:bg-green-50 hover:text-green-700 {{ !empty($item['active']) ? 'border-green-600 bg-green-50 text-green-700' : 'border-transparent text-gray-700' }}"
                    >
                        <span>{{ $item['label'] }}</span>
                        <svg class="mobile-nav-group-icon h-4 w-4 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div class="mobile-nav-group-items ml-3 mt-1 hidden space-y-1 border-l-2 border-green-100 pl-3">
                        @foreach ($item['children'] as $child)
                            <a
                                href="{{ $child['href'] }}"
                                class="block rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-green-50 hover:text-green-700 {{ !empty($child['active']) ? 'bg-green-50 text-green-700' : 'text-gray-600' }}"
                            >
                                {{ $child['label'] }}
                            </a>
                        @endforeach
                    </div>
                </div>
            @else
                <a
                    href="{{ $item['href'] }}"
                    class="block rounded-lg border-b-2 px-3 py-3 text-base font-medium transition hover:bg-green-50 hover:text-green-700 {{ !empty($item['active']) ? 'border-green-600 bg-green-50 text-green-700' : 'border-transparent text-gray-700' }}"
                >
                    {{ $item['label'] }}
                </a>
            @endif
        @endforeach
    </nav>

    <div class="space-y-2 border-t border-gray-100 px-4 py-4">
        @auth
            <a
                href="{{ route('dashboard') }}"
                class="block rounded-lg bg-green-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-green-700"
            >
                Dashboard
            </a>
        @else
            @if (Route::has('login'))
                <a href="{{ route('login') }}" class="block rounded-lg border border-gray-200 px-4 py-2.5 text-center text-sm font-medium text-gray-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700">
                    Masuk
                </a>
            @endif
            @if (Route::has('register'))
                <a href="{{ route('register') }}" class="block rounded-lg bg-green-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-green-700">
                    Daftar
                </a>
            @endif
        @endauth
    </div>
</div>

<script>
    (function () {
        const menu = document.getElementById('mobile-menu');
        const backdrop = document.getElementById('mobile-menu-backdrop');
        const toggle = document.getElementById('mobile-menu-toggle');
        const closeButton = document.getElementById('mobile-menu-close');
        const iconOpen = document.getElementById('mobile-menu-icon-open');
        const iconClose = document.getElementById('mobile-menu-icon-close');

        if (!menu || !backdrop || !toggle) {
            return;
        }

        const openMenu = () => {
            menu.classList.remove('-translate-x-full', 'pointer-events-none');
            backdrop.classList.remove('opacity-0', 'pointer-events-none');
            document.body.style.overflow = 'hidden';
            iconOpen?.classList.add('hidden');
            iconClose?.classList.remove('hidden');
        };

        const closeMenu = () => {
            menu.classList.add('-translate-x-full', 'pointer-events-none');
            backdrop.classList.add('opacity-0', 'pointer-events-none');
            document.body.style.overflow = '';
            iconOpen?.classList.remove('hidden');
            iconClose?.classList.add('hidden');
        };

        toggle.addEventListener('click', () => {
            if (menu.classList.contains('-translate-x-full')) {
                openMenu();
            } else {
                closeMenu();
            }
        });

        closeButton?.addEventListener('click', closeMenu);
        backdrop.addEventListener('click', closeMenu);

        menu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeMenu);
        });

        menu.querySelectorAll('.mobile-nav-group-toggle').forEach((button) => {
            button.addEventListener('click', () => {
                const group = button.closest('.mobile-nav-group');
                const items = group?.querySelector('.mobile-nav-group-items');
                const icon = group?.querySelector('.mobile-nav-group-icon');

                if (!items) {
                    return;
                }

                const expanded = !items.classList.contains('hidden');
                items.classList.toggle('hidden', expanded);
                icon?.classList.toggle('rotate-180', !expanded);
            });
        });
    })();
</script>
