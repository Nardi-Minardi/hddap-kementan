<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

$debug = filter_var(getenv('APP_DEBUG') ?: 'false', FILTER_VALIDATE_BOOL);

try {
    if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
        require $maintenance;
    }

    require __DIR__.'/../vendor/autoload.php';

    /** @var Application $app */
    $app = require_once __DIR__.'/../bootstrap/app.php';

    $app->handleRequest(Request::capture());
} catch (Throwable $e) {
    error_log('[Laravel] '.$e->getMessage());
    error_log($e->getTraceAsString());

    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');

    if ($debug) {
        echo "Error: {$e->getMessage()}\n\n";
        echo $e->getTraceAsString();
    } else {
        echo 'Internal Server Error';
    }
}
