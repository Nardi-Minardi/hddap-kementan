<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KeuanganAwp;
use App\Models\KeuanganRekonsiliasi;
use App\Models\KeuanganTransaksi;
use App\Services\KeuanganService;
use App\Services\KeuanganStrukturService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class KeuanganController extends Controller
{
    public function __construct(
        private KeuanganService $keuanganService,
        private KeuanganStrukturService $keuanganStrukturService,
    ) {}

    public function index(Request $request): Response
    {
        $awpList = KeuanganAwp::query()
            ->withCount('transaksi')
            ->withSum('transaksi as total_realisasi', 'nilai_sp2d')
            ->orderByDesc('id')
            ->get()
            ->map(function (KeuanganAwp $awp) {
                $labels = $this->keuanganStrukturService->resolveHierarchyNames(
                    (string) $awp->component,
                    (string) $awp->sub_component,
                    (string) $awp->kode_pok,
                    (string) $awp->kode_owp,
                );

                $pagu = (float) $awp->pagu;
                $totalRealisasi = (float) ($awp->total_realisasi ?? 0);
                $sisaPagu = max(0, $pagu - $totalRealisasi);

                return [
                    'id' => $awp->id,
                    'kode_awp' => $awp->kode_awp,
                    'nama_awp' => $awp->nama_awp,
                    'component' => $awp->component,
                    'sub_component' => $awp->sub_component,
                    'kode_owp' => $awp->kode_owp,
                    'kode_pok' => $awp->kode_pok,
                    'nama_component' => $labels['nama_component'],
                    'nama_sub_komponen' => $labels['nama_sub_komponen'],
                    'nama_kegiatan_pok' => $labels['nama_kegiatan_pok'],
                    'nama_komponen_detail' => $labels['nama_komponen_detail'],
                    'uraian_kegiatan' => $awp->uraian_kegiatan,
                    'kode_akun' => $awp->kode_akun,
                    'pagu' => $pagu,
                    'total_realisasi' => $totalRealisasi,
                    'sisa_pagu' => $sisaPagu,
                    'sumber_dana' => $awp->sumber_dana,
                    'transaksi_count' => $awp->transaksi_count,
                ];
            });

        $transaksiList = KeuanganTransaksi::query()
            ->with(['awp', 'rekonsiliasi'])
            ->orderByDesc('id')
            ->get()
            ->map(fn (KeuanganTransaksi $trx) => [
                'id' => $trx->id,
                'kode_transaksi' => $trx->kode_transaksi,
                'keuangan_awp_id' => $trx->keuangan_awp_id,
                'nama_awp' => $trx->awp?->nama_awp,
                'kode_owp' => $trx->awp?->kode_owp,
                'kode_pok' => $trx->awp?->kode_pok,
                'no_spm' => $trx->no_spm,
                'tgl_spm' => $trx->tgl_spm?->format('Y-m-d'),
                'nilai_spm' => (float) $trx->nilai_spm,
                'no_sp2d' => $trx->no_sp2d,
                'tgl_sp2d' => $trx->tgl_sp2d?->format('Y-m-d'),
                'nilai_sp2d' => (float) $trx->nilai_sp2d,
                'mekanisme_pembayaran' => $trx->mekanisme_pembayaran,
                'nilai_realisasi' => $trx->nilaiRealisasiMonitoring(),
                'keterangan' => $trx->keterangan,
                'rekon_status' => $trx->rekonsiliasi?->status,
                'rekon_selisih' => $trx->rekonsiliasi ? (float) $trx->rekonsiliasi->selisih : null,
            ]);

        $rekonList = KeuanganRekonsiliasi::query()
            ->with(['transaksi.awp'])
            ->orderByDesc('id')
            ->get()
            ->map(fn (KeuanganRekonsiliasi $rekon) => [
                'id' => $rekon->id,
                'keuangan_transaksi_id' => $rekon->keuangan_transaksi_id,
                'kode_transaksi' => $rekon->transaksi?->kode_transaksi,
                'no_sp2d' => $rekon->transaksi?->no_sp2d,
                'nilai_hddap' => (float) $rekon->nilai_hddap,
                'nilai_sakti' => (float) $rekon->nilai_sakti,
                'nilai_omspan' => (float) $rekon->nilai_omspan,
                'nilai_bank' => (float) $rekon->nilai_bank,
                'selisih' => (float) $rekon->selisih,
                'status' => $rekon->status,
            ]);

        return Inertia::render('Admin/Keuangan/Index', [
            'tab' => $request->string('tab')->toString() ?: 'dashboard',
            'summary' => $this->keuanganService->dashboardSummary(),
            'awpMonitoring' => $this->keuanganService->awpMonitoring(),
            'awpList' => $awpList,
            'transaksiList' => $transaksiList,
            'rekonList' => $rekonList,
            'kodeAkunOptions' => $this->kodeAkunOptions(),
            'kodeAkunMap' => config('keuangan_akun.akun', []),
            'keuanganStruktur' => $this->keuanganStrukturService->tree(),
        ]);
    }

    /** @return list<array{label: string, options: list<array{value: string, label: string}>}> */
    private function kodeAkunOptions(): array
    {
        $akun = config('keuangan_akun.akun', []);

        return collect(config('keuangan_akun.groups', []))
            ->map(fn (array $group) => [
                'label' => $group['label'],
                'options' => collect($group['codes'])
                    ->map(fn (string $code) => [
                        'value' => $code,
                        'label' => "{$code} — ".($akun[$code]['label'] ?? $code),
                    ])
                    ->values()
                    ->all(),
            ])
            ->values()
            ->all();
    }

    /** @return array<string, mixed> */
    private function validatedAwpData(Request $request): array
    {
        $validated = $request->validate([
            'nama_awp' => 'required|string|max:255',
            'component' => 'required|string|max:10',
            'sub_component' => 'required|string|max:20',
            'kode_pok' => 'required|string|max:30',
            'kode_owp' => 'required|string|max:30',
            'uraian_kegiatan' => 'required|string|max:255',
            'pagu' => 'required|numeric|min:0',
            'sumber_dana' => 'required|in:ADB,IFAD',
        ]);

        $this->keuanganStrukturService->assertValidHierarchy($validated);

        return $validated;
    }

    public function storeAwp(Request $request): RedirectResponse
    {
        $validated = $this->validatedAwpData($request);

        KeuanganAwp::create([
            ...$validated,
            'kode_awp' => KeuanganService::generateKodeAwp(),
        ]);

        return redirect()
            ->route('admin.keuangan.index', ['tab' => 'awp'])
            ->with('success', 'Data AWP berhasil disimpan.');
    }

    public function updateAwp(Request $request, KeuanganAwp $keuanganAwp): RedirectResponse
    {
        if ($keuanganAwp->transaksi()->exists()) {
            return redirect()
                ->route('admin.keuangan.index', ['tab' => 'awp'])
                ->with('error', 'AWP tidak dapat diedit karena sudah ada transaksi.');
        }

        $validated = $this->validatedAwpData($request);

        $keuanganAwp->update($validated);

        return redirect()
            ->route('admin.keuangan.index', ['tab' => 'awp'])
            ->with('success', 'Data AWP berhasil diperbarui.');
    }

    public function destroyAwp(KeuanganAwp $keuanganAwp): RedirectResponse
    {
        if ($keuanganAwp->transaksi()->exists()) {
            return redirect()
                ->route('admin.keuangan.index', ['tab' => 'awp'])
                ->with('error', 'AWP tidak dapat dihapus karena sudah digunakan dalam transaksi.');
        }

        $keuanganAwp->delete();

        return redirect()
            ->route('admin.keuangan.index', ['tab' => 'awp'])
            ->with('success', 'Data AWP berhasil dihapus.');
    }

    public function storeTransaksi(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'keuangan_awp_id' => 'required|exists:tr_keuangan_awp,id',
            'no_spm' => 'required|string|max:100',
            'tgl_spm' => 'required|date',
            'nilai_spm' => 'required|numeric|min:0',
            'no_sp2d' => 'nullable|string|max:100',
            'tgl_sp2d' => 'nullable|date|after_or_equal:tgl_spm',
            'nilai_sp2d' => 'nullable|numeric|min:0',
            'mekanisme_pembayaran' => 'required|in:Advance Account,Direct Payment',
            'keterangan' => 'nullable|string',
        ]);

        $awp = KeuanganAwp::query()->findOrFail($validated['keuangan_awp_id']);
        $pagu = (float) $awp->pagu;
        $nilaiSpm = (float) $validated['nilai_spm'];
        $nilaiSp2d = (float) ($validated['nilai_sp2d'] ?? 0);
        $totalRealisasi = (float) $awp->transaksi()->sum('nilai_sp2d');
        $sisaPagu = max(0, $pagu - $totalRealisasi);

        if ($sisaPagu <= 0) {
            throw ValidationException::withMessages([
                'keuangan_awp_id' => 'Pagu AWP kegiatan ini sudah habis.',
            ]);
        }

        if ($nilaiSpm > $pagu) {
            throw ValidationException::withMessages([
                'nilai_spm' => 'Nilai SPM melebihi pagu AWP.',
            ]);
        }

        if ($nilaiSp2d > $pagu) {
            throw ValidationException::withMessages([
                'nilai_sp2d' => 'Nilai SP2D melebihi pagu AWP.',
            ]);
        }

        if ($nilaiSp2d > 0 && ($totalRealisasi + $nilaiSp2d) > $pagu) {
            throw ValidationException::withMessages([
                'nilai_sp2d' => 'Total realisasi (SP2D) melebihi pagu AWP kegiatan ini.',
            ]);
        }

        if ($nilaiSp2d > $nilaiSpm) {
            throw ValidationException::withMessages([
                'nilai_sp2d' => 'Nilai SP2D tidak boleh melebihi nilai SPM.',
            ]);
        }

        $transaksi = KeuanganTransaksi::create([
            ...$validated,
            'kode_transaksi' => KeuanganService::generateKodeTransaksi(),
            'nilai_sp2d' => $nilaiSp2d,
            'nilai_realisasi' => $nilaiSp2d,
        ]);

        return redirect()
            ->route('admin.keuangan.index', ['tab' => 'register'])
            ->with('success', "Transaksi {$transaksi->kode_transaksi} berhasil disimpan.");
    }

    public function destroyTransaksi(KeuanganTransaksi $keuanganTransaksi): RedirectResponse
    {
        $keuanganTransaksi->delete();

        return redirect()
            ->route('admin.keuangan.index', ['tab' => 'register'])
            ->with('success', 'Transaksi berhasil dihapus.');
    }

    public function storeRekonsiliasi(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'keuangan_transaksi_id' => 'required|exists:tr_keuangan_transaksi,id',
            'nilai_sakti' => 'required|numeric|min:0',
            'nilai_omspan' => 'required|numeric|min:0',
            'nilai_bank' => 'required|numeric|min:0',
        ]);

        $transaksi = KeuanganTransaksi::query()->findOrFail($validated['keuangan_transaksi_id']);
        $hddap = $transaksi->nilaiRealisasiMonitoring();
        $selisih = KeuanganService::hitungSelisihRekon(
            $hddap,
            (float) $validated['nilai_sakti'],
            (float) $validated['nilai_omspan'],
            (float) $validated['nilai_bank'],
        );

        KeuanganRekonsiliasi::query()->updateOrCreate(
            ['keuangan_transaksi_id' => $transaksi->id],
            [
                'nilai_hddap' => $hddap,
                'nilai_sakti' => $validated['nilai_sakti'],
                'nilai_omspan' => $validated['nilai_omspan'],
                'nilai_bank' => $validated['nilai_bank'],
                'selisih' => $selisih,
                'status' => $selisih === 0.0 ? 'Rekon OK' : 'Perlu Cek',
            ],
        );

        $message = $selisih === 0.0
            ? 'Rekonsiliasi OK.'
            : 'Rekonsiliasi disimpan. Ada selisih yang perlu dicek.';

        return redirect()
            ->route('admin.keuangan.index', ['tab' => 'rekonsiliasi'])
            ->with('success', $message);
    }
}
