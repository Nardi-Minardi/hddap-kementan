<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class WilayahSeeder extends Seeder
{
    private const BASE = 'https://raw.githubusercontent.com/open-admin-data/indonesia-administrative-divisions/main/data';

    public function run(): void
    {
        if ($this->hasCompleteWilayahData()) {
            $this->command?->warn('Data wilayah sudah ada, dilewati.');

            return;
        }

        $this->resetWilayahTables();

        $this->command?->info('Mengimpor provinsi...');
        $provinces = $this->fetchJson('/all-province.json');
        $this->insertChunked('m_provinsi', collect($provinces)->map(fn (array $item) => [
            'code'       => $item['code']['id'],
            'name'       => $item['name']['local'],
            'created_at' => now(),
            'updated_at' => now(),
        ])->all());

        $this->command?->info('Mengimpor kabupaten/kota...');
        $regencies = $this->fetchJson('/all-regency.json');
        $this->insertChunked('m_kab_kota', collect($regencies)->map(fn (array $item) => [
            'code'          => $item['code']['id'],
            'name'          => $item['name']['local'],
            'provinsi_code' => $item['parent']['id'],
            'created_at'    => now(),
            'updated_at'    => now(),
        ])->all());

        $this->command?->info('Mengimpor kecamatan...');
        $districts = $this->fetchJson('/all-district.json');
        $this->insertChunked('m_kecamatan', collect($districts)->map(fn (array $item) => [
            'code'          => $item['code']['id'],
            'name'          => $item['name']['local'],
            'kab_kota_code' => $item['parent']['id'],
            'created_at'    => now(),
            'updated_at'    => now(),
        ])->all());

        $this->command?->info('Mengimpor kelurahan/desa...');
        foreach ($provinces as $province) {
            $slug = $province['name']['slug'];
            $this->command?->line("  - {$province['name']['local']}");

            $villages = $this->fetchJson("/village-by-province/{$slug}.json");
            $this->insertChunked('m_kel_des', collect($villages)
                ->unique(fn (array $item) => $item['code']['id'])
                ->map(fn (array $item) => [
                    'code'           => $item['code']['id'],
                    'name'           => $item['name']['local'],
                    'kecamatan_code' => $item['parent']['id'],
                    'created_at'     => now(),
                    'updated_at'     => now(),
                ])->values()->all());
        }

        $this->command?->info('Seeder wilayah selesai.');
    }

    private function hasCompleteWilayahData(): bool
    {
        return DB::table('m_provinsi')->count() >= 34
            && DB::table('m_kab_kota')->count() >= 514
            && DB::table('m_kecamatan')->count() >= 7215
            && DB::table('m_kel_des')->count() >= 79000;
    }

    private function resetWilayahTables(): void
    {
        DB::table('m_kel_des')->truncate();
        DB::table('m_kecamatan')->truncate();
        DB::table('m_kab_kota')->truncate();
        DB::table('m_provinsi')->truncate();
    }

    private function fetchJson(string $path): array
    {
        $response = Http::timeout(300)->get(self::BASE.$path);

        if (! $response->successful()) {
            throw new \RuntimeException("Gagal mengunduh data wilayah: {$path}");
        }

        return $response->json();
    }

    private function insertChunked(string $table, array $rows, int $chunkSize = 500): void
    {
        foreach (array_chunk($rows, $chunkSize) as $chunk) {
            DB::table($table)->insert($chunk);
        }
    }
}
