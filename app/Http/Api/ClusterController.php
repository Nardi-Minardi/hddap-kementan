<?php

namespace App\Http\Api;

use App\Http\Api\Concerns\HandlesPaginatedListing;
use App\Http\Requests\Api\ClusterIndexRequest;
use App\Models\Cluster;
use Illuminate\Http\JsonResponse;

class ClusterController extends Controller
{
    use HandlesPaginatedListing;

    public function index(ClusterIndexRequest $request): JsonResponse
    {
        $params = $request->validated();

        $query = Cluster::query()->with([
            'kumoditas:id,kumoditas,kodejns,keterangan',
            'kumoditas.jenisKumoditas:id,jenis_kumoditas',
            'kabKota:id,code,name,provinsi_code',
        ])->withCount('poktan');

        $this->applyIlikeSearch($query, $params['search'], [
            'nama_cluster',
            'nama_kota',
        ]);

        if ($params['kode_kota'] !== null) {
            $query->where('kode_kota', $params['kode_kota']);
        }

        if ($params['kode_kumoditas'] !== null) {
            $query->where('kode_kumoditas', $params['kode_kumoditas']);
        }

        return $this->paginatedListing(
            $query,
            $params,
            fn (Cluster $cluster) => [
                'id'             => $cluster->id,
                'nama_cluster'   => $cluster->nama_cluster,
                'nama_kota'      => $cluster->nama_kota,
                'kode_kota'      => $cluster->kode_kota,
                'kode_kumoditas' => $cluster->kode_kumoditas,
                'jumlah_poktan'  => $cluster->poktan_count,
                'kumoditas'      => $cluster->kumoditas ? [
                    'id'         => $cluster->kumoditas->id,
                    'kumoditas'  => $cluster->kumoditas->kumoditas,
                    'kodejns'    => $cluster->kumoditas->kodejns,
                    'keterangan' => $cluster->kumoditas->keterangan,
                    'jenis_kumoditas' => $cluster->kumoditas->jenisKumoditas ? [
                        'id'              => $cluster->kumoditas->jenisKumoditas->id,
                        'jenis_kumoditas' => $cluster->kumoditas->jenisKumoditas->jenis_kumoditas,
                    ] : null,
                ] : null,
                'kab_kota'       => $cluster->kabKota ? [
                    'code'          => $cluster->kabKota->code,
                    'name'          => $cluster->kabKota->name,
                    'provinsi_code' => $cluster->kabKota->provinsi_code,
                ] : null,
            ],
            [
                'kode_kota'      => $params['kode_kota'],
                'kode_kumoditas' => $params['kode_kumoditas'],
            ],
        );
    }
}
