<?php

use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\BeritaController;
use App\Http\Controllers\Admin\SubMenuDokumenController;
use App\Http\Controllers\Admin\DatabaseBackupController;
use App\Http\Controllers\Admin\DataPetaniController;
use App\Http\Controllers\Admin\DokumenKegiatanController;
use App\Http\Controllers\Admin\ClusterController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\PelatihanController;
use App\Http\Controllers\Admin\KabKotaController;
use App\Http\Controllers\Admin\KecamatanController;
use App\Http\Controllers\Admin\KelDesController;
use App\Http\Controllers\Admin\JenisPelatihanController;
use App\Http\Controllers\Admin\KelembagaanPoktanController;
use App\Http\Controllers\Admin\KelompokPetaniController;
use App\Http\Controllers\Admin\KeuanganController;
use App\Http\Controllers\Admin\KoperasiController;
use App\Http\Controllers\Admin\LogframeController;
use App\Http\Controllers\Admin\MonevFisikController;
use App\Http\Controllers\Admin\PendampingController;
use App\Http\Controllers\Admin\PetaniController;
use App\Http\Controllers\Admin\ProfileController as AdminProfileController;
use App\Http\Controllers\Admin\ProvinsiController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin', 'admin.permission'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('profile', [AdminProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('profile', [AdminProfileController::class, 'update'])->name('profile.update');
    Route::delete('profile', [AdminProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('berita', BeritaController::class)
        ->except(['show'])
        ->parameters(['berita' => 'berita']);
    Route::resource('sub-menu-dokumen', SubMenuDokumenController::class)->except(['show']);
    Route::resource('dokumen-kegiatan', DokumenKegiatanController::class)->except(['show']);
    Route::resource('users', UserController::class)->except(['show']);
    Route::resource('roles', RoleController::class)->except(['show']);
    Route::resource('data-verval/jenis-pelatihan', JenisPelatihanController::class)
        ->except(['show'])
        ->names('data-verval.jenis-pelatihan');
    Route::get('data-verval/jenis-pelatihan/api/kab-kota', [JenisPelatihanController::class, 'kabKotaByProvinsi'])
        ->name('data-verval.jenis-pelatihan.api.kab-kota');
    Route::get('data-verval/jenis-pelatihan/api/cluster', [JenisPelatihanController::class, 'clustersByKabKota'])
        ->name('data-verval.jenis-pelatihan.api.cluster');
    Route::get('data-verval/jenis-pelatihan/api/poktan', [JenisPelatihanController::class, 'poktanByFilters'])
        ->name('data-verval.jenis-pelatihan.api.poktan');
    Route::get('data-verval/jenis-pelatihan/{jenis_pelatihan}/api/petani', [JenisPelatihanController::class, 'searchPetani'])
        ->name('data-verval.jenis-pelatihan.api.petani');
    Route::post('data-verval/jenis-pelatihan/{jenis_pelatihan}/peserta', [JenisPelatihanController::class, 'storePeserta'])
        ->name('data-verval.jenis-pelatihan.peserta.store');
    Route::delete('data-verval/jenis-pelatihan/{jenis_pelatihan}/peserta/{peserta}', [JenisPelatihanController::class, 'destroyPeserta'])
        ->name('data-verval.jenis-pelatihan.peserta.destroy');
    Route::resource('data-verval/pelatihan', PelatihanController::class)
        ->except(['show'])
        ->names('data-verval.pelatihan');
    Route::get('kelembagaan-poktan', [KelembagaanPoktanController::class, 'index'])->name('kelembagaan-poktan.index');
    Route::prefix('keuangan')->name('keuangan.')->group(function () {
        Route::get('/', [KeuanganController::class, 'index'])->name('index');
        Route::post('awp', [KeuanganController::class, 'storeAwp'])->name('awp.store');
        Route::put('awp/{keuanganAwp}', [KeuanganController::class, 'updateAwp'])->name('awp.update');
        Route::delete('awp/{keuanganAwp}', [KeuanganController::class, 'destroyAwp'])->name('awp.destroy');
        Route::post('transaksi', [KeuanganController::class, 'storeTransaksi'])->name('transaksi.store');
        Route::delete('transaksi/{keuanganTransaksi}', [KeuanganController::class, 'destroyTransaksi'])->name('transaksi.destroy');
        Route::post('rekonsiliasi', [KeuanganController::class, 'storeRekonsiliasi'])->name('rekonsiliasi.store');
    });
    Route::get('koperasi', [KoperasiController::class, 'index'])->name('koperasi.index');
    Route::get('monev-fisik', [MonevFisikController::class, 'index'])->name('monev-fisik.index');
    Route::resource('logframe', LogframeController::class)->except(['show']);
    Route::get('activity-log', [ActivityLogController::class, 'index'])->name('activity-log.index');
    Route::get('database-backup', [DatabaseBackupController::class, 'index'])->name('database-backup.index');
    Route::post('database-backup', [DatabaseBackupController::class, 'store'])->name('database-backup.store');
    Route::post('database-backup/restore', [DatabaseBackupController::class, 'restore'])->name('database-backup.restore');
    Route::get('database-backup/{filename}/download', [DatabaseBackupController::class, 'download'])
        ->where('filename', '[^/]+')
        ->name('database-backup.download');
    Route::delete('database-backup/{filename}', [DatabaseBackupController::class, 'destroy'])
        ->where('filename', '[^/]+')
        ->name('database-backup.destroy');
    Route::get('provinsi', [ProvinsiController::class, 'index'])->name('provinsi.index');
    Route::get('kab-kota', [KabKotaController::class, 'index'])->name('kab-kota.index');
    Route::get('kecamatan', [KecamatanController::class, 'index'])->name('kecamatan.index');
    Route::get('kel-des', [KelDesController::class, 'index'])->name('kel-des.index');
    Route::prefix('data-petani')->name('data-petani.')->group(function () {
        Route::get('/', [DataPetaniController::class, 'index'])->name('index');
    });
    Route::get('kelompok-petani/{poktan}/anggota', [KelompokPetaniController::class, 'anggota'])->name('kelompok-petani.anggota');
    Route::get('cluster/{cluster}/poktan', [ClusterController::class, 'poktan'])->name('cluster.poktan');
    Route::resource('cluster', ClusterController::class)->except(['show']);
    Route::resource('kelompok-petani', KelompokPetaniController::class)->except(['show']);
    Route::get('kelompok-petani/api/kab-kota', [KelompokPetaniController::class, 'kabKotaByProvinsi'])->name('kelompok-petani.api.kab-kota');
    Route::get('kelompok-petani/api/cluster', [KelompokPetaniController::class, 'clustersByKabKota'])->name('kelompok-petani.api.cluster');
    Route::resource('pendamping', PendampingController::class)->except(['show']);
    Route::get('petani/api/cluster', [PetaniController::class, 'clustersByKabKota'])->name('petani.api.cluster');
    Route::get('petani/api/poktan', [PetaniController::class, 'poktanByCluster'])->name('petani.api.poktan');
    Route::resource('petani', PetaniController::class)->except(['show']);
    Route::get('petani/{petani}/keluarga', [PetaniController::class, 'keluarga'])->name('petani.keluarga');
    Route::post('petani/{petani}/keluarga', [PetaniController::class, 'storeKeluarga'])->name('petani.keluarga.store');
    Route::put('petani/{petani}/keluarga/{kkPetani}', [PetaniController::class, 'updateKeluarga'])->name('petani.keluarga.update');
    Route::delete('petani/{petani}/keluarga/{kkPetani}', [PetaniController::class, 'destroyKeluarga'])->name('petani.keluarga.destroy');
});
