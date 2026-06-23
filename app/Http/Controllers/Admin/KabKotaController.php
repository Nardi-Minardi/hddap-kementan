<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KabKota;
use App\Models\Provinsi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KabKotaController extends Controller
{
    public function index(Request $request): Response
    {
        $query = KabKota::with('provinsi')->orderBy('code');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('code', 'ilike', "%{$search}%")
                  ->orWhere('provinsi_code', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('provinsi_code')) {
            $query->where('provinsi_code', $request->provinsi_code);
        }

        return Inertia::render('Admin/KabKota/Index', [
            'kabKotas'  => $query->paginate(20)->withQueryString(),
            'provinsis' => Provinsi::orderBy('name')->get(['code', 'name']),
            'filters'   => $request->only('search', 'provinsi_code'),
        ]);
    }
}
