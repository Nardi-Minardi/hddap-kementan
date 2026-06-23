<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KabKota;
use App\Models\Kecamatan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KecamatanController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Kecamatan::with('kabKota')->orderBy('code');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('code', 'ilike', "%{$search}%")
                  ->orWhere('kab_kota_code', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('kab_kota_code')) {
            $query->where('kab_kota_code', $request->kab_kota_code);
        }

        return Inertia::render('Admin/Kecamatan/Index', [
            'kecamatans' => $query->paginate(20)->withQueryString(),
            'kabKotas'   => KabKota::orderBy('name')->get(['code', 'name']),
            'filters'    => $request->only('search', 'kab_kota_code'),
        ]);
    }
}
