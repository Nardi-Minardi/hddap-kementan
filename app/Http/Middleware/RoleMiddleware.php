<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!$request->user()) {
            return redirect()->route('login');
        }

        foreach ($roles as $role) {
            if ($request->user()->hasRole($role)) {
                return $next($request);
            }
        }

        if ($request->expectsJson() || $request->header('X-Inertia')) {
            return Inertia::render('Errors/403')
                ->toResponse($request)
                ->setStatusCode(403);
        }

        abort(403, 'Unauthorized. Insufficient role.');
    }
}
