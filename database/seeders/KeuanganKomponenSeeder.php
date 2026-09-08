<?php

namespace Database\Seeders;

use App\Models\KeuanganKomponen;
use Illuminate\Database\Seeder;

class KeuanganKomponenSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['kode_componen' => '1', 'kode_sub' => '1.1', 'nama_sub_komponen' => 'Increase capacity and quality assurance of horticulture seeds production'],
            ['kode_componen' => '1', 'kode_sub' => '1.2', 'nama_sub_komponen' => 'Increase capacity of Food Crops and Horticulture Protection Institutes (BPTPH)'],
            ['kode_componen' => '1', 'kode_sub' => '1.3', 'nama_sub_komponen' => 'Improve soil fertility and water availibility in dry land horticulture clusters'],
            ['kode_componen' => '2', 'kode_sub' => '2.1', 'nama_sub_komponen' => 'Horticulture Cluster Development'],
            ['kode_componen' => '2', 'kode_sub' => '2.2', 'nama_sub_komponen' => 'Smart Farming (SF) Development'],
            ['kode_componen' => '3', 'kode_sub' => '3.1', 'nama_sub_komponen' => 'Harvest, post-harvest, and processing development of horticulture products'],
            ['kode_componen' => '3', 'kode_sub' => '3.2', 'nama_sub_komponen' => 'Improve horticultural products quality and food safety'],
            ['kode_componen' => '3', 'kode_sub' => '3.3', 'nama_sub_komponen' => 'Improve marketing strategies for horticultural products'],
            ['kode_componen' => '3', 'kode_sub' => '3.4', 'nama_sub_komponen' => 'Digitalization of project monitoring and support for Horticulture Clusters'],
            ['kode_componen' => '4', 'kode_sub' => '4.1', 'nama_sub_komponen' => 'Increasing the capacity of horticulture institution and stakeholders'],
            ['kode_componen' => '4', 'kode_sub' => '4.2', 'nama_sub_komponen' => 'HDDAP Project management'],
        ];

        foreach ($items as $item) {
            KeuanganKomponen::updateOrCreate(
                ['kode_sub' => $item['kode_sub']],
                $item,
            );
        }
    }
}
