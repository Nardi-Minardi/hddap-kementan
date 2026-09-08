<?php

namespace App\Http\Api;

use App\Http\Api\Concerns\HandlesPaginatedListing;
use App\Http\Requests\Api\KumoditasIndexRequest;
use App\Models\Kumoditas;
use Illuminate\Http\JsonResponse;

class KumoditasController extends Controller
{
    use HandlesPaginatedListing;

    public function index(KumoditasIndexRequest $request): JsonResponse
    {
        $params = $request->validated();

        $query = Kumoditas::query()->with('jenisKumoditas:id,jenis_kumoditas');

        $this->applyIlikeSearch($query, $params['search'], [
            'kumoditas',
            'keterangan',
        ]);

        if ($params['kodejns'] !== null) {
            $query->where('kodejns', $params['kodejns']);
        }

        return $this->paginatedListing(
            $query,
            $params,
            fn (Kumoditas $kumoditas) => [
                'id'         => $kumoditas->id,
                'kumoditas'  => $kumoditas->kumoditas,
                'kodejns'    => $kumoditas->kodejns,
                'keterangan' => $kumoditas->keterangan,
                'jenis_kumoditas' => $kumoditas->jenisKumoditas ? [
                    'id'              => $kumoditas->jenisKumoditas->id,
                    'jenis_kumoditas' => $kumoditas->jenisKumoditas->jenis_kumoditas,
                ] : null,
            ],
            [
                'kodejns' => $params['kodejns'],
            ],
        );
    }
}
