<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    public function index(Request $request): Response
    {
        $query = ActivityLog::query()
            ->with('user:id,name,email')
            ->orderByDesc('created_at');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('aksi', 'ilike', "%{$search}%")
                    ->orWhere('deskripsi', 'ilike', "%{$search}%")
                    ->orWhere('url', 'ilike', "%{$search}%")
                    ->orWhere('ip_address', 'ilike', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'ilike', "%{$search}%")
                            ->orWhere('email', 'ilike', "%{$search}%");
                    });
            });
        }

        if ($request->filled('aksi')) {
            $query->where('aksi', $request->aksi);
        }

        return Inertia::render('Admin/ActivityLog/Index', [
            'activityLogs' => $query->paginate(20)->withQueryString(),
            'filters' => $request->only('search', 'aksi'),
            'aksiOptions' => ActivityLog::query()
                ->select('aksi')
                ->distinct()
                ->orderBy('aksi')
                ->pluck('aksi'),
        ]);
    }
}
