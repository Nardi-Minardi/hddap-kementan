<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'Statistik') — {{ config('app.name', 'Kementan') }}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    @vite(['resources/css/app.css'])
    @stack('styles')
</head>
<body class="min-h-full overflow-x-hidden font-sans antialiased">
    @include('partials.public-navbar')

    @yield('content')

    @include('partials.public-footer')

    @stack('scripts')
</body>
</html>
