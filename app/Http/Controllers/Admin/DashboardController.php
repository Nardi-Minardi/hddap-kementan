<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KabKota;
use App\Models\Kecamatan;
use App\Models\KelDes;
use App\Models\Role;
use App\Models\User;
use App\Services\PetaniStatisticService;
use App\Services\UserScopeService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private readonly PetaniStatisticService $petaniStatisticService,
    ) {}

    public function index(): Response
    {
        $scope = UserScopeService::current();
        $kabCodes = $scope->allowedKabKotaCodes();
        $kabCodesInt = $scope->allowedKabKotaIntCodes();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalUsers'  => User::count(),
                'adminCount'  => User::whereHas('role', fn ($q) => $q->where('name', 'admin'))->count(),
                'userCount'   => User::whereHas('role', fn ($q) => $q->where('name', 'user'))->count(),
                'totalRoles'  => Role::count(),
            ],
            'wilayah' => $this->hddapWilayahSummary($kabCodes),
            'cpcl' => $this->petaniStatisticService->dashboardCpclSummary($kabCodesInt),
            'scopeLabel' => $scope->isPusat()
                ? 'Semua kabupaten/kota HDDAP'
                : 'Kabupaten/Kota penugasan Anda',
        ]);
    }

    /** @param  list<string>  $codes */
    private function hddapWilayahSummary(array $codes): array
    {
        $kecamatanCodes = Kecamatan::query()
            ->whereIn('kab_kota_code', $codes)
            ->pluck('code');

        return [
            'provinsi'  => KabKota::query()
                ->whereIn('code', $codes)
                ->distinct()
                ->count('provinsi_code'),
            'kabKota'   => count($codes),
            'kecamatan' => Kecamatan::query()
                ->whereIn('kab_kota_code', $codes)
                ->count(),
            'kelDes'    => KelDes::query()
                ->whereIn('kecamatan_code', $kecamatanCodes)
                ->count(),
        ];
    }
}
