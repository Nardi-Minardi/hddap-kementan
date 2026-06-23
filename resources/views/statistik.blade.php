@extends('layouts.public')

@section('title', 'Statistik')

@section('content')
    <main class="pt-16">
        <div class="px-4 py-6 sm:px-6 lg:px-16">
            <div class="mb-4">
                <h1 class="text-2xl font-bold text-gray-900">Dashboard Statistik</h1>
                <p class="mt-1 text-sm text-gray-500">Dashboard Progress HDDAP Project — Kementerian Pertanian RI</p>
            </div>

            <div class="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div
                    id="iframe-loader"
                    class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 transition-opacity duration-300"
                >
                    <div class="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md">
                        <div class="h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-600"></div>
                    </div>
                    <p class="mt-4 text-sm font-semibold text-green-800">Memuat dashboard statistik...</p>
                    <p class="mt-1 text-xs text-green-600/80">Mohon tunggu sebentar</p>
                </div>

                <iframe
                    id="statistik-iframe"
                    src="{{ $dashboardUrl }}"
                    title="Dashboard Progress HDDAP Project"
                    class="block h-[calc(100vh-180px)] min-h-[750px] w-full border-0 lg:h-[calc(100vh-16px)] lg:min-h-[1500px]"
                    allowfullscreen
                ></iframe>
            </div>
        </div>
    </main>
@endsection

@push('scripts')
    <script>
        document.getElementById('statistik-iframe').addEventListener('load', function () {
            const loader = document.getElementById('iframe-loader');
            loader.classList.add('opacity-0', 'pointer-events-none');
            setTimeout(() => loader.classList.add('hidden'), 300);
        });
    </script>
@endpush
