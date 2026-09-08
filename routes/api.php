<?php

use App\Http\Api\ClusterController;
use App\Http\Api\KumoditasController;
use App\Http\Api\LogframeController;
use App\Http\Api\PetaniController;
use App\Http\Api\PoktanController;
use App\Http\Api\WilayahController;
use Illuminate\Support\Facades\Route;

Route::get('/logframe', [LogframeController::class, 'index'])->name('api.logframe.index');
Route::get('/petani', [PetaniController::class, 'index'])->name('api.petani.index');
Route::get('/wilayah', [WilayahController::class, 'index'])->name('api.wilayah.index');
Route::get('/poktan', [PoktanController::class, 'index'])->name('api.poktan.index');
Route::get('/cluster', [ClusterController::class, 'index'])->name('api.cluster.index');
Route::get('/kumoditas', [KumoditasController::class, 'index'])->name('api.kumoditas.index');
