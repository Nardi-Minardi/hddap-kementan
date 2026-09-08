<?php

namespace App\Http\Api;

use App\Http\Requests\Api\PetaniIndexRequest;
use App\Models\Petani;
use Illuminate\Http\JsonResponse;

class PetaniController extends Controller
{
    public function index(PetaniIndexRequest $request): JsonResponse
    {
        $params = $request->validated();

        $query = Petani::query()->with([
            'poktan:id,nama_poktan,kode_cluster',
            'kabKota:id,code,name',
        ]);

        if ($params['search'] !== null && $params['search'] !== '') {
            $search = $params['search'];
            $query->where(function ($q) use ($search) {
                $q->where('nama_petani', 'ilike', "%{$search}%")
                    ->orWhere('nik_petani', 'ilike', "%{$search}%")
                    ->orWhere('no_hp_petani', 'ilike', "%{$search}%")
                    ->orWhere('alamat_petani', 'ilike', "%{$search}%")
                    ->orWhere('gender_petani', 'ilike', "%{$search}%")
                    ->orWhere('tahap', 'ilike', "%{$search}%")
                    ->orWhere('kelas_lereng', 'ilike', "%{$search}%")
                    ->orWhere('fungsi_kws_hutan', 'ilike', "%{$search}%");
            });
        }

        if ($params['gender_petani'] !== null) {
            $query->where('gender_petani', $params['gender_petani']);
        }

        if ($params['kode_kota'] !== null) {
            $query->where('kode_kota', $params['kode_kota']);
        }

        if ($params['kode_poktan'] !== null) {
            $query->where('kode_poktan', $params['kode_poktan']);
        }

        if ($params['tahap'] !== null) {
            $query->where('tahap', $params['tahap']);
        }

        if ($params['difabel'] !== null) {
            $query->where('difabel', $params['difabel']);
        }

        if ($params['dukungan_proyek'] === true) {
            $query->dukunganProyek();
        } elseif ($params['dukungan_proyek'] === false) {
            $query->where('jmlah_petani', '!=', 1);
        }

        $total = (clone $query)->count();

        $items = $query
            ->orderBy($params['order_by'], $params['order_direction'])
            ->offset($params['offset'])
            ->limit($params['limit'])
            ->get();

        return $this->apiSuccess(
            data: $items->map(fn (Petani $petani) => $this->transformPetani($petani))->values(),
            message: 'Success',
            meta: [
                'total'           => $total,
                'limit'           => $params['limit'],
                'offset'          => $params['offset'],
                'order_by'        => $params['order_by'],
                'order_direction' => $params['order_direction'],
                'search'          => $params['search'],
                'filters'         => [
                    'gender_petani'   => $params['gender_petani'],
                    'kode_kota'       => $params['kode_kota'],
                    'kode_poktan'     => $params['kode_poktan'],
                    'tahap'           => $params['tahap'],
                    'difabel'         => $params['difabel'],
                    'dukungan_proyek' => $params['dukungan_proyek'],
                ],
            ],
        );
    }

    /**
     * @return array<string, mixed>
     */
    private function transformPetani(Petani $petani): array
    {
        return [
            'id'               => $petani->id,
            'nama_petani'      => $petani->nama_petani,
            'nik_petani'       => $petani->nik_petani,
            'no_hp_petani'     => $petani->no_hp_petani,
            'gender_petani'    => $petani->gender_petani,
            'usia_petani'      => $petani->usia_petani,
            'difabel'          => $petani->difabel,
            'alamat_petani'    => $petani->alamat_petani,
            'jmlah_petani'     => $petani->jmlah_petani,
            'luas_lahan_ha'    => $petani->luas_lahan_ha,
            'latitude'         => $petani->latitude,
            'longitude'        => $petani->longitude,
            'kelas_lereng'     => $petani->kelas_lereng,
            'kemiringan'       => $petani->kemiringan,
            'fungsi_kws_hutan' => $petani->fungsi_kws_hutan,
            'tahap'            => $petani->tahap,
            'kode_poktan'      => $petani->kode_poktan,
            'kode_kota'        => $petani->kode_kota,
            'foto_lahan'       => filled($petani->foto_lahan) ? '/storage/'.$petani->foto_lahan : null,
            'poktan'           => $petani->poktan ? [
                'id'           => $petani->poktan->id,
                'nama_poktan'  => $petani->poktan->nama_poktan,
                'kode_cluster' => $petani->poktan->kode_cluster,
            ] : null,
            'kab_kota'         => $petani->kabKota ? [
                'code' => $petani->kabKota->code,
                'name' => $petani->kabKota->name,
            ] : null,
            'created_at'       => $petani->created_at?->format('Y-m-d H:i:s'),
            'updated_at'       => $petani->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
