<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\DataVervalController;
use App\Http\Controllers\Admin\KelembagaanPoktanController;
use App\Http\Controllers\Admin\KoperasiController;
use App\Http\Controllers\Admin\BintekController;
use App\Http\Controllers\Admin\MonevFisikController;
use App\Http\Controllers\Admin\ProvinsiController;
use App\Http\Controllers\Admin\KabKotaController;
use App\Http\Controllers\Admin\KecamatanController;
use App\Http\Controllers\Admin\KelDesController;
use App\Http\Controllers\Admin\KelompokPetaniController;
use App\Http\Controllers\Admin\PetaniController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StatistikController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'    => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

Route::get('/vercel-debug', function () {
    if (! config('app.debug')) {
        abort(404);
    }

    try {
        \Illuminate\Support\Facades\DB::connection()->getPdo();
        $dbStatus = 'connected';
    } catch (\Throwable $e) {
        $dbStatus = 'failed: '.$e->getMessage();
    }

    return response()->json([
        'app_env' => config('app.env'),
        'app_debug' => config('app.debug'),
        'app_key_set' => filled(config('app.key')),
        'app_url' => config('app.url'),
        'vercel' => (bool) env('VERCEL'),
        'db_default' => config('database.default'),
        'db_status' => $dbStatus,
        'session_driver' => config('session.driver'),
        'cache_store' => config('cache.default'),
        'storage_path' => storage_path(),
        'storage_writable' => is_writable(storage_path()),
        'views_path' => config('view.compiled'),
    ]);
});

Route::get('/statistik', [StatistikController::class, 'index'])->name('statistik');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('users', UserController::class)->except(['show']);
    Route::resource('roles', RoleController::class)->except(['show']);
    Route::get('data-verval', [DataVervalController::class, 'index'])->name('data-verval.index');
    Route::get('kelembagaan-poktan', [KelembagaanPoktanController::class, 'index'])->name('kelembagaan-poktan.index');
    Route::get('koperasi', [KoperasiController::class, 'index'])->name('koperasi.index');
    Route::get('bintek', [BintekController::class, 'index'])->name('bintek.index');
    Route::get('monev-fisik', [MonevFisikController::class, 'index'])->name('monev-fisik.index');
    Route::get('provinsi', [ProvinsiController::class, 'index'])->name('provinsi.index');
    Route::get('kab-kota', [KabKotaController::class, 'index'])->name('kab-kota.index');
    Route::get('kecamatan', [KecamatanController::class, 'index'])->name('kecamatan.index');
    Route::get('kel-des', [KelDesController::class, 'index'])->name('kel-des.index');
    Route::resource('kelompok-petani', KelompokPetaniController::class)->except(['show']);
    Route::get('kelompok-petani/api/kab-kota', [KelompokPetaniController::class, 'kabKotaByProvinsi'])->name('kelompok-petani.api.kab-kota');
    Route::get('kelompok-petani/api/kecamatan', [KelompokPetaniController::class, 'kecamatanByKabKota'])->name('kelompok-petani.api.kecamatan');
    Route::get('kelompok-petani/api/kel-des', [KelompokPetaniController::class, 'kelDesByKecamatan'])->name('kelompok-petani.api.kel-des');
    Route::resource('petani', PetaniController::class)->except(['show']);
    Route::get('petani/{petani}/keluarga', [PetaniController::class, 'keluarga'])->name('petani.keluarga');
});

require __DIR__.'/auth.php';
