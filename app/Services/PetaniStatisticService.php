<?php

namespace App\Services;

use App\Models\Cluster;
use App\Models\KabKota;
use App\Models\Petani;
use App\Models\Poktan;
use App\Support\NikParser;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class PetaniStatisticService
{
    private const PEMUDA_MIN_AGE = 16;

    private const PEMUDA_MAX_AGE = 35;

    private const ANGGOTA_PER_HH = 5;

    private const LUAS_LAHAN_COLUMN = 'luas_lahan_ha';

    private const TAHAP_COLUMN = 'tahap';

    private ?string $tahap = null;

    public function __construct(
        private readonly NikParser $nikParser,
    ) {}

    public function withTahap(?string $tahap): self
    {
        $instance = clone $this;
        $instance->tahap = $tahap !== '' ? $tahap : null;

        return $instance;
    }

    public function getTahapOptions(): array
    {
        return Petani::query()
            ->whereNotNull(self::TAHAP_COLUMN)
            ->where(self::TAHAP_COLUMN, '!=', '')
            ->select(self::TAHAP_COLUMN)
            ->distinct()
            ->orderBy(self::TAHAP_COLUMN)
            ->pluck(self::TAHAP_COLUMN)
            ->map(fn ($tahap) => [
                'label' => 'Tahap '.(string) $tahap,
                'value' => (string) $tahap,
            ])
            ->values()
            ->all();
    }

    public function welcomeAiTaniStats(): array
    {
        $kabCodesInt = collect($this->hddapKabCodes())
            ->map(fn (string $code) => (int) $code)
            ->all();

        return [
            'totalPetani' => Petani::query()->dukunganProyek()->count(),
            'jumlahCluster' => Cluster::query()->count(),
            'jumlahPoktan' => Poktan::query()->count(),
            'jumlahLokasiHddap' => Cluster::query()
                ->whereIn('kode_kota', $kabCodesInt)
                ->distinct()
                ->count('kode_kota'),
        ];
    }

    public function welcomeHomeStats(): array
    {
        $kabCodes = $this->hddapKabCodes();

        return [
            'provinsi' => KabKota::query()
                ->whereIn('code', $kabCodes)
                ->distinct()
                ->count('provinsi_code'),
            'kabKota' => count($kabCodes),
            'totalPetani' => Petani::query()
                ->dukunganProyek()
                ->count(),
            'luasLahan' => $this->totalLuasLahan(),
        ];
    }

    /** @return list<string> */
    private function hddapKabCodes(): array
    {
        return collect(config('cpcl.filter_kabupaten', []))
            ->pluck('code')
            ->filter()
            ->values()
            ->all();
    }

    public function dashboardCpclSummary(?array $kabKotaIntCodes = null): array
    {
        $petaniQuery = Petani::query()->where('jmlah_petani', 1);

        if ($kabKotaIntCodes !== null) {
            $petaniQuery->whereIn('kode_kota', $kabKotaIntCodes);
        }

        $petani = $petaniQuery->get(['gender_petani', 'nik_petani', 'kode_kota']);

        $total = $petani->count();
        $lakiLaki = 0;
        $perempuan = 0;

        foreach ($petani as $row) {
            if ($this->nikParser->isFemaleGender($row->gender_petani, $row->nik_petani)) {
                $perempuan++;
            } else {
                $lakiLaki++;
            }
        }

        return [
            'total' => $total,
            'gender' => [
                [
                    'label' => 'Laki-laki',
                    'key' => 'L',
                    'value' => $lakiLaki,
                    'color' => '#2563eb',
                ],
                [
                    'label' => 'Perempuan',
                    'key' => 'P',
                    'value' => $perempuan,
                    'color' => '#db2777',
                ],
            ],
            'clusterByKabupaten' => $this->dashboardClusterByKabupaten($kabKotaIntCodes),
            'komoditasByKabupaten' => $this->dashboardKomoditasByKabupaten($kabKotaIntCodes),
        ];
    }

    public function dashboardClusterByKabupaten(?array $kabKotaIntCodes = null): array
    {
        $query = DB::table('m_cluster')
            ->selectRaw('kode_kota, MAX(nama_kota) as nama_kota, COUNT(*) as total')
            ->groupBy('kode_kota')
            ->orderBy('kode_kota');

        if ($kabKotaIntCodes !== null) {
            $query->whereIn('kode_kota', $kabKotaIntCodes);
        }

        return $query->get()
            ->map(fn ($row) => [
                'label' => $this->resolveKabKotaLabel($row->kode_kota, $row->nama_kota),
                'value' => (int) $row->total,
            ])
            ->values()
            ->all();
    }

    public function dashboardKomoditasByKabupaten(?array $kabKotaIntCodes = null): array
    {
        $query = DB::table('m_cluster')
            ->selectRaw('kode_kota, MAX(nama_kota) as nama_kota, COUNT(DISTINCT kode_kumoditas) as total')
            ->groupBy('kode_kota')
            ->orderBy('kode_kota');

        if ($kabKotaIntCodes !== null) {
            $query->whereIn('kode_kota', $kabKotaIntCodes);
        }

        return $query->get()
            ->map(fn ($row) => [
                'label' => $this->resolveKabKotaLabel($row->kode_kota, $row->nama_kota),
                'value' => (int) $row->total,
            ])
            ->values()
            ->all();
    }

    private function resolveKabKotaLabel(mixed $kodeKota, ?string $fallbackName = null): string
    {
        $code = $this->normalizeKabKotaCode($kodeKota);

        if ($code !== null) {
            $name = KabKota::query()->where('code', $code)->value('name');

            if (filled($name)) {
                return (string) $name;
            }

            $fromConfig = collect(config('cpcl.filter_kabupaten', []))
                ->firstWhere('code', $code);

            if (filled($fromConfig['name'] ?? null)) {
                return (string) $fromConfig['name'];
            }
        }

        return filled($fallbackName) ? (string) $fallbackName : '-';
    }

    private function normalizeKabKotaCode(mixed $kodeKota): ?string
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

        return $digits === '' ? null : str_pad($digits, 4, '0', STR_PAD_LEFT);
    }

    public function dukunganPetani(): Collection
    {
        return $this->baseQuery()
            ->orderBy('id')
            ->get(['id', 'nik_petani', 'gender_petani', 'usia_petani', 'jmlah_petani', self::TAHAP_COLUMN]);
    }

    public function summarize(): array
    {
        $petani = $this->dukunganPetani();
        $total = $petani->count();

        if ($total === 0) {
            return [
                'total' => 0,
                'female_percentage' => 0,
                'youth_percentage' => 0,
            ];
        }

        $femaleCount = $petani->filter(fn (Petani $row) => $this->isFemale($row))->count();
        $youthCount = $petani->filter(fn (Petani $row) => $this->isPemuda($this->resolveAge($row)))->count();

        return [
            'total' => $total,
            'female_percentage' => (int) round(($femaleCount / $total) * 100),
            'youth_percentage' => (int) round(($youthCount / $total) * 100),
        ];
    }

    public function formatLogframeRealisasi(): string
    {
        $summary = $this->summarize();

        if ($summary['total'] === 0) {
            return '-';
        }

        $total = $this->formatNumber($summary['total']);

        return sprintf(
            '%s dengan %d%% perempuan dan %d%% pemuda',
            $total,
            $summary['female_percentage'],
            $summary['youth_percentage'],
        );
    }

    public function formatRumahTanggaRealisasi(): string
    {
        $total = $this->dukunganPetani()->count();

        if ($total === 0) {
            return '-';
        }

        return $this->formatNumber($total).' HHs';
    }

    public function formatAnggotaHhRealisasi(): string
    {
        $total = $this->dukunganPetani()->count() * self::ANGGOTA_PER_HH;

        if ($total === 0) {
            return '-';
        }

        return $this->formatNumber($total);
    }

    public function totalLuasLahan(): float
    {
        $query = Petani::query();
        $this->applyTahapFilter($query);

        return (float) $query->sum(self::LUAS_LAHAN_COLUMN);
    }

    public function formatLuasLahanRealisasi(): string
    {
        $total = $this->totalLuasLahan();

        if ($total <= 0) {
            return '-';
        }

        return $this->formatDecimal($total).' Ha';
    }

    public function isPetaniDukunganIndicator(string $namaIndikator): bool
    {
        return str_contains(strtolower($namaIndikator), 'jumlah petani yang didukung');
    }

    public function isRumahTanggaIndicator(string $namaIndikator): bool
    {
        return str_contains(strtolower($namaIndikator), 'jumlah rumah tangga');
    }

    public function isAnggotaHhIndicator(string $namaIndikator): bool
    {
        return str_contains(strtolower($namaIndikator), 'perkiraan jumlah anggota hh');
    }

    public function isLuasLahanIndicator(string $namaIndikator): bool
    {
        return str_contains(strtolower($namaIndikator), 'total luas lahan kering');
    }

    public function resolveRealisasiForIndicator(?string $namaIndikator, ?string $storedRealisasi): ?string
    {
        if ($namaIndikator === null) {
            return $storedRealisasi;
        }

        if ($this->isPetaniDukunganIndicator($namaIndikator)) {
            return $this->formatLogframeRealisasi();
        }

        if ($this->isRumahTanggaIndicator($namaIndikator)) {
            return $this->formatRumahTanggaRealisasi();
        }

        if ($this->isAnggotaHhIndicator($namaIndikator)) {
            return $this->formatAnggotaHhRealisasi();
        }

        if ($this->isLuasLahanIndicator($namaIndikator)) {
            return $this->formatLuasLahanRealisasi();
        }

        return $storedRealisasi;
    }

    private function baseQuery()
    {
        $query = Petani::query()->where('jmlah_petani', 1);

        return $this->applyTahapFilter($query);
    }

    private function applyTahapFilter($query)
    {
        if ($this->tahap !== null) {
            $query->where(self::TAHAP_COLUMN, $this->tahap);
        }

        return $query;
    }

    private function formatNumber(int $value): string
    {
        return number_format($value, 0, ',', '.');
    }

    private function formatDecimal(float $value): string
    {
        return rtrim(rtrim(number_format($value, 2, ',', '.'), '0'), ',');
    }

    private function resolveAge(Petani $petani): ?int
    {
        $ageFromNik = $this->nikParser->age($petani->nik_petani);

        if ($ageFromNik !== null) {
            return $ageFromNik;
        }

        return is_numeric($petani->usia_petani) ? (int) $petani->usia_petani : null;
    }

    private function isFemale(Petani $petani): bool
    {
        return $this->nikParser->isFemaleGender($petani->gender_petani, $petani->nik_petani);
    }

    private function isPemuda(?int $age): bool
    {
        return $age !== null && $age >= self::PEMUDA_MIN_AGE && $age <= self::PEMUDA_MAX_AGE;
    }
}
