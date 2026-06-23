<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KelDes;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KelDesController extends Controller
{
    public function index(Request $request): Response
    {
        $query = KelDes::with('kecamatan')->orderBy('code');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('code', 'ilike', "%{$search}%")
                  ->orWhere('kecamatan_code', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('kecamatan_code')) {
            $query->where('kecamatan_code', $request->kecamatan_code);
        }

        return Inertia::render('Admin/KelDes/Index', [
            'kelDess' => $query->paginate(20)->withQueryString(),
            'filters' => $request->only('search', 'kecamatan_code'),
        ]);
    }
}
