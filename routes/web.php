<?php

use App\Http\Controllers\ApiDocumentationController;
use App\Http\Controllers\DashboardRedirectController;
use App\Http\Controllers\Frontend\DokumenKegiatanController;
use App\Http\Controllers\Frontend\LogframeController;
use App\Http\Controllers\Frontend\SebaranCpclController;
use App\Http\Controllers\Frontend\StatistikController;
use App\Http\Controllers\Frontend\WelcomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', [WelcomeController::class, 'index']);

Route::get('/api/documentation', [ApiDocumentationController::class, 'ui'])->name('api.documentation');
Route::get('/api/docs/openapi.json', [ApiDocumentationController::class, 'spec'])->name('api.openapi');

Route::get('/logframe', [LogframeController::class, 'index'])->name('logframe');
Route::get('/statistik', [StatistikController::class, 'index'])->name('statistik');
Route::get('/dokumen-kegiatan', [DokumenKegiatanController::class, 'index'])->name('dokumen-kegiatan');
Route::get('/dokumen-kegiatan/{slug}/file', [DokumenKegiatanController::class, 'file'])->name('dokumen-kegiatan.file');
Route::get('/sebaran-cpcl', [SebaranCpclController::class, 'index'])->name('sebaran-cpcl');
Route::get('/sebaran-cpcl/data', [SebaranCpclController::class, 'data'])->name('sebaran-cpcl.data');
Route::get('/sebaran-cpcl/points', [SebaranCpclController::class, 'points'])->name('sebaran-cpcl.points');
Route::get('/sebaran-cpcl/petani/{petani}', [SebaranCpclController::class, 'show'])->name('sebaran-cpcl.petani.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', DashboardRedirectController::class)->name('dashboard');
});

require __DIR__.'/admin.php';
require __DIR__.'/user.php';
require __DIR__.'/auth.php';
