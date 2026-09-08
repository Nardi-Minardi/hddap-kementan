<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Petani;
use App\Services\SebaranCpclService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class SebaranCpclController extends Controller
{
    public function __construct(
        private readonly SebaranCpclService $sebaranCpclService,
    ) {}

    public function index(): View
    {
        $dataset = $this->sebaranCpclService->mapDataset();

        return view('sebaran-cpcl', [
            'totalCpcl' => $dataset['points']->count(),
        ]);
    }

    public function data(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'kab_kota_code' => 'nullable|string|in:' . implode(',', $this->sebaranCpclService->allowedKabKotaCodes()),
            'jenis_kumoditas_id' => 'nullable|integer|exists:m_jns_kumoditas,id',
        ]);

        $dataset = $this->sebaranCpclService->mapDataset(
            $validated['kab_kota_code'] ?? null,
            isset($validated['jenis_kumoditas_id']) ? (int) $validated['jenis_kumoditas_id'] : null,
        );

        return response()->json([
            'kabupaten' => $dataset['kabupaten'],
            'komoditas' => $dataset['komoditas'],
            'points' => $dataset['points'],
            'total' => $dataset['points']->count(),
        ]);
    }

    public function points(Request $request): JsonResponse
    {
        return $this->data($request);
    }

    public function show(Petani $petani): JsonResponse
    {
        abort_unless(
            is_numeric($petani->latitude) && is_numeric($petani->longitude),
            404,
        );

        $petani->load(['poktan.cluster.kumoditas.jenisKumoditas']);

        return response()->json([
            'id' => $petani->id,
            'title' => $petani->nama_petani,
            'rows' => $this->sebaranCpclService->detailRows($petani),
        ]);
    }
}
