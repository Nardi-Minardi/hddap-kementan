<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>API Documentation — {{ config('app.name', 'HDDAP') }}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
</head>
<body>
    <div id="app"></div>

    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
    <script>
        Scalar.createApiReference('#app', {
            url: '/api/docs/openapi.json',
            layout: 'modern',
            hideModels: true,
            hideDownloadButton: true,
        });
    </script>
</body>
</html>
