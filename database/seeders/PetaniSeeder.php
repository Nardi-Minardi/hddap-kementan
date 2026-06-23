<?php

namespace Database\Seeders;

use App\Models\Petani;
use Illuminate\Database\Seeder;
use PhpOffice\PhpSpreadsheet\IOFactory;

class PetaniSeeder extends Seeder
{
    public function run(): void
    {
        $filePath = public_path('import/m_petani.xlsx');

        $spreadsheet = IOFactory::load($filePath);

        $inserted = 0;

        foreach ($spreadsheet->getAllSheets() as $sheet) {
            // Hanya proses sheet dengan struktur m_petani (kolom A = "Nama Petani")
            $headerA = strtolower(trim((string) $sheet->getCell('A1')->getValue()));
            if (!str_contains($headerA, 'nama petani')) {
                $this->command->warn("Sheet [{$sheet->getTitle()}]: dilewati (struktur kolom berbeda).");
                continue;
            }
            $lastRow = $sheet->getHighestDataRow();

            // Baris 1 = header, data mulai baris 2
            for ($row = 2; $row <= $lastRow; $row++) {
                $nama = $sheet->getCell('A' . $row)->getValue();

                // Skip baris kosong
                if (empty($nama)) {
                    continue;
                }

                $usia = $sheet->getCell('E' . $row)->getValue();

                // Skip baris header (usia tidak numerik)
                if ($usia !== null && $usia !== '' && !is_numeric($usia)) {
                    continue;
                }

                // Skip baris yang usia-nya di luar range wajar (kemungkinan sheet berbeda kolom)
                if (is_numeric($usia) && (int) $usia > 150) {
                    continue;
                }

                $difabelRaw = strtoupper(trim((string) $sheet->getCell('F' . $row)->getValue()));
                $difabel    = in_array($difabelRaw, ['Y', 'YA', '1', 'TRUE'], true);

                $noHp = $sheet->getCell('C' . $row)->getValue();
                if (!empty($noHp)) {
                    $noHp = (string) $noHp;
                    if (!str_starts_with($noHp, '0') && !str_starts_with($noHp, '+')) {
                        $noHp = '0' . $noHp;
                    }
                } else {
                    $noHp = null;
                }

                Petani::create([
                    'nama_petani'   => $nama,
                    'nik_petani'    => $sheet->getCell('B' . $row)->getValue() ?: null,
                    'no_hp_petani'  => $noHp,
                    'gender_petani' => $sheet->getCell('D' . $row)->getValue() ?: null,
                    'usia_petani'   => $sheet->getCell('E' . $row)->getValue() ?: null,
                    'difabel'       => $difabel,
                    'alamat_petani' => $sheet->getCell('G' . $row)->getValue() ?: null,
                ]);

                $inserted++;
            }

            $this->command->info("Sheet [{$sheet->getTitle()}]: selesai.");
        }

        $this->command->info("Total: {$inserted} petani berhasil diinsert.");
    }
}
