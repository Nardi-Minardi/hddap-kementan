<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Logframe;
use App\Services\PetaniStatisticService;
use App\Support\LogframeRealisasiPresenter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class LogframeController extends Controller
{
    public function __construct(
        private readonly LogframeRealisasiPresenter $logframeRealisasiPresenter,
        private readonly PetaniStatisticService $petaniStatisticService,
    ) {}

    public function index(Request $request): Response
    {
        $query = Logframe::query()->orderBy('id');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('tingkat', 'ilike', "%{$search}%")
                    ->orWhere('nama_indikator', 'ilike', "%{$search}%")
                    ->orWhere('definisi_indikator', 'ilike', "%{$search}%")
                    ->orWhere('nilai_dasar', 'ilike', "%{$search}%")
                    ->orWhere('target_pertengahan_proyek', 'ilike', "%{$search}%")
                    ->orWhere('target_akhir_proyek', 'ilike', "%{$search}%")
                    ->orWhere('realisasi', 'ilike', "%{$search}%")
                    ->orWhere('component', 'ilike', "%{$search}%")
                    ->orWhere('sumber_data', 'ilike', "%{$search}%")
                    ->orWhere('data_yg_dikumpulkan', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('component')) {
            $query->where('component', (string) $request->component);
        } else {
            $query->where(function ($q) {
                $q->whereNull('component')->orWhere('component', '');
            });
        }

        return Inertia::render('Frontend/Logframe/Index', [
            'canLogin'    => Route::has('login'),
            'canRegister' => Route::has('register'),
            'logframes'   => $this->logframeRealisasiPresenter->applyToPaginator(
                $query->paginate(10)->withQueryString(),
                $request->input('tahap'),
            ),
            'filters'     => $request->only('search', 'component', 'tahap'),
            'tahapOptions' => $this->petaniStatisticService->getTahapOptions(),
        ]);
    }
}
