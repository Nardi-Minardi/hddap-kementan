<?php

namespace App\Services;

use App\Models\JnsKumoditas;
use App\Models\KabKota;
use App\Models\Petani;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class SebaranCpclService
{
    /**
     * @return list<string>
     */
    public function allowedKabKotaCodes(): array
    {
        return collect(config('cpcl.filter_kabupaten', []))
            ->pluck('code')
            ->filter()
            ->values()
            ->all();
    }

    public function buildKabupatenFilterOptions(array $kabupatenCounts): Collection
    {
        return collect(config('cpcl.filter_kabupaten', []))
            ->map(fn (array $kabupaten) => [
                'code' => $kabupaten['code'],
                'name' => $kabupaten['name'],
                'total' => $kabupatenCounts[$kabupaten['code']] ?? 0,
            ])
            ->values();
    }

    public function buildKomoditasFilterOptions(array $komoditasCounts): Collection
    {
        return JnsKumoditas::query()
            ->orderBy('id')
            ->get()
            ->map(fn (JnsKumoditas $jenis) => [
                'id' => $jenis->id,
                'name' => $jenis->jenis_kumoditas,
                'total' => $komoditasCounts[$jenis->id] ?? 0,
            ])
            ->values();
    }

    public function resolveKabKotaCode(mixed $kodeKota): ?string
    {
        $code = $this->normalizeKodeKota($kodeKota);

        if ($code === null) {
            return null;
        }

        return in_array($code, $this->allowedKabKotaCodes(), true) ? $code : null;
    }

    public function mapPoint(object $petani): ?array
    {
        $lat = is_numeric($petani->Latitude) ? (float) $petani->Latitude : null;
        $lng = is_numeric($petani->Longitude) ? (float) $petani->Longitude : null;

        if ($lat === null || $lng === null) {
            return null;
        }

        [$lat, $lng] = $this->normalizeCoordinates($lat, $lng);

        if ($lat < -90 || $lat > 90 || $lng < -180 || $lng > 180) {
            return null;
        }

        return [
            'id' => (int) $petani->id,
            'lat' => $lat,
            'lng' => $lng,
            'kab_kota_code' => $this->resolveKabKotaCode($petani->kode_kota),
            'jenis_kumoditas_id' => is_numeric($petani->jenis_kumoditas_id ?? null)
                ? (int) $petani->jenis_kumoditas_id
                : null,
        ];
    }

    /**
     * @return array{points: Collection, kabupaten: Collection, komoditas: Collection}
     */
    public function mapDataset(?string $kabKotaCode = null, ?int $jenisKumoditasId = null): array
    {
        $allowedCodes = $this->allowedKabKotaCodes();
        $kabupatenCounts = array_fill_keys($allowedCodes, 0);
        $komoditasCounts = [];

        $rawCounts = Petani::query()
            ->withCoordinates()
            ->whereNotNull('kode_kota')
            ->whereIn('kode_kota', array_map('intval', $allowedCodes))
            ->selectRaw('kode_kota, COUNT(*) as total')
            ->groupBy('kode_kota')
            ->pluck('total', 'kode_kota');

        foreach ($allowedCodes as $code) {
            $kabupatenCounts[$code] = (int) ($rawCounts->get((int) $code) ?? $rawCounts->get($code) ?? 0);
        }

        $points = collect();

        Petani::query()
            ->select([
                'm_petani.id',
                'm_petani.kode_kota',
                'm_petani.Latitude',
                'm_petani.Longitude',
                DB::raw('jk.id as jenis_kumoditas_id'),
            ])
            ->join('m_poktan as pt', 'm_petani.kode_poktan', '=', 'pt.id')
            ->join('m_cluster as c', 'pt.kode_cluster', '=', 'c.id')
            ->leftJoin('m_kumoditas as km', 'c.kode_kumoditas', '=', 'km.id')
            ->leftJoin('m_jns_kumoditas as jk', 'km.kodejns', '=', 'jk.id')
            ->withCoordinates()
            ->when($kabKotaCode, fn ($query) => $query->where('m_petani.kode_kota', (int) $kabKotaCode))
            ->when($jenisKumoditasId, fn ($query) => $query->where('jk.id', $jenisKumoditasId))
            ->orderBy('m_petani.id')
            ->chunkById(500, function ($petanis) use (&$points, &$komoditasCounts) {
                foreach ($petanis as $petani) {
                    $point = $this->mapPoint($petani);

                    if ($point === null) {
                        continue;
                    }

                    if ($point['jenis_kumoditas_id']) {
                        $komoditasCounts[$point['jenis_kumoditas_id']] =
                            ($komoditasCounts[$point['jenis_kumoditas_id']] ?? 0) + 1;
                    }

                    $points->push($point);
                }
            }, 'm_petani.id', 'id');

        return [
            'points' => $points->values(),
            'kabupaten' => $this->buildKabupatenFilterOptions($kabupatenCounts),
            'komoditas' => $this->buildKomoditasFilterOptions($komoditasCounts),
        ];
    }

    public function detailRows(Petani $petani): array
    {
        $labels = [
            'nama_petani' => 'Nama Petani',
            'gender_petani' => 'Gender',
            'difabel' => 'Difabel',
            'alamat_petani' => 'Alamat',
            'Luas Lahan (Ha)' => 'Luas Lahan',
            'Kelas Lereng' => 'Kelas Lereng',
            'Kemiringan' => 'Kemiringan',
            'Fungsi Kws. Hutan' => 'Fungsi Kawasan Hutan',
            'Latitude' => 'Latitude',
            'Longitude' => 'Longitude',
        ];

        $rows = [];

        foreach ($labels as $key => $label) {
            if (! array_key_exists($key, $petani->getAttributes())) {
                continue;
            }

            $rows[] = [
                'label' => $label,
                'value' => $this->formatDetailValue($key, $petani->getAttributes()[$key]),
            ];

            if ($key === 'alamat_petani') {
                $rows[] = [
                    'label' => 'Kabupaten/Kota',
                    'value' => $this->resolveKabKotaName($petani),
                ];

                foreach ($this->poktanDetailRows($petani) as $row) {
                    $rows[] = $row;
                }
            }
        }

        if (! collect($rows)->contains(fn (array $row) => $row['label'] === 'Kelompok Petani')) {
            foreach ($this->poktanDetailRows($petani) as $row) {
                $rows[] = $row;
            }
        }

        return $rows;
    }

    /**
     * @return list<array{label: string, value: string}>
     */
    private function poktanDetailRows(Petani $petani): array
    {
        $petani->loadMissing('poktan.cluster.kumoditas.jenisKumoditas');

        if (! $petani->poktan) {
            return [
                ['label' => 'Kelompok Petani', 'value' => '-'],
                ['label' => 'Cluster', 'value' => '-'],
            ];
        }

        return [
            [
                'label' => 'Kelompok Petani',
                'value' => filled($petani->poktan->nama_poktan) ? (string) $petani->poktan->nama_poktan : '-',
            ],
            [
                'label' => 'Cluster',
                'value' => filled($petani->poktan->cluster?->nama_cluster)
                    ? (string) $petani->poktan->cluster->nama_cluster
                    : '-',
            ],
            [
                'label' => 'Komoditas',
                'value' => filled($petani->poktan->cluster?->kumoditas?->kumoditas)
                    ? (string) $petani->poktan->cluster->kumoditas->kumoditas
                    : '-',
            ],
            [
                'label' => 'Jenis Komoditas',
                'value' => filled($petani->poktan->cluster?->kumoditas?->jenisKumoditas?->jenis_kumoditas)
                    ? (string) $petani->poktan->cluster->kumoditas->jenisKumoditas->jenis_kumoditas
                    : '-',
            ],
        ];
    }

    private function resolveKabKotaName(Petani $petani): string
    {
        $code = $this->normalizeKodeKota($petani->kode_kota);

        if ($code === null) {
            return '-';
        }

        $name = KabKota::query()->where('code', $code)->value('name');

        if (filled($name)) {
            return (string) $name;
        }

        $fromConfig = collect(config('cpcl.filter_kabupaten', []))
            ->firstWhere('code', $code);

        return filled($fromConfig['name'] ?? null) ? (string) $fromConfig['name'] : '-';
    }

    private function normalizeKodeKota(mixed $kodeKota): ?string
    {
        if ($kodeKota === null || $kodeKota === '') {
            return null;
        }

        if (is_numeric($kodeKota)) {
            $int = (int) $kodeKota;

            if ($int > 0 && $int < 1000) {
                $fromId = KabKota::query()->where('id', $int)->value('code');

                if ($fromId) {
                    return $fromId;
                }
            }
        }

        $digits = preg_replace('/\D/', '', (string) $kodeKota) ?? '';

        if ($digits === '') {
            return null;
        }

        return str_pad($digits, 4, '0', STR_PAD_LEFT);
    }

    private function formatDetailValue(string $key, mixed $value): string
    {
        if ($value === null || $value === '') {
            return '-';
        }

        if ($key === 'difabel') {
            return filter_var($value, FILTER_VALIDATE_BOOLEAN) ? 'Ya' : 'Tidak';
        }

        if (in_array($key, ['created_at', 'updated_at'], true) && $value) {
            return date('d M Y H:i', strtotime((string) $value));
        }

        return (string) $value;
    }

    /**
     * @return array{0: float, 1: float}
     */
    private function normalizeCoordinates(float $lat, float $lng): array
    {
        if (abs($lat) > 20 && abs($lng) <= 20) {
            return [$lng, $lat];
        }

        return [$lat, $lng];
    }
}
