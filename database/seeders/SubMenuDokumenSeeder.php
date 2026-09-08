<?php

namespace Database\Seeders;

use App\Models\DokumenKegiatan;
use App\Models\SubMenuDokumen;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SubMenuDokumenSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['nama' => 'Juknis', 'urutan' => 50],
            ['nama' => 'Laporan Kegiatan', 'urutan' => 40],
            ['nama' => 'Publikasi', 'urutan' => 30],
            ['nama' => 'Regulasi', 'urutan' => 20],
            ['nama' => 'Lainnya', 'urutan' => 10],
        ];

        foreach ($items as $item) {
            SubMenuDokumen::updateOrCreate(
                ['slug' => Str::slug($item['nama'])],
                [
                    ...$item,
                    'slug' => Str::slug($item['nama']),
                    'is_active' => true,
                ],
            );
        }

        $defaultId = SubMenuDokumen::query()->where('slug', 'lainnya')->value('id');

        if ($defaultId) {
            DokumenKegiatan::query()
                ->whereNull('sub_menu_dokumen_id')
                ->update(['sub_menu_dokumen_id' => $defaultId]);
        }
    }
}
