<?php

namespace App\Http\Api;

use App\Http\Api\Concerns\HandlesPaginatedListing;
use App\Http\Requests\Api\WilayahIndexRequest;
use App\Models\KabKota;
use App\Models\Kecamatan;
use App\Models\KelDes;
use App\Models\Provinsi;
use Illuminate\Http\JsonResponse;

class WilayahController extends Controller
{
    use HandlesPaginatedListing;

    public function index(WilayahIndexRequest $request): JsonResponse
    {
        $params = $request->validated();

        if ($params['level'] !== null || $params['format'] === 'flat') {
            return $this->flatIndex($params);
        }

        return $this->nestedIndex($params);
    }

    /**
     * @param  array<string, mixed>  $params
     */
    private function nestedIndex(array $params): JsonResponse
    {
        $provinsiQuery = Provinsi::query()->orderBy('code');

        if ($params['provinsi_code'] !== null) {
            $provinsiQuery->where('code', $params['provinsi_code']);
        }

        $provinsis = $provinsiQuery
            ->with([
                'kabKota' => function ($query) use ($params) {
                    $query->orderBy('code');

                    if ($params['kab_kota_code'] !== null) {
                        $query->where('code', $params['kab_kota_code']);
                    }

                    if ($params['provinsi_code'] !== null) {
                        $query->where('provinsi_code', $params['provinsi_code']);
                    }

                    $query->with([
                        'kecamatan' => function ($kecamatanQuery) use ($params) {
                            $kecamatanQuery->orderBy('code');

                            if ($params['kecamatan_code'] !== null) {
                                $kecamatanQuery->where('code', $params['kecamatan_code']);
                            }

                            if ($params['kab_kota_code'] !== null) {
                                $kecamatanQuery->where('kab_kota_code', $params['kab_kota_code']);
                            }

                            $kecamatanQuery->with([
                                'kelDes' => fn ($kelDesQuery) => $kelDesQuery->orderBy('code'),
                            ]);
                        },
                    ]);
                },
            ])
            ->get()
            ->filter(fn (Provinsi $provinsi) => $provinsi->kabKota->isNotEmpty() || $params['provinsi_code'] !== null)
            ->values();

        $kabKotaCount = $provinsis->sum(fn (Provinsi $provinsi) => $provinsi->kabKota->count());
        $kecamatanCount = $provinsis->sum(
            fn (Provinsi $provinsi) => $provinsi->kabKota->sum(fn (KabKota $kabKota) => $kabKota->kecamatan->count()),
        );
        $kelDesCount = $provinsis->sum(
            fn (Provinsi $provinsi) => $provinsi->kabKota->sum(
                fn (KabKota $kabKota) => $kabKota->kecamatan->sum(fn (Kecamatan $kecamatan) => $kecamatan->kelDes->count()),
            ),
        );

        return $this->apiSuccess(
            data: $provinsis->map(fn (Provinsi $provinsi) => [
                'code'     => $provinsi->code,
                'name'     => $provinsi->name,
                'kab_kota' => $provinsi->kabKota->map(fn (KabKota $kabKota) => [
                    'code'          => $kabKota->code,
                    'name'          => $kabKota->name,
                    'provinsi_code' => $kabKota->provinsi_code,
                    'kecamatan'     => $kabKota->kecamatan->map(fn (Kecamatan $kecamatan) => [
                        'code'          => $kecamatan->code,
                        'name'          => $kecamatan->name,
                        'kab_kota_code' => $kecamatan->kab_kota_code,
                        'kel_des'       => $kecamatan->kelDes->map(fn (KelDes $kelDes) => [
                            'code'           => $kelDes->code,
                            'name'           => $kelDes->name,
                            'kecamatan_code' => $kelDes->kecamatan_code,
                        ])->values(),
                    ])->values(),
                ])->values(),
            ])->values(),
            message: 'Success',
            meta: [
                'format'         => 'nested',
                'provinsi_code'  => $params['provinsi_code'],
                'kab_kota_code'  => $params['kab_kota_code'],
                'kecamatan_code' => $params['kecamatan_code'],
                'counts'         => [
                    'provinsi'  => $provinsis->count(),
                    'kab_kota'  => $kabKotaCount,
                    'kecamatan' => $kecamatanCount,
                    'kel_des'   => $kelDesCount,
                ],
            ],
        );
    }

    /**
     * @param  array<string, mixed>  $params
     */
    private function flatIndex(array $params): JsonResponse
    {
        $level = $params['level'] ?? 'provinsi';

        return match ($level) {
            'kab_kota'  => $this->flatKabKota($params),
            'kecamatan' => $this->flatKecamatan($params),
            'kel_des'   => $this->flatKelDes($params),
            default     => $this->flatProvinsi($params),
        };
    }

    /**
     * @param  array<string, mixed>  $params
     */
    private function flatProvinsi(array $params): JsonResponse
    {
        $query = Provinsi::query();

        $this->applyIlikeSearch($query, $params['search'], ['code', 'name']);

        if ($params['provinsi_code'] !== null) {
            $query->where('code', $params['provinsi_code']);
        }

        return $this->paginatedListing(
            $query,
            $params,
            fn (Provinsi $item) => [
                'code' => $item->code,
                'name' => $item->name,
            ],
            [
                'format'         => 'flat',
                'level'          => 'provinsi',
                'provinsi_code'  => $params['provinsi_code'],
                'kab_kota_code'  => $params['kab_kota_code'],
                'kecamatan_code' => $params['kecamatan_code'],
            ],
        );
    }

    /**
     * @param  array<string, mixed>  $params
     */
    private function flatKabKota(array $params): JsonResponse
    {
        $query = KabKota::query()->with('provinsi:code,name');

        $this->applyIlikeSearch($query, $params['search'], ['code', 'name', 'provinsi_code']);

        if ($params['provinsi_code'] !== null) {
            $query->where('provinsi_code', $params['provinsi_code']);
        }

        if ($params['kab_kota_code'] !== null) {
            $query->where('code', $params['kab_kota_code']);
        }

        return $this->paginatedListing(
            $query,
            $params,
            fn (KabKota $item) => [
                'code'          => $item->code,
                'name'          => $item->name,
                'provinsi_code' => $item->provinsi_code,
                'provinsi'      => $item->provinsi ? [
                    'code' => $item->provinsi->code,
                    'name' => $item->provinsi->name,
                ] : null,
            ],
            [
                'format'         => 'flat',
                'level'          => 'kab_kota',
                'provinsi_code'  => $params['provinsi_code'],
                'kab_kota_code'  => $params['kab_kota_code'],
                'kecamatan_code' => $params['kecamatan_code'],
            ],
        );
    }

    /**
     * @param  array<string, mixed>  $params
     */
    private function flatKecamatan(array $params): JsonResponse
    {
        $query = Kecamatan::query()->with('kabKota:code,name,provinsi_code');

        $this->applyIlikeSearch($query, $params['search'], ['code', 'name', 'kab_kota_code']);

        if ($params['kab_kota_code'] !== null) {
            $query->where('kab_kota_code', $params['kab_kota_code']);
        }

        if ($params['kecamatan_code'] !== null) {
            $query->where('code', $params['kecamatan_code']);
        }

        if ($params['provinsi_code'] !== null) {
            $query->whereHas('kabKota', fn ($q) => $q->where('provinsi_code', $params['provinsi_code']));
        }

        return $this->paginatedListing(
            $query,
            $params,
            fn (Kecamatan $item) => [
                'code'          => $item->code,
                'name'          => $item->name,
                'kab_kota_code' => $item->kab_kota_code,
                'kab_kota'      => $item->kabKota ? [
                    'code'          => $item->kabKota->code,
                    'name'          => $item->kabKota->name,
                    'provinsi_code' => $item->kabKota->provinsi_code,
                ] : null,
            ],
            [
                'format'         => 'flat',
                'level'          => 'kecamatan',
                'provinsi_code'  => $params['provinsi_code'],
                'kab_kota_code'  => $params['kab_kota_code'],
                'kecamatan_code' => $params['kecamatan_code'],
            ],
        );
    }

    /**
     * @param  array<string, mixed>  $params
     */
    private function flatKelDes(array $params): JsonResponse
    {
        $query = KelDes::query()->with('kecamatan:code,name,kab_kota_code');

        $this->applyIlikeSearch($query, $params['search'], ['code', 'name', 'kecamatan_code']);

        if ($params['kecamatan_code'] !== null) {
            $query->where('kecamatan_code', $params['kecamatan_code']);
        }

        if ($params['kab_kota_code'] !== null) {
            $query->whereHas('kecamatan', fn ($q) => $q->where('kab_kota_code', $params['kab_kota_code']));
        }

        if ($params['provinsi_code'] !== null) {
            $query->whereHas('kecamatan.kabKota', fn ($q) => $q->where('provinsi_code', $params['provinsi_code']));
        }

        return $this->paginatedListing(
            $query,
            $params,
            fn (KelDes $item) => [
                'code'           => $item->code,
                'name'           => $item->name,
                'kecamatan_code' => $item->kecamatan_code,
                'kecamatan'      => $item->kecamatan ? [
                    'code'          => $item->kecamatan->code,
                    'name'          => $item->kecamatan->name,
                    'kab_kota_code' => $item->kecamatan->kab_kota_code,
                ] : null,
            ],
            [
                'format'         => 'flat',
                'level'          => 'kel_des',
                'provinsi_code'  => $params['provinsi_code'],
                'kab_kota_code'  => $params['kab_kota_code'],
                'kecamatan_code' => $params['kecamatan_code'],
            ],
        );
    }
}
