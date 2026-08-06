<?php

namespace App\Http\Middleware;

use App\Services\UserScopeService;
use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class AdminPermissionMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $permissionKey = UserScopeService::permissionKeyForRoute($request->route()?->getName());

        if ($permissionKey === null) {
            return $next($request);
        }

        $scope = UserScopeService::current();

        if ($scope->hasPermission($permissionKey)) {
            return $next($request);
        }

        if ($request->expectsJson() || $request->header('X-Inertia')) {
            return Inertia::render('Errors/403')
                ->toResponse($request)
                ->setStatusCode(403);
        }

        abort(403, 'Anda tidak memiliki izin untuk mengakses halaman ini.');
    }
}
