<?php

namespace App\Services;

use App\Models\Petani;
use App\Support\NikParser;

class PetaniUsiaSyncService
{
    public function __construct(
        private readonly NikParser $nikParser,
    ) {}

    public function syncAll(): int
    {
        $updated = 0;

        Petani::query()
            ->whereNotNull('nik_petani')
            ->where('nik_petani', '!=', '')
            ->orderBy('id')
            ->chunkById(500, function ($petaniRows) use (&$updated) {
                foreach ($petaniRows as $petani) {
                    $age = $this->nikParser->age($petani->nik_petani);

                    if ($age === null) {
                        continue;
                    }

                    if ((int) $petani->usia_petani === $age) {
                        continue;
                    }

                    $petani->update(['usia_petani' => $age]);
                    $updated++;
                }
            });

        return $updated;
    }
}
