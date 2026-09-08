<?php

namespace App\Services;

use App\Models\KeuanganKomponen;
use App\Models\KeuanganSubKomponen;
use App\Models\KeuanganSubKomponenDetail;
use App\Models\Pelatihan;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\ValidationException;

/**
 * Hierarki kegiatan HDDAP — sinkron OWP/AWP dengan master topik (PAM / pedoman).
 * Component → Sub Component → POK (3 segmen) → OWP (kode_owp penuh).
 */
class KeuanganStrukturService
{
    /** @var array<string, array{label: string, sub_components: array<string, mixed>}>|null */
    private ?array $treeCache = null;

    /** @var array<string, string>|null */
    private ?array $subComponentLabelCache = null;

    /** @var list<array{kode_sub: string, kode_pok: string, nama_kegiatan_pok: string}>|null */
    private ?array $pokMasterCache = null;

    /** @var list<array{kode_pok: string, kode_owp: string, nama_komponen_detail: string}>|null */
    private ?array $owpDetailMasterCache = null;

    /** @var array<string, string>|null */
    private ?array $pokSubCodeCache = null;

    /** @return array<string, array{label: string, sub_components: array<string, mixed>}> */
    public function tree(): array
    {
        if ($this->treeCache !== null) {
            return $this->treeCache;
        }

        $components = [];

        foreach ($this->pelatihanRows() as $row) {
            $parts = explode('.', (string) $row['kode_owp']);
            if (count($parts) < 4) {
                continue;
            }

            [$compNum, $subNum] = [$parts[0], $parts[1]];
            $subCode = "{$compNum}.{$subNum}";
            $pokCode = "{$compNum}.{$subNum}.{$parts[2]}";
            $owpCode = (string) $row['kode_owp'];

            if (! isset($components[$compNum])) {
                $components[$compNum] = [
                    'value' => $compNum,
                    'label' => $this->componentLabel($compNum, (string) $row['komponen']),
                    'sub_components' => [],
                ];
            }

            if (! isset($components[$compNum]['sub_components'][$subCode])) {
                $components[$compNum]['sub_components'][$subCode] = [
                    'value' => $subCode,
                    'label' => $this->subComponentLabel($subCode),
                    'pok' => [],
                ];
            }

            if (! isset($components[$compNum]['sub_components'][$subCode]['pok'][$pokCode])) {
                $components[$compNum]['sub_components'][$subCode]['pok'][$pokCode] = [
                    'value' => $pokCode,
                    'label' => "POK {$pokCode}",
                    'owp' => [],
                ];
            }

            $components[$compNum]['sub_components'][$subCode]['pok'][$pokCode]['owp'][$owpCode] = [
                'value' => $owpCode,
                'label' => "{$owpCode} — {$row['nama_kegiatan']}",
                'uraian_kegiatan' => $row['nama_kegiatan'],
                'kategori_belanja' => $this->guessKategoriBelanja((string) $row['nama_kegiatan']),
            ];
        }

        foreach (config('keuangan_struktur.components', []) as $compNum => $name) {
            $compNum = (string) $compNum;

            if (! isset($components[$compNum])) {
                $components[$compNum] = [
                    'value' => $compNum,
                    'label' => $this->componentLabel($compNum, ''),
                    'sub_components' => [],
                ];
            } else {
                $components[$compNum]['label'] = $this->componentLabel($compNum, '');
            }
        }

        foreach ($this->subComponentLabels() as $subCode => $label) {
            $parts = explode('.', $subCode);
            if (count($parts) < 2) {
                continue;
            }

            $compNum = $parts[0];

            if (! isset($components[$compNum])) {
                $components[$compNum] = [
                    'value' => $compNum,
                    'label' => $this->componentLabel($compNum, ''),
                    'sub_components' => [],
                ];
            }

            if (! isset($components[$compNum]['sub_components'][$subCode])) {
                $components[$compNum]['sub_components'][$subCode] = [
                    'value' => $subCode,
                    'label' => $label,
                    'pok' => [],
                ];
            } else {
                $components[$compNum]['sub_components'][$subCode]['label'] = $label;
            }
        }

        foreach ($this->pokMasterRows() as $pokRow) {
            $subCode = $pokRow['kode_sub'];
            $pokCode = $pokRow['kode_pok'];
            $parts = explode('.', $subCode);

            if (count($parts) < 2) {
                continue;
            }

            $compNum = $parts[0];
            $namaKegiatanPok = $pokRow['nama_kegiatan_pok'];

            if (! isset($components[$compNum])) {
                $components[$compNum] = [
                    'value' => $compNum,
                    'label' => $this->componentLabel($compNum, ''),
                    'sub_components' => [],
                ];
            }

            if (! isset($components[$compNum]['sub_components'][$subCode])) {
                $components[$compNum]['sub_components'][$subCode] = [
                    'value' => $subCode,
                    'label' => $this->subComponentLabel($subCode),
                    'pok' => [],
                ];
            }

            $components[$compNum]['sub_components'][$subCode]['pok'][$pokCode] = [
                'value' => $pokCode,
                'label' => "{$pokCode} — {$namaKegiatanPok}",
                'nama_kegiatan_pok' => $namaKegiatanPok,
                'owp' => $components[$compNum]['sub_components'][$subCode]['pok'][$pokCode]['owp'] ?? [],
            ];
        }

        foreach ($this->owpDetailMasterRows() as $detailRow) {
            $pokCode = $detailRow['kode_pok'];
            $owpCode = $detailRow['kode_owp'];
            $subCode = $this->pokSubCode($pokCode);
            $parts = explode('.', $subCode);

            if ($subCode === '' || count($parts) < 2) {
                continue;
            }

            $compNum = $parts[0];
            $namaDetail = $detailRow['nama_komponen_detail'];

            if (! isset($components[$compNum])) {
                $components[$compNum] = [
                    'value' => $compNum,
                    'label' => $this->componentLabel($compNum, ''),
                    'sub_components' => [],
                ];
            }

            if (! isset($components[$compNum]['sub_components'][$subCode])) {
                $components[$compNum]['sub_components'][$subCode] = [
                    'value' => $subCode,
                    'label' => $this->subComponentLabel($subCode),
                    'pok' => [],
                ];
            }

            if (! isset($components[$compNum]['sub_components'][$subCode]['pok'][$pokCode])) {
                $components[$compNum]['sub_components'][$subCode]['pok'][$pokCode] = [
                    'value' => $pokCode,
                    'label' => "POK {$pokCode}",
                    'nama_kegiatan_pok' => '',
                    'owp' => [],
                ];
            }

            $components[$compNum]['sub_components'][$subCode]['pok'][$pokCode]['owp'][$owpCode] = [
                'value' => $owpCode,
                'label' => "{$owpCode} — {$namaDetail}",
                'uraian_kegiatan' => $namaDetail,
                'kategori_belanja' => $this->guessKategoriBelanja($namaDetail),
            ];
        }

        ksort($components);
        foreach ($components as &$component) {
            ksort($component['sub_components']);
            foreach ($component['sub_components'] as &$sub) {
                ksort($sub['pok']);
                foreach ($sub['pok'] as &$pok) {
                    ksort($pok['owp']);

                    if (empty($pok['nama_kegiatan_pok'])) {
                        $owpNames = array_map(
                            fn (array $owp) => (string) $owp['uraian_kegiatan'],
                            $pok['owp'],
                        );
                        $pok['nama_kegiatan_pok'] = $this->derivePokNama($owpNames);
                    }

                    $pok['label'] = ($pok['nama_kegiatan_pok'] ?? '') !== ''
                        ? "{$pok['value']} — {$pok['nama_kegiatan_pok']}"
                        : "POK {$pok['value']}";
                    $pok['owp'] = array_values($pok['owp']);
                }
                $sub['pok'] = array_values($sub['pok']);
            }
            $component['sub_components'] = array_values($component['sub_components']);
        }
        unset($component, $sub, $pok);

        return $this->treeCache = $components;
    }

    /** @return list<array{value: string, label: string}> */
    public function componentOptions(): array
    {
        return collect($this->tree())
            ->map(fn (array $item) => ['value' => $item['value'], 'label' => $item['label']])
            ->values()
            ->all();
    }

    /** @return list<string> */
    public function allowedKodeAkunForKategori(?string $kategoriBelanja): array
    {
        $groups = config('keuangan_akun.groups', []);
        $akun = config('keuangan_akun.akun', []);

        if ($kategoriBelanja === 'civil') {
            $codes = collect($groups)->firstWhere('label', 'Civil Works, Goods, Mechanical and Equipment')['codes'] ?? [];

            return array_values(array_intersect($codes, array_keys($akun)));
        }

        if ($kategoriBelanja === 'consulting') {
            $codes = collect($groups)->firstWhere('label', 'Consulting Services & Incremental Operation Costs')['codes'] ?? [];

            return array_values(array_intersect($codes, array_keys($akun)));
        }

        return array_keys($akun);
    }

    /** @param array<string, mixed> $data */
    public function assertValidHierarchy(array $data): void
    {
        $component = (string) ($data['component'] ?? '');
        $subComponent = (string) ($data['sub_component'] ?? '');
        $kodePok = (string) ($data['kode_pok'] ?? '');
        $kodeOwp = (string) ($data['kode_owp'] ?? '');

        $owp = $this->findOwp($component, $subComponent, $kodePok, $kodeOwp);

        if ($owp === null) {
            throw ValidationException::withMessages([
                'kode_owp' => 'Kombinasi Component, Sub Component, POK, dan Kode OWP tidak sesuai master kegiatan HDDAP.',
            ]);
        }

        $pokMaster = collect($this->pokMasterRows())->firstWhere('kode_pok', $kodePok);
        if ($pokMaster !== null && ($pokMaster['kode_sub'] ?? '') !== $subComponent) {
            throw ValidationException::withMessages([
                'kode_pok' => 'Kode POK tidak sesuai Sub Component yang dipilih.',
            ]);
        }
    }

    /** @return array{value: string, label: string, nama_kegiatan_pok: string}|null */
    public function findPok(string $component, string $subComponent, string $kodePok): ?array
    {
        foreach ($this->tree()[$component]['sub_components'] ?? [] as $sub) {
            if (($sub['value'] ?? '') !== $subComponent) {
                continue;
            }

            foreach ($sub['pok'] ?? [] as $pok) {
                if (($pok['value'] ?? '') === $kodePok) {
                    return [
                        'value' => (string) $pok['value'],
                        'label' => (string) $pok['label'],
                        'nama_kegiatan_pok' => (string) ($pok['nama_kegiatan_pok'] ?? ''),
                    ];
                }
            }
        }

        $master = collect($this->pokMasterRows())->first(
            fn (array $row) => $row['kode_pok'] === $kodePok && $row['kode_sub'] === $subComponent,
        );

        if ($master === null) {
            return null;
        }

        return [
            'value' => $master['kode_pok'],
            'label' => "{$master['kode_pok']} — {$master['nama_kegiatan_pok']}",
            'nama_kegiatan_pok' => $master['nama_kegiatan_pok'],
        ];
    }

    /**
     * @return array{
     *     nama_component: string,
     *     nama_sub_komponen: string,
     *     nama_kegiatan_pok: string,
     *     nama_komponen_detail: string,
     * }
     */
    public function resolveHierarchyNames(
        string $component,
        string $subComponent,
        string $kodePok,
        string $kodeOwp,
    ): array {
        $componentNames = config('keuangan_struktur.components', []);
        $namaComponent = $componentNames[$component] ?? "Component {$component}";

        $subLabel = $this->subComponentLabels()[$subComponent] ?? $subComponent;
        $namaSubKomponen = $this->stripCodePrefix($subLabel);

        $pok = $this->findPok($component, $subComponent, $kodePok);
        $namaKegiatanPok = ($pok['nama_kegiatan_pok'] ?? '') !== ''
            ? $pok['nama_kegiatan_pok']
            : $kodePok;

        $detail = collect($this->owpDetailMasterRows())->first(
            fn (array $row) => $row['kode_owp'] === $kodeOwp && $row['kode_pok'] === $kodePok,
        );

        if ($detail !== null) {
            $namaKomponenDetail = $detail['nama_komponen_detail'];
        } else {
            $owp = $this->findOwp($component, $subComponent, $kodePok, $kodeOwp);
            $namaKomponenDetail = $owp['uraian_kegiatan'] ?? $kodeOwp;
        }

        return [
            'nama_component' => $namaComponent,
            'nama_sub_komponen' => $namaSubKomponen,
            'nama_kegiatan_pok' => $namaKegiatanPok,
            'nama_komponen_detail' => $namaKomponenDetail,
        ];
    }

    /** @return array{uraian_kegiatan: string, kategori_belanja: string}|null */
    public function findOwp(string $component, string $subComponent, string $kodePok, string $kodeOwp): ?array
    {
        foreach ($this->tree()[$component]['sub_components'] ?? [] as $sub) {
            if (($sub['value'] ?? '') !== $subComponent) {
                continue;
            }

            foreach ($sub['pok'] ?? [] as $pok) {
                if (($pok['value'] ?? '') !== $kodePok) {
                    continue;
                }

                foreach ($pok['owp'] ?? [] as $owp) {
                    if (($owp['value'] ?? '') === $kodeOwp) {
                        return [
                            'uraian_kegiatan' => (string) $owp['uraian_kegiatan'],
                            'kategori_belanja' => (string) ($owp['kategori_belanja'] ?? 'consulting'),
                        ];
                    }
                }
            }
        }

        $detail = collect($this->owpDetailMasterRows())->first(
            fn (array $row) => $row['kode_pok'] === $kodePok && $row['kode_owp'] === $kodeOwp,
        );

        if ($detail === null || $this->pokSubCode($kodePok) !== $subComponent) {
            return null;
        }

        return [
            'uraian_kegiatan' => $detail['nama_komponen_detail'],
            'kategori_belanja' => $this->guessKategoriBelanja($detail['nama_komponen_detail']),
        ];
    }

    /** @return list<array{komponen: string, kode_owp: string, nama_kegiatan: string}> */
    private function pelatihanRows(): array
    {
        return Pelatihan::query()
            ->orderBy('kode_owp')
            ->get(['komponen', 'kode_owp', 'nama_kegiatan'])
            ->map(fn (Pelatihan $item) => [
                'komponen' => (string) $item->komponen,
                'kode_owp' => (string) $item->kode_owp,
                'nama_kegiatan' => (string) $item->nama_kegiatan,
            ])
            ->all();
    }

    private function componentLabel(string $compNum, string $komponenLabel): string
    {
        $names = config('keuangan_struktur.components', []);

        if (isset($names[$compNum])) {
            return "{$compNum} — {$names[$compNum]}";
        }

        return $komponenLabel !== '' ? "{$compNum} — {$komponenLabel}" : "Component {$compNum}";
    }

    /** @return array<string, string> */
    private function subComponentLabels(): array
    {
        if ($this->subComponentLabelCache !== null) {
            return $this->subComponentLabelCache;
        }

        if (! Schema::hasTable('tr_keuangan_komponen')) {
            return $this->subComponentLabelCache = [];
        }

        return $this->subComponentLabelCache = KeuanganKomponen::query()
            ->orderBy('kode_sub')
            ->get(['kode_sub', 'nama_sub_komponen'])
            ->mapWithKeys(fn (KeuanganKomponen $item) => [
                (string) $item->kode_sub => "{$item->kode_sub} — {$item->nama_sub_komponen}",
            ])
            ->all();
    }

    private function subComponentLabel(string $subCode): string
    {
        return $this->subComponentLabels()[$subCode] ?? "Sub Component {$subCode}";
    }

    private function stripCodePrefix(string $label): string
    {
        if (preg_match('/^\d+(?:\.\d+)* — (.+)$/u', $label, $matches)) {
            return $matches[1];
        }

        return $label;
    }

    /** @return list<array{kode_sub: string, kode_pok: string, nama_kegiatan_pok: string}> */
    private function pokMasterRows(): array
    {
        if ($this->pokMasterCache !== null) {
            return $this->pokMasterCache;
        }

        if (! Schema::hasTable('tr_keuangan_sub_komponen')) {
            return $this->pokMasterCache = [];
        }

        return $this->pokMasterCache = KeuanganSubKomponen::query()
            ->orderBy('kode_pok')
            ->get(['kode_sub', 'kode_pok', 'nama_kegiatan_pok'])
            ->map(fn (KeuanganSubKomponen $item) => [
                'kode_sub' => (string) $item->kode_sub,
                'kode_pok' => (string) $item->kode_pok,
                'nama_kegiatan_pok' => (string) $item->nama_kegiatan_pok,
            ])
            ->all();
    }

    /** @return list<array{kode_pok: string, kode_owp: string, nama_komponen_detail: string}> */
    private function owpDetailMasterRows(): array
    {
        if ($this->owpDetailMasterCache !== null) {
            return $this->owpDetailMasterCache;
        }

        if (! Schema::hasTable('tr_keuangan_sub_kom_d')) {
            return $this->owpDetailMasterCache = [];
        }

        return $this->owpDetailMasterCache = KeuanganSubKomponenDetail::query()
            ->orderBy('kode_owp')
            ->get(['kode_pok', 'kode_owp', 'nama_komponen_detail'])
            ->map(fn (KeuanganSubKomponenDetail $item) => [
                'kode_pok' => (string) $item->kode_pok,
                'kode_owp' => (string) $item->kode_owp,
                'nama_komponen_detail' => (string) $item->nama_komponen_detail,
            ])
            ->all();
    }

    private function pokSubCode(string $kodePok): string
    {
        if ($this->pokSubCodeCache === null) {
            $this->pokSubCodeCache = collect($this->pokMasterRows())
                ->mapWithKeys(fn (array $row) => [$row['kode_pok'] => $row['kode_sub']])
                ->all();
        }

        if (isset($this->pokSubCodeCache[$kodePok])) {
            return $this->pokSubCodeCache[$kodePok];
        }

        $parts = explode('.', $kodePok);

        return count($parts) >= 2 ? "{$parts[0]}.{$parts[1]}" : '';
    }

    private function guessKategoriBelanja(string $namaKegiatan): string
    {
        $lower = mb_strtolower($namaKegiatan);

        $civilKeywords = [
            'pengadaan', 'konstruksi', 'bangunan', 'jaringan', 'mesin', 'peralatan', 'infrastruktur',
            'construction', 'equipment', 'facilities', 'machinery', 'procurement',
        ];

        foreach ($civilKeywords as $keyword) {
            if (str_contains($lower, $keyword)) {
                return 'civil';
            }
        }

        return 'consulting';
    }

    /** @param list<string> $owpNames */
    private function derivePokNama(array $owpNames): string
    {
        $names = array_values(array_filter(array_map('trim', $owpNames)));

        if ($names === []) {
            return '';
        }

        if (count($names) === 1) {
            return $names[0];
        }

        $prefix = $names[0];

        foreach (array_slice($names, 1) as $name) {
            $max = min(mb_strlen($prefix), mb_strlen($name));
            $shared = 0;

            for ($i = 0; $i < $max; $i++) {
                if (mb_strtolower(mb_substr($prefix, $i, 1)) !== mb_strtolower(mb_substr($name, $i, 1))) {
                    break;
                }

                $shared++;
            }

            $prefix = rtrim(mb_substr($prefix, 0, $shared));
        }

        $prefix = rtrim($prefix, " ,;/-–—");

        if (mb_strlen($prefix) >= 20) {
            return $prefix;
        }

        return $names[0];
    }
}
