<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Logframe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class LogframeController extends Controller
{
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
        }

        return Inertia::render('Frontend/Logframe/Index', [
            'canLogin'    => Route::has('login'),
            'canRegister' => Route::has('register'),
            'logframes'   => $query->paginate(5)->withQueryString(),
            'filters'     => $request->only('search', 'component'),
        ]);
    }
}
