<?php

namespace App\Services;

use App\Models\KeuanganAwp;
use App\Models\KeuanganTransaksi;

class KeuanganService
{
    public function dashboardSummary(): array
    {
        $totalPagu = (float) KeuanganAwp::query()->sum('pagu');
        $totalCair = (float) KeuanganTransaksi::query()->sum('nilai_sp2d');
        $totalPemanfaatan = (float) KeuanganTransaksi::query()->sum('nilai_sp2d');
        $totalSisa = $totalPagu - $totalPemanfaatan;
        $persenPemanfaatan = $totalPagu > 0 ? ($totalPemanfaatan / $totalPagu) * 100 : 0;

        return [
            'total_pagu' => $totalPagu,
            'total_cair' => $totalCair,
            'total_pemanfaatan' => $totalPemanfaatan,
            'total_sisa' => $totalSisa,
            'persen_pemanfaatan' => round($persenPemanfaatan, 1),
            'jumlah_kegiatan' => KeuanganAwp::query()->count(),
        ];
    }

    /** @return list<array<string, mixed>> */
    public function awpMonitoring(): array
    {
        return KeuanganAwp::query()
            ->withSum('transaksi as total_cair', 'nilai_sp2d')
            ->withSum('transaksi as total_pemanfaatan', 'nilai_sp2d')
            ->orderBy('kode_awp')
            ->get()
            ->map(function (KeuanganAwp $awp) {
                $pagu = (float) $awp->pagu;
                $cair = (float) ($awp->total_cair ?? 0);
                $pemanfaatan = (float) ($awp->total_pemanfaatan ?? 0);
                $sisa = $pagu - $pemanfaatan;
                $persen = $pagu > 0 ? min(($pemanfaatan / $pagu) * 100, 100) : 0;

                return [
                    'id' => $awp->id,
                    'kode_awp' => $awp->kode_awp,
                    'nama_awp' => $awp->nama_awp,
                    'uraian_kegiatan' => $awp->uraian_kegiatan,
                    'kode_owp' => $awp->kode_owp,
                    'kode_pok' => $awp->kode_pok,
                    'component' => $awp->component,
                    'pagu' => $pagu,
                    'cair' => $cair,
                    'pemanfaatan' => $pemanfaatan,
                    'sisa' => $sisa,
                    'persen' => round($persen, 1),
                ];
            })
            ->values()
            ->all();
    }

    public static function generateKodeAwp(): string
    {
        $next = ((int) KeuanganAwp::query()->max('id')) + 1;

        return 'AWP-'.str_pad((string) $next, 4, '0', STR_PAD_LEFT);
    }

    public static function generateKodeTransaksi(): string
    {
        $next = ((int) KeuanganTransaksi::query()->max('id')) + 1;

        return 'TRX-'.str_pad((string) $next, 4, '0', STR_PAD_LEFT);
    }

    public static function hitungSelisihRekon(float $hddap, float $sakti, float $omspan, float $bank): float
    {
        return max(
            abs($hddap - $sakti),
            abs($hddap - $omspan),
            abs($hddap - $bank),
        );
    }
}
