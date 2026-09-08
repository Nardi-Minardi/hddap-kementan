<?php

namespace App\Http\Middleware;

use App\Services\AdminPermissionSyncService;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        if ($request->user()?->isAdmin()) {
            AdminPermissionSyncService::syncIfNeeded();
            $request->user()->load(['role', 'permissions', 'kabKotas']);
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user()?->load(['role', 'permissions', 'kabKotas']),
                'permissions' => $request->user()?->isAdmin()
                    ? \App\Services\UserScopeService::current()->permissionKeys()
                    : [],
                'isPusat' => (bool) $request->user()?->is_pusat,
                'can' => fn () => $request->user()?->isAdmin()
                    ? collect(\App\Services\UserScopeService::current()->permissionKeys())
                        ->mapWithKeys(fn (string $key) => [$key => true])
                        ->all()
                    : [],
                'menuKeys' => $request->user()?->isAdmin()
                    ? \App\Services\UserScopeService::current()->menuKeys()
                    : [],
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
                'focus_peserta' => fn () => $request->session()->get('focus_peserta'),
            ],
            'social' => [
                'youtube'   => config('services.social.youtube_url'),
                'instagram' => config('services.social.instagram_url'),
            ],
            'videos' => [
                'hero' => [
                    config('services.videos.hero_1'),
                    config('services.videos.hero_2'),
                    config('services.videos.hero_3'),
                ],
                'aiTani' => config('services.videos.ai_tani'),
            ],
        ];
    }
}
