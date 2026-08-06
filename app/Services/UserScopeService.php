<?php

namespace App\Services;

use App\Models\KabKota;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class UserScopeService
{
    /** @var list<string>|null */
    private ?array $permissionKeys = null;

    /** @var list<string>|null */
    private ?array $allowedKabCodes = null;

    public function __construct(
        private readonly ?User $user,
    ) {}

    public static function current(): self
    {
        return new self(auth()->user());
    }

    public function isPusat(): bool
    {
        return (bool) ($this->user?->is_pusat);
    }

    public function hasPermission(string $key): bool
    {
        if (! $this->user || ! $this->user->isAdmin()) {
            return false;
        }

        $keys = $this->permissionKeys();

        // Dashboard wajib bisa diakses jika user punya minimal satu permission admin lain
        if ($key === 'dashboard.view' && $keys !== []) {
            return true;
        }

        return in_array($key, $keys, true);
    }

    /** @return list<string> */
    public function permissionKeys(): array
    {
        if ($this->permissionKeys !== null) {
            return $this->permissionKeys;
        }

        if (! $this->user) {
            return $this->permissionKeys = [];
        }

        $this->user->loadMissing('permissions');

        return $this->permissionKeys = $this->user->permissions
            ->pluck('key')
            ->values()
            ->all();
    }

    /** @return list<string> */
    public function menuKeys(): array
    {
        if (! $this->user) {
            return [];
        }

        $menuKeys = collect(config('admin_permissions', []))
            ->filter(fn (array $item) => $this->hasPermission($item['key']))
            ->pluck('menu_key')
            ->filter()
            ->unique()
            ->values()
            ->all();

        if ($menuKeys !== [] && ! in_array('/admin/dashboard', $menuKeys, true)) {
            array_unshift($menuKeys, '/admin/dashboard');
        }

        return $menuKeys;
    }

    /** @return list<string> */
    public function allowedKabKotaCodes(): array
    {
        if ($this->allowedKabCodes !== null) {
            return $this->allowedKabCodes;
        }

        $hddapCodes = collect(config('cpcl.filter_kabupaten', []))
            ->pluck('code')
            ->filter()
            ->values()
            ->all();

        if (! $this->user || $this->isPusat()) {
            return $this->allowedKabCodes = $hddapCodes;
        }

        $this->user->loadMissing('kabKotas');

        $assigned = $this->user->kabKotas
            ->pluck('code')
            ->filter()
            ->values()
            ->all();

        return $this->allowedKabCodes = array_values(array_intersect($hddapCodes, $assigned));
    }

    /** @return list<int> */
    public function allowedKabKotaIntCodes(): array
    {
        return collect($this->allowedKabKotaCodes())
            ->map(fn (string $code) => (int) $code)
            ->values()
            ->all();
    }

    public function canAccessKabKota(string|int|null $code): bool
    {
        if ($code === null || $code === '') {
            return false;
        }

        return in_array((string) $code, $this->allowedKabKotaCodes(), true);
    }

    public function ensureCanAccessKabKota(string|int|null $code): void
    {
        if (! $this->canAccessKabKota($code)) {
            throw new AccessDeniedHttpException('Anda tidak memiliki akses ke data kabupaten/kota ini.');
        }
    }

    public function ensurePermission(string $key): void
    {
        if (! $this->hasPermission($key)) {
            throw new AccessDeniedHttpException('Anda tidak memiliki izin untuk aksi ini.');
        }
    }

    /**
     * @param  Builder<\Illuminate\Database\Eloquent\Model>  $query
     * @return Builder<\Illuminate\Database\Eloquent\Model>
     */
    public function applyKabKotaScope(Builder $query, string $column = 'kode_kota'): Builder
    {
        if ($this->isPusat()) {
            return $query;
        }

        $codes = $this->allowedKabKotaIntCodes();

        if ($codes === []) {
            return $query->whereRaw('1 = 0');
        }

        return $query->whereIn($column, $codes);
    }

    /** @return list<array{value: string, label: string}> */
    public function kabKotaOptions(): array
    {
        return KabKota::query()
            ->whereIn('code', $this->allowedKabKotaCodes())
            ->orderBy('name')
            ->get(['code', 'name'])
            ->map(fn (KabKota $item) => [
                'value' => $item->code,
                'label' => $item->name,
            ])
            ->values()
            ->all();
    }

    /** @return list<string> */
    public function allowedKabKotaCodeRules(): array
    {
        return $this->allowedKabKotaCodes();
    }

    /** @return Collection<int, array{group: string, permissions: list<array{key: string, label: string}>}> */
    public static function permissionGroupsForForm(): Collection
    {
        return collect(config('admin_permissions', []))
            ->groupBy('group')
            ->map(fn (Collection $items, string $group) => [
                'group' => $group,
                'permissions' => $items->map(fn (array $item) => [
                    'key' => $item['key'],
                    'label' => $item['label'],
                ])->values()->all(),
            ])
            ->values();
    }

    public static function permissionKeyForRoute(?string $routeName): ?string
    {
        if ($routeName === null || ! str_starts_with($routeName, 'admin.')) {
            return null;
        }

        $map = [
            'admin.dashboard' => 'dashboard.view',
            'admin.profile.edit' => null,
            'admin.profile.update' => null,
            'admin.profile.destroy' => null,
            'admin.berita.index' => 'berita.view',
            'admin.berita.create' => 'berita.create',
            'admin.berita.store' => 'berita.create',
            'admin.berita.edit' => 'berita.update',
            'admin.berita.update' => 'berita.update',
            'admin.berita.destroy' => 'berita.delete',
            'admin.dokumen-kegiatan.index' => 'dokumen-kegiatan.view',
            'admin.dokumen-kegiatan.create' => 'dokumen-kegiatan.create',
            'admin.dokumen-kegiatan.store' => 'dokumen-kegiatan.create',
            'admin.dokumen-kegiatan.edit' => 'dokumen-kegiatan.update',
            'admin.dokumen-kegiatan.update' => 'dokumen-kegiatan.update',
            'admin.dokumen-kegiatan.destroy' => 'dokumen-kegiatan.delete',
            'admin.provinsi.index' => 'provinsi.view',
            'admin.kab-kota.index' => 'kab-kota.view',
            'admin.kecamatan.index' => 'kecamatan.view',
            'admin.kel-des.index' => 'kel-des.index',
            'admin.users.index' => 'users.view',
            'admin.users.create' => 'users.create',
            'admin.users.store' => 'users.create',
            'admin.users.edit' => 'users.update',
            'admin.users.update' => 'users.update',
            'admin.users.destroy' => 'users.delete',
            'admin.roles.index' => 'roles.view',
            'admin.roles.create' => 'roles.create',
            'admin.roles.store' => 'roles.create',
            'admin.roles.edit' => 'roles.update',
            'admin.roles.update' => 'roles.update',
            'admin.roles.destroy' => 'roles.delete',
            'admin.kelompok-petani.index' => 'kelompok-petani.view',
            'admin.kelompok-petani.create' => 'kelompok-petani.create',
            'admin.kelompok-petani.store' => 'kelompok-petani.create',
            'admin.kelompok-petani.edit' => 'kelompok-petani.update',
            'admin.kelompok-petani.update' => 'kelompok-petani.update',
            'admin.kelompok-petani.destroy' => 'kelompok-petani.delete',
            'admin.kelompok-petani.anggota' => 'kelompok-petani.view',
            'admin.kelompok-petani.api.kab-kota' => 'kelompok-petani.view',
            'admin.kelompok-petani.api.kecamatan' => 'kelompok-petani.view',
            'admin.kelompok-petani.api.kel-des' => 'kelompok-petani.view',
            'admin.petani.index' => 'petani.view',
            'admin.petani.create' => 'petani.create',
            'admin.petani.store' => 'petani.create',
            'admin.petani.edit' => 'petani.update',
            'admin.petani.update' => 'petani.update',
            'admin.petani.destroy' => 'petani.delete',
            'admin.petani.keluarga' => 'petani.view',
            'admin.pendamping.index' => 'pendamping.view',
            'admin.pendamping.create' => 'pendamping.create',
            'admin.pendamping.store' => 'pendamping.create',
            'admin.pendamping.edit' => 'pendamping.update',
            'admin.pendamping.update' => 'pendamping.update',
            'admin.pendamping.destroy' => 'pendamping.delete',
            'admin.data-verval.jenis-pelatihan.index' => 'jenis-pelatihan.view',
            'admin.data-verval.jenis-pelatihan.create' => 'jenis-pelatihan.create',
            'admin.data-verval.jenis-pelatihan.store' => 'jenis-pelatihan.create',
            'admin.data-verval.jenis-pelatihan.edit' => 'jenis-pelatihan.update',
            'admin.data-verval.jenis-pelatihan.update' => 'jenis-pelatihan.update',
            'admin.data-verval.jenis-pelatihan.destroy' => 'jenis-pelatihan.delete',
            'admin.data-verval.pelatihan.index' => 'pelatihan.view',
            'admin.data-verval.pelatihan.create' => 'pelatihan.create',
            'admin.data-verval.pelatihan.store' => 'pelatihan.create',
            'admin.data-verval.pelatihan.edit' => 'pelatihan.update',
            'admin.data-verval.pelatihan.update' => 'pelatihan.update',
            'admin.data-verval.pelatihan.destroy' => 'pelatihan.delete',
            'admin.kelembagaan-poktan.index' => 'kelembagaan-poktan.view',
            'admin.koperasi.index' => 'koperasi.view',
            'admin.bintek.index' => 'bintek.view',
            'admin.monev-fisik.index' => 'monev-fisik.view',
            'admin.logframe.index' => 'logframe.view',
            'admin.logframe.create' => 'logframe.create',
            'admin.logframe.store' => 'logframe.create',
            'admin.logframe.edit' => 'logframe.update',
            'admin.logframe.update' => 'logframe.update',
            'admin.logframe.destroy' => 'logframe.delete',
            'admin.activity-log.index' => 'activity-log.view',
        ];

        return $map[$routeName] ?? null;
    }
}
