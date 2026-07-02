<?php

use App\Http\Api\LogframeController;
use Illuminate\Support\Facades\Route;

Route::get('/logframe', [LogframeController::class, 'index'])->name('api.logframe.index');
