<?php

namespace App\Http\Api;

use App\Http\Api\Concerns\HandlesPaginatedListing;
use App\Http\Requests\Api\PoktanIndexRequest;
use App\Models\Poktan;
use Illuminate\Http\JsonResponse;

class PoktanController extends Controller
{
    use HandlesPaginatedListing;

    public function index(PoktanIndexRequest $request): JsonResponse
    {
        $params = $request->validated();

        $query = Poktan::query()->with([
            'cluster:id,nama_cluster,kode_kumoditas',
            'kabKota:id,code,name,provinsi_code',
        ])->withCount('petani');

        $this->applyIlikeSearch($query, $params['search'], [
            'nama_poktan',
            'ketua',
            'telp',
            'alamat',
            'gender_lp',
        ]);

        if ($params['kode_kota'] !== null) {
            $query->where('kode_kota', $params['kode_kota']);
        }

        if ($params['kode_cluster'] !== null) {
            $query->where('kode_cluster', $params['kode_cluster']);
        }

        return $this->paginatedListing(
            $query,
            $params,
            fn (Poktan $poktan) => [
                'id'            => $poktan->id,
                'nama_poktan'   => $poktan->nama_poktan,
                'ketua'         => $poktan->ketua,
                'telp'          => $poktan->telp,
                'alamat'        => $poktan->alamat,
                'gender_lp'     => $poktan->gender_lp,
                'kode_kota'     => $poktan->kode_kota,
                'kode_cluster'  => $poktan->kode_cluster,
                'jumlah_petani' => $poktan->petani_count,
                'cluster'       => $poktan->cluster ? [
                    'id'             => $poktan->cluster->id,
                    'nama_cluster'   => $poktan->cluster->nama_cluster,
                    'kode_kumoditas' => $poktan->cluster->kode_kumoditas,
                ] : null,
                'kab_kota'      => $poktan->kabKota ? [
                    'code'          => $poktan->kabKota->code,
                    'name'          => $poktan->kabKota->name,
                    'provinsi_code' => $poktan->kabKota->provinsi_code,
                ] : null,
            ],
            [
                'kode_kota'    => $params['kode_kota'],
                'kode_cluster' => $params['kode_cluster'],
            ],
        );
    }
}
