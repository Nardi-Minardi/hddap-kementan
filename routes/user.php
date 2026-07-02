<?php

use App\Http\Controllers\User\DashboardController as UserDashboardController;
use App\Http\Controllers\User\ProfileController as UserProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:user'])->prefix('user')->name('user.')->group(function () {
    Route::get('/dashboard', [UserDashboardController::class, 'index'])->name('dashboard');
    Route::get('profile', [UserProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('profile', [UserProfileController::class, 'update'])->name('profile.update');
    Route::delete('profile', [UserProfileController::class, 'destroy'])->name('profile.destroy');
});
