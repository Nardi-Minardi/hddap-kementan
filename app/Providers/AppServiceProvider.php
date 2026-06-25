<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        if ($this->runningOnVercel()) {
            $this->configureVercelStorage();
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        if ($this->runningOnVercel()) {
            URL::forceScheme('https');
        }
    }

    protected function runningOnVercel(): bool
    {
        return (bool) env('VERCEL', false);
    }

    protected function configureVercelStorage(): void
    {
        $storagePath = '/tmp/storage';

        foreach (['app', 'framework/cache', 'framework/sessions', 'framework/views', 'logs'] as $directory) {
            $path = $storagePath.'/'.$directory;

            if (! is_dir($path)) {
                mkdir($path, 0755, true);
            }
        }

        $this->app->useStoragePath($storagePath);
    }
}
