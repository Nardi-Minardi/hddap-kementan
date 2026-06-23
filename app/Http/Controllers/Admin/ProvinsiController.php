<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Provinsi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProvinsiController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Provinsi::query()->orderBy('code');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('code', 'ilike', "%{$search}%");
            });
        }

        return Inertia::render('Admin/Provinsi/Index', [
            'provinsis' => $query->paginate(20)->withQueryString(),
            'filters'   => $request->only('search'),
        ]);
    }
}
