<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
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
