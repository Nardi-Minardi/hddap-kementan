<?php



namespace App\Http\Api;



use App\Http\Requests\Api\LogframeIndexRequest;

use App\Models\Logframe;

use Illuminate\Http\JsonResponse;



class LogframeController extends Controller

{

    public function index(LogframeIndexRequest $request): JsonResponse

    {

        $params = $request->validated();



        $query = Logframe::query();



        if ($params['search'] !== null && $params['search'] !== '') {

            $search = $params['search'];

            $query->where(function ($q) use ($search) {

                $q->where('tingkat', 'ilike', "%{$search}%")

                    ->orWhere('nama_indikator', 'ilike', "%{$search}%")

                    ->orWhere('definisi_indikator', 'ilike', "%{$search}%")

                    ->orWhere('nilai_dasar', 'ilike', "%{$search}%")

                    ->orWhere('target_pertengahan_proyek', 'ilike', "%{$search}%")

                    ->orWhere('target_akhir_proyek', 'ilike', "%{$search}%")

                    ->orWhere('realisasi', 'ilike', "%{$search}%")

                    ->orWhere('component', 'ilike', "%{$search}%")

                    ->orWhere('sumber_data', 'ilike', "%{$search}%")

                    ->orWhere('data_yg_dikumpulkan', 'ilike', "%{$search}%");

            });

        }



        $total = (clone $query)->count();



        $items = $query

            ->orderBy($params['order_by'], $params['order_direction'])

            ->offset($params['offset'])

            ->limit($params['limit'])

            ->get([

                'id',

                'tingkat',

                'nama_indikator',

                'definisi_indikator',

                'nilai_dasar',

                'target_pertengahan_proyek',

                'target_akhir_proyek',

                'realisasi',

                'component',

                'sumber_data',

                'data_yg_dikumpulkan',

                'created_at',

                'updated_at',

            ]);



        return $this->apiSuccess(

            data: $items->map(fn (Logframe $logframe) => [

                'id'                         => $logframe->id,

                'tingkat'                    => $logframe->tingkat,

                'nama_indikator'             => $logframe->nama_indikator,

                'definisi_indikator'         => $logframe->definisi_indikator,

                'nilai_dasar'                => $logframe->nilai_dasar,

                'target_pertengahan_proyek'  => $logframe->target_pertengahan_proyek,

                'target_akhir_proyek'        => $logframe->target_akhir_proyek,

                'realisasi'                  => $logframe->realisasi,

                'component'                  => $logframe->component,

                'sumber_data'                => $logframe->sumber_data,

                'data_yg_dikumpulkan'        => $logframe->data_yg_dikumpulkan,

                'created_at'                 => $logframe->created_at?->format('Y-m-d'),
                'updated_at'                 => $logframe->updated_at?->format('Y-m-d'),

            ])->values(),

            message: 'Success',

            meta: [

                'total'           => $total,

                'limit'           => $params['limit'],

                'offset'          => $params['offset'],

                'order_by'        => $params['order_by'],

                'order_direction' => $params['order_direction'],

                'search'          => $params['search'],

            ],

        );

    }

}


