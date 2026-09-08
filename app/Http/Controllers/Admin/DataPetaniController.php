<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\UserScopeService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DataPetaniController extends Controller
{
    public function index(Request $request): Response
    {
        $tab = $this->resolveTab($request);
        $this->ensureTabPermission($tab);

        $props = match ($tab) {
            'kelompok-petani' => app(KelompokPetaniController::class)->indexProps($request),
            'petani' => app(PetaniController::class)->indexProps($request),
            default => app(ClusterController::class)->indexProps($request),
        };

        return Inertia::render('Admin/DataPetani/Index', [
            'tab' => $tab,
            ...$props,
        ]);
    }

    private function resolveTab(Request $request): string
    {
        $scope = UserScopeService::current();
        $requested = (string) $request->get('tab', '');

        $tabs = [
            'cluster' => 'cluster.view',
            'kelompok-petani' => 'kelompok-petani.view',
            'petani' => 'petani.view',
        ];

        if ($requested !== '' && isset($tabs[$requested]) && $scope->hasPermission($tabs[$requested])) {
            return $requested;
        }

        foreach ($tabs as $tab => $permission) {
            if ($scope->hasPermission($permission)) {
                return $tab;
            }
        }

        abort(403, 'Anda tidak memiliki izin untuk mengakses data petani.');
    }

    private function ensureTabPermission(string $tab): void
    {
        $permission = match ($tab) {
            'kelompok-petani' => 'kelompok-petani.view',
            'petani' => 'petani.view',
            default => 'cluster.view',
        };

        UserScopeService::current()->ensurePermission($permission);
    }
}
