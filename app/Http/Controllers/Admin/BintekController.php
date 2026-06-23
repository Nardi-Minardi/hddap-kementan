<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class BintekController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Bintek/Index');
    }
}
