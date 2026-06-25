<footer class="bg-gray-900 py-10 text-center text-sm text-gray-400">
    <div class="flex flex-col items-center gap-3 px-4 sm:px-6 lg:px-16">
        <div class="flex items-center gap-2 font-semibold text-white">
            <div class="flex h-6 w-6 items-center justify-center rounded bg-green-600">
                <svg class="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            HDDAP
        </div>
        <p>Horticulture Development in Dryland Areas Project — Kementerian Pertanian Republik Indonesia</p>

        @if (config('services.social.youtube_url') || config('services.social.instagram_url'))
            <div class="flex items-center justify-center gap-4">
                @if ($youtubeUrl = config('services.social.youtube_url'))
                    <a
                        href="{{ $youtubeUrl }}"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="YouTube HDDAP Horti"
                        class="text-gray-400 transition hover:text-red-500"
                    >
                        <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                    </a>
                @endif
                @if ($instagramUrl = config('services.social.instagram_url'))
                    <a
                        href="{{ $instagramUrl }}"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram HDDAP Horti"
                        class="text-gray-400 transition hover:text-pink-500"
                    >
                        <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                        </svg>
                    </a>
                @endif
            </div>
        @endif

        <p class="text-gray-600">&copy; {{ date('Y') }} Kementan RI. Hak cipta dilindungi undang-undang.</p>
    </div>
</footer>
