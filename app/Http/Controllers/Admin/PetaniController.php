<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KkPetani;
use App\Models\Petani;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PetaniController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Petani::query()->orderBy('id');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_petani', 'ilike', "%{$search}%")
                  ->orWhere('nik_petani', 'ilike', "%{$search}%")
                  ->orWhere('no_hp_petani', 'ilike', "%{$search}%")
                  ->orWhere('alamat_petani', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('gender')) {
            $query->where('gender_petani', $request->gender);
        }

        if ($request->filled('difabel')) {
            $query->where('difabel', $request->difabel === '1');
        }

        return Inertia::render('Admin/Petani/Index', [
            'petanis' => $query->withCount('kkPetani')->paginate(20)->withQueryString(),
            'filters' => $request->only('search', 'gender', 'difabel'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Petani/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_petani'   => 'required|string|max:255',
            'nik_petani'    => 'nullable|string|max:16',
            'no_hp_petani'  => 'nullable|string|max:20',
            'gender_petani' => 'nullable|in:L,P',
            'usia_petani'   => 'nullable|integer|min:1|max:120',
            'difabel'       => 'boolean',
            'alamat_petani' => 'nullable|string',
        ]);

        Petani::create($validated);

        return redirect()->route('admin.petani.index')
            ->with('success', 'Data petani berhasil ditambahkan.');
    }

    public function edit(Petani $petani): Response
    {
        return Inertia::render('Admin/Petani/Edit', ['petani' => $petani]);
    }

    public function update(Request $request, Petani $petani): RedirectResponse
    {
        $validated = $request->validate([
            'nama_petani'   => 'required|string|max:255',
            'nik_petani'    => 'nullable|string|max:16',
            'no_hp_petani'  => 'nullable|string|max:20',
            'gender_petani' => 'nullable|in:L,P',
            'usia_petani'   => 'nullable|integer|min:1|max:120',
            'difabel'       => 'boolean',
            'alamat_petani' => 'nullable|string',
        ]);

        $petani->update($validated);

        return redirect()->route('admin.petani.index')
            ->with('success', 'Data petani berhasil diperbarui.');
    }

    public function destroy(Petani $petani): RedirectResponse
    {
        $petani->delete();

        return redirect()->route('admin.petani.index')
            ->with('success', 'Data petani berhasil dihapus.');
    }

    public function keluarga(Petani $petani): Response
    {
        $keluarga = KkPetani::where('m_petani_id', $petani->id)->orderBy('id')->get();

        return Inertia::render('Admin/Petani/Keluarga', [
            'petani'   => $petani,
            'keluarga' => $keluarga,
        ]);
    }
}
