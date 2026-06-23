<?php

namespace Database\Seeders;

use App\Models\KelompokPetani;
use Illuminate\Database\Seeder;
use PhpOffice\PhpSpreadsheet\IOFactory;

class KelompokPetaniSeeder extends Seeder
{
    public function run(): void
    {
        $filePath = public_path('import/m_kelompok_tani.xlsx');

        $spreadsheet = IOFactory::load($filePath);
        $sheet = $spreadsheet->getActiveSheet();

        $lastRow = $sheet->getHighestDataRow();

        $currentProvinsiRaw = null;

        // Baris 1 = header, data mulai baris 2
        for ($row = 2; $row <= $lastRow; $row++) {
            $namaPoktanRaw = $sheet->getCell('F' . $row)->getValue();

            // Skip baris kosong
            if (empty($namaPoktanRaw)) {
                continue;
            }

            // Kolom C: "Provinsi/Kab. Kota" — carry forward jika kosong
            $provinsiKabRaw = $sheet->getCell('C' . $row)->getValue();
            if (!empty($provinsiKabRaw)) {
                $currentProvinsiRaw = $provinsiKabRaw;
            }

            // Split "Jawa Tengah/Kab. Batang" menjadi provinsi_name dan kab_kota_name
            $provinsiName = null;
            $kabKotaName  = null;
            if (!empty($currentProvinsiRaw)) {
                $parts = explode('/', $currentProvinsiRaw, 2);
                $provinsiName = trim($parts[0]) ?: null;
                $kabKotaName  = isset($parts[1]) ? trim($parts[1]) : null;
            }

            KelompokPetani::create([
                'provinsi_name'              => $provinsiName,
                'provinsi_id'                => null,
                'kab_kota_name'              => $kabKotaName,
                'kab_kota_id'                => null,
                'kecamatan_name'             => $sheet->getCell('D' . $row)->getValue() ?: null,
                'kecamatan_id'               => null,
                'kel_des_name'               => $sheet->getCell('E' . $row)->getValue() ?: null,
                'kel_des_id'                 => null,
                'nama_poktan'                => $namaPoktanRaw,
                'luas_layanan_poktan'        => $sheet->getCell('G' . $row)->getValue() ?: null,
                'tahun_pembentukan'          => $sheet->getCell('H' . $row)->getValue() ?: null,
                'diketahui_pic'              => $sheet->getCell('I' . $row)->getValue() ?: null,
                'sk_bupati'                  => $sheet->getCell('J' . $row)->getValue() ?: null,
                'akte_notaris'               => $sheet->getCell('K' . $row)->getValue() ?: null,
                'ket_terdaftar_pengadilan'   => $sheet->getCell('L' . $row)->getValue() ?: null,
                'nama_ketua_poktan'          => $sheet->getCell('M' . $row)->getValue() ?: null,
                'no_hp_ketua_poktan'         => $sheet->getCell('N' . $row)->getValue() ?: null,
                'gender_ketua_poktan'        => $sheet->getCell('O' . $row)->getValue() ?: null,
                'gender_wakil_poktan'        => $sheet->getCell('P' . $row)->getValue() ?: null,
                'gender_sekretaris_poktan'   => $sheet->getCell('Q' . $row)->getValue() ?: null,
                'gender_bendahara_poktan'    => $sheet->getCell('R' . $row)->getValue() ?: null,
                'jumlah_pengurus_poktan'     => $sheet->getCell('S' . $row)->getValue() ?: null,
                'jumlah_anggota_poktan'      => $sheet->getCell('T' . $row)->getValue() ?: null,
                'jumlah_anggota_pria_poktan' => $sheet->getCell('U' . $row)->getValue() ?: null,
                'jumlah_anggota_wanita_poktan' => $sheet->getCell('V' . $row)->getValue() ?: null,
                'ad_art'                     => $sheet->getCell('W' . $row)->getValue() ?: null,
                'alamat_kantor_sekretariat'  => $sheet->getCell('X' . $row)->getValue() ?: null,
                'pengisian_buku'             => $sheet->getCell('Y' . $row)->getValue() ?: null,
                'iuran'                      => $sheet->getCell('Z' . $row)->getValue() ?: null,
                'keterangan'                 => $sheet->getCell('AA' . $row)->getValue() ?: null,
            ]);
        }

        $this->command->info('KelompokPetani seeder selesai.');
    }
}
