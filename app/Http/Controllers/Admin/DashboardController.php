<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KabKota;
use App\Models\Kecamatan;
use App\Models\KelDes;
use App\Models\Provinsi;
use App\Models\Role;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalUsers'  => User::count(),
                'adminCount'  => User::whereHas('role', fn ($q) => $q->where('name', 'admin'))->count(),
                'userCount'   => User::whereHas('role', fn ($q) => $q->where('name', 'user'))->count(),
                'totalRoles'  => Role::count(),
            ],
            'wilayah' => [
                'provinsi'  => Provinsi::count(),
                'kabKota'   => KabKota::count(),
                'kecamatan' => Kecamatan::count(),
                'kelDes'    => KelDes::count(),
            ],
        ]);
    }
}
