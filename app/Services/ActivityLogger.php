<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ActivityLogger
{
    public static function log(
        string $aksi,
        ?string $deskripsi = null,
        ?Model $subject = null,
        ?array $metadata = null,
        ?Request $request = null,
        ?int $userId = null,
    ): ActivityLog {
        $request ??= request();

        return ActivityLog::create([
            'user_id' => $userId ?? Auth::id(),
            'aksi' => $aksi,
            'deskripsi' => $deskripsi,
            'subject_type' => $subject ? $subject->getMorphClass() : null,
            'subject_id' => $subject?->getKey(),
            'metadata' => $metadata,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'url' => $request->fullUrl(),
            'method' => $request->method(),
        ]);
    }
}
