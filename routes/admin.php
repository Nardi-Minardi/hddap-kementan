<?php

use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\BintekController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\DataVervalController;
use App\Http\Controllers\Admin\KabKotaController;
use App\Http\Controllers\Admin\KecamatanController;
use App\Http\Controllers\Admin\KelDesController;
use App\Http\Controllers\Admin\KelembagaanPoktanController;
use App\Http\Controllers\Admin\KelompokPetaniController;
use App\Http\Controllers\Admin\KoperasiController;
use App\Http\Controllers\Admin\LogframeController;
use App\Http\Controllers\Admin\MonevFisikController;
use App\Http\Controllers\Admin\PetaniController;
use App\Http\Controllers\Admin\ProfileController as AdminProfileController;
use App\Http\Controllers\Admin\ProvinsiController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('profile', [AdminProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('profile', [AdminProfileController::class, 'update'])->name('profile.update');
    Route::delete('profile', [AdminProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('users', UserController::class)->except(['show']);
    Route::resource('roles', RoleController::class)->except(['show']);
    Route::get('data-verval', [DataVervalController::class, 'index'])->name('data-verval.index');
    Route::get('kelembagaan-poktan', [KelembagaanPoktanController::class, 'index'])->name('kelembagaan-poktan.index');
    Route::get('koperasi', [KoperasiController::class, 'index'])->name('koperasi.index');
    Route::get('bintek', [BintekController::class, 'index'])->name('bintek.index');
    Route::get('monev-fisik', [MonevFisikController::class, 'index'])->name('monev-fisik.index');
    Route::resource('logframe', LogframeController::class)->except(['show']);
    Route::get('activity-log', [ActivityLogController::class, 'index'])->name('activity-log.index');
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
