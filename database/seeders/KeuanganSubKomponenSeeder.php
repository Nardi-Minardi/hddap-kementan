<?php

namespace Database\Seeders;

use App\Models\KeuanganSubKomponen;
use Illuminate\Database\Seeder;

class KeuanganSubKomponenSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['kode_sub' => '1.1', 'kode_pok' => '1.1.1', 'nama_kegiatan_pok' => 'Procurement of equipment and supporting facilities for seeding'],
            ['kode_sub' => '1.1', 'kode_pok' => '1.1.2', 'nama_kegiatan_pok' => 'Increase the availability of Horticulture foundation seed and stock seed'],
            ['kode_sub' => '1.1', 'kode_pok' => '1.1.3', 'nama_kegiatan_pok' => 'Increasing the capacity of officers in horticultural seed agencies'],
            ['kode_sub' => '1.1', 'kode_pok' => '1.1.4', 'nama_kegiatan_pok' => 'Develop Seed Quality Assurance System'],
            ['kode_sub' => '1.1', 'kode_pok' => '1.1.5', 'nama_kegiatan_pok' => 'Increase the capacity of the horticulture seed producers'],
            ['kode_sub' => '1.2', 'kode_pok' => '1.2.1', 'nama_kegiatan_pok' => 'Increasing Horticultural Protection Facilities'],
            ['kode_sub' => '1.2', 'kode_pok' => '1.2.2', 'nama_kegiatan_pok' => 'Increase the availability of antagonist microorganism, natural enemy, etc.'],
            ['kode_sub' => '1.2', 'kode_pok' => '1.2.3', 'nama_kegiatan_pok' => 'Technical Guidance for pest observer staff (POPT)'],
            ['kode_sub' => '1.2', 'kode_pok' => '1.2.4', 'nama_kegiatan_pok' => 'PHT Clinic Development'],
            ['kode_sub' => '1.3', 'kode_pok' => '1.3.1', 'nama_kegiatan_pok' => 'Develop water resources/irrigation infrastructure for horticulture clusters'],
            ['kode_sub' => '1.3', 'kode_pok' => '1.3.2', 'nama_kegiatan_pok' => 'Soil fertility Facilitation in horticulture clusters area'],
            ['kode_sub' => '1.3', 'kode_pok' => '1.3.3', 'nama_kegiatan_pok' => 'Implement land and water conservation in horticulture clusters area'],
            ['kode_sub' => '2.1', 'kode_pok' => '2.1.1', 'nama_kegiatan_pok' => 'Farmland development in horticulture cluster integrated with land and water infrastructures'],
            ['kode_sub' => '2.1', 'kode_pok' => '2.1.2', 'nama_kegiatan_pok' => 'Provision of agriculture inputs to support horticulture clusters'],
            ['kode_sub' => '2.1', 'kode_pok' => '2.1.3', 'nama_kegiatan_pok' => 'Implementing integrated and environmentally friendly pest management in horticulture clusters'],
            ['kode_sub' => '2.1', 'kode_pok' => '2.1.4', 'nama_kegiatan_pok' => 'Development of good cultivation practices in the horticulture cluster'],
            ['kode_sub' => '2.1', 'kode_pok' => '2.1.5', 'nama_kegiatan_pok' => 'Supporting Tools and Equipment in horticulture clusters'],
            ['kode_sub' => '2.1', 'kode_pok' => '2.1.6', 'nama_kegiatan_pok' => 'Supporting Agriculture Machinery to support priority agriculture'],
            ['kode_sub' => '2.2', 'kode_pok' => '2.2.1', 'nama_kegiatan_pok' => 'Identification of smart farming implementation'],
            ['kode_sub' => '2.2', 'kode_pok' => '2.2.2', 'nama_kegiatan_pok' => 'Development Smart-Farming'],
            ['kode_sub' => '3.1', 'kode_pok' => '3.1.1', 'nama_kegiatan_pok' => 'Development the harvest, post-harvest and processing facilities to support horticulture clusters'],
            ['kode_sub' => '3.1', 'kode_pok' => '3.1.2', 'nama_kegiatan_pok' => 'Development integrated packaging house for selected areas'],
            ['kode_sub' => '3.1', 'kode_pok' => '3.1.3', 'nama_kegiatan_pok' => 'Development of Processed Horticulture Products'],
            ['kode_sub' => '3.1', 'kode_pok' => '3.1.4', 'nama_kegiatan_pok' => 'Technical Guidance on Business Management for Post-Harvest and Horticulture Product Processing Business Groups'],
            ['kode_sub' => '3.1', 'kode_pok' => '3.1.5', 'nama_kegiatan_pok' => 'Financial and Literacy Education'],
            ['kode_sub' => '3.1', 'kode_pok' => '3.1.6', 'nama_kegiatan_pok' => 'Coordination with the selected financial institutions'],
            ['kode_sub' => '3.2', 'kode_pok' => '3.2.1', 'nama_kegiatan_pok' => 'Implementing GAP on horticulture clusters'],
            ['kode_sub' => '3.2', 'kode_pok' => '3.2.2', 'nama_kegiatan_pok' => 'Support the implementation of good handling practices'],
            ['kode_sub' => '3.2', 'kode_pok' => '3.2.3', 'nama_kegiatan_pok' => 'Registration and GAP certification of horticulture cluster'],
            ['kode_sub' => '3.3', 'kode_pok' => '3.3.1', 'nama_kegiatan_pok' => 'Facilitation of Horticulture Business Development and Marketin'],
            ['kode_sub' => '3.3', 'kode_pok' => '3.3.2', 'nama_kegiatan_pok' => 'Support horticulture clusters to enter digital marketing platform'],
            ['kode_sub' => '3.3', 'kode_pok' => '3.3.3', 'nama_kegiatan_pok' => 'Facilitation of Horticulture Product Marketing'],
            ['kode_sub' => '3.4', 'kode_pok' => '3.4.1', 'nama_kegiatan_pok' => 'Development traceability system for horticulture products in horticulture clusters area'],
            ['kode_sub' => '4.1', 'kode_pok' => '4.1.1', 'nama_kegiatan_pok' => 'increasing institutional capacity and horticulture stakeholders'],
            ['kode_sub' => '4.1', 'kode_pok' => '4.1.2', 'nama_kegiatan_pok' => 'Technical Guidance'],
            ['kode_sub' => '4.1', 'kode_pok' => '4.1.3', 'nama_kegiatan_pok' => 'Technical Guidance for Provincial Agricultural Agencies and District Agricultural Agencies'],
            ['kode_sub' => '4.1', 'kode_pok' => '4.1.4', 'nama_kegiatan_pok' => 'Technical Guidance for farmers and farmers group'],
            ['kode_sub' => '4.2', 'kode_pok' => '4.2.1', 'nama_kegiatan_pok' => 'Operational management'],
            ['kode_sub' => '4.2', 'kode_pok' => '4.2.2', 'nama_kegiatan_pok' => 'Consultant'],
        ];

        foreach ($items as $item) {
            KeuanganSubKomponen::updateOrCreate(
                ['kode_pok' => $item['kode_pok']],
                $item,
            );
        }
    }
}
