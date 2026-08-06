<?php

use App\Models\Logframe;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        $patterns = [
            'Komponen 1%' => '1',
            'Komponen 2%' => '2',
            'Komponen 3%' => '3',
            'Komponen 4%' => '4',
        ];

        foreach ($patterns as $pattern => $component) {
            Logframe::query()
                ->where('tingkat', 'ilike', $pattern)
                ->where(function ($query) {
                    $query->whereNull('component')->orWhere('component', '');
                })
                ->update(['component' => $component]);
        }
    }

    public function down(): void
    {
        //
    }
};
