<?php

use App\Services\PetaniUsiaSyncService;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        app(PetaniUsiaSyncService::class)->syncAll();
    }

    public function down(): void
    {
        //
    }
};
