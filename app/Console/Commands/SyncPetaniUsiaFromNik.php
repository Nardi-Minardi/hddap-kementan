<?php

namespace App\Console\Commands;

use App\Services\PetaniUsiaSyncService;
use Illuminate\Console\Command;

class SyncPetaniUsiaFromNik extends Command
{
    protected $signature = 'petani:sync-usia-from-nik';

    protected $description = 'Perbarui usia_petani di m_petani berdasarkan digit 11-12 NIK';

    public function handle(PetaniUsiaSyncService $petaniUsiaSyncService): int
    {
        $updated = $petaniUsiaSyncService->syncAll();

        $this->info("Berhasil memperbarui {$updated} data usia_petani.");

        return self::SUCCESS;
    }
}
