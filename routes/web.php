<?php

use App\Http\Controllers\ApiDocumentationController;
use App\Http\Controllers\DashboardRedirectController;
use App\Http\Controllers\Frontend\LogframeController;
use App\Http\Controllers\Frontend\StatistikController;
use App\Http\Controllers\Frontend\WelcomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', [WelcomeController::class, 'index']);

Route::get('/api/documentation', [ApiDocumentationController::class, 'ui'])->name('api.documentation');
Route::get('/api/docs/openapi.json', [ApiDocumentationController::class, 'spec'])->name('api.openapi');

Route::get('/logframe', [LogframeController::class, 'index'])->name('logframe');
Route::get('/statistik', [StatistikController::class, 'index'])->name('statistik');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', DashboardRedirectController::class)->name('dashboard');
});

require __DIR__.'/admin.php';
require __DIR__.'/user.php';
require __DIR__.'/auth.php';
