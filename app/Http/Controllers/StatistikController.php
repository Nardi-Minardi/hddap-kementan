<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

class StatistikController extends Controller
{
    public function index(): View
    {
        return view('statistik', [
            'dashboardUrl' => config('services.statistik.dashboard_url'),
        ]);
    }
}
