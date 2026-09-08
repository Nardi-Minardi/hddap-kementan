<?php

namespace Database\Seeders;

use App\Models\JenisPelatihan;
use App\Models\Pelatihan;
use Illuminate\Database\Seeder;
use PhpOffice\PhpSpreadsheet\IOFactory;

class PelatihanSeeder extends Seeder
{
    public function run(): void
    {
        $filePath = storage_path('app/mbintek.xlsx');

        if (! is_file($filePath)) {
            $this->command->error("File tidak ditemukan: {$filePath}");

            return;
        }

        $spreadsheet = IOFactory::load($filePath);
        $sheet = $spreadsheet->getSheetByName('Bimtek, Sosialisa,Pelatihan ToT');

        if ($sheet === null) {
            $this->command->error('Sheet "Bimtek, Sosialisa,Pelatihan ToT" tidak ditemukan.');

            return;
        }

        Pelatihan::query()->delete();

        JenisPelatihan::query()
            ->whereNotNull('topik')
            ->where('topik', '!=', '')
            ->delete();

        $lastRow = $sheet->getHighestDataRow();
        $inserted = 0;

        for ($row = 2; $row <= $lastRow; $row++) {
            $komponen = trim((string) $sheet->getCell('A' . $row)->getValue());
            $namaKegiatan = trim((string) $sheet->getCell('B' . $row)->getValue());
            $kodeOwp = trim((string) $sheet->getCell('C' . $row)->getValue());

            if ($namaKegiatan === '' || $kodeOwp === '') {
                continue;
            }

            Pelatihan::updateOrCreate(
                ['kode_owp' => $kodeOwp],
                [
                    'komponen' => mb_substr($komponen !== '' ? $komponen : 'Umum', 0, 100),
                    'nama_kegiatan' => mb_substr($namaKegiatan, 0, 255),
                ],
            );

            $inserted++;
        }

        $this->command->info("Pelatihan: {$inserted} data dari Excel berhasil diimpor.");
    }
}
