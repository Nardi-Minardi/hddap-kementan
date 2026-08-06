<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Services\PetaniStatisticService;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    public function __construct(
        private readonly BeritaController $beritaController,
        private readonly PetaniStatisticService $petaniStatisticService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('Welcome', [
            'canLogin'    => Route::has('login'),
            'canRegister' => Route::has('register'),
            'berita'      => $this->beritaController->published(),
            'homeStats'   => $this->petaniStatisticService->welcomeHomeStats(),
            'aiTaniStats' => $this->petaniStatisticService->welcomeAiTaniStats(),
        ]);
    }
}
