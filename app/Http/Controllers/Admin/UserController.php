<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KabKota;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Services\ActivityLogger;
use App\Services\UserScopeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', User::class);

        return Inertia::render('Admin/Users/Index', [
            'users' => User::with(['role', 'permissions', 'kabKotas'])->latest()->paginate(10),
            'roles' => Role::all(),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', User::class);

        return Inertia::render('Admin/Users/Create', $this->formProps());
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', User::class);

        $validated = $this->validateUser($request);
        $validated['password'] = Hash::make($validated['password']);

        $permissionKeys = $validated['permission_keys'];
        $kabKotaCodes = $validated['kab_kota_codes'];
        unset($validated['password_confirmation'], $validated['permission_keys'], $validated['kab_kota_codes']);

        $user = User::create($validated);
        $this->syncAccess($user, $permissionKeys, $kabKotaCodes);

        ActivityLogger::log(
            aksi: 'create',
            deskripsi: "Membuat user: {$user->name} ({$user->email})",
            subject: $user,
            metadata: [
                'name' => $user->name,
                'email' => $user->email,
                'role_id' => $user->role_id,
                'is_pusat' => $user->is_pusat,
                'permission_keys' => $permissionKeys,
                'kab_kota_codes' => $kabKotaCodes,
            ],
        );

        return redirect()->route('admin.users.index')
            ->with('success', 'User berhasil dibuat.');
    }

    public function edit(User $user): Response
    {
        $this->authorize('update', $user);

        $user->load(['role', 'permissions', 'kabKotas']);

        return Inertia::render('Admin/Users/Edit', [
            ...$this->formProps(),
            'user' => [
                ...$user->toArray(),
                'permission_keys' => $user->permissions->pluck('key')->values()->all(),
                'kab_kota_codes' => $user->kabKotas->pluck('code')->values()->all(),
            ],
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $validated = $this->validateUser($request, $user);

        if ($request->filled('password')) {
            $validated['password'] = Hash::make($request->password);
        } else {
            unset($validated['password']);
        }

        $permissionKeys = $validated['permission_keys'];
        $kabKotaCodes = $validated['kab_kota_codes'];
        unset($validated['password_confirmation'], $validated['permission_keys'], $validated['kab_kota_codes']);

        $trackedFields = ['name', 'email', 'role_id', 'is_pusat'];
        $original = $user->only($trackedFields);
        $user->update($validated);
        $this->syncAccess($user, $permissionKeys, $kabKotaCodes);

        $changes = collect($validated)
            ->only(array_merge($trackedFields, $request->filled('password') ? ['password'] : []))
            ->mapWithKeys(function ($value, $key) use ($original, $request) {
                if ($key === 'password') {
                    return ['password' => ['from' => '***', 'to' => '*** (diperbarui)']];
                }

                $from = $original[$key] ?? null;

                return ((string) $from !== (string) $value)
                    ? [$key => ['from' => $from, 'to' => $value]]
                    : [];
            })
            ->all();

        ActivityLogger::log(
            aksi: 'update',
            deskripsi: "Memperbarui user: {$user->name} ({$user->email})",
            subject: $user,
            metadata: [
                'changes' => $changes,
                'permission_keys' => $permissionKeys,
                'kab_kota_codes' => $kabKotaCodes,
            ],
        );

        return redirect()->route('admin.users.index')
            ->with('success', 'User berhasil diperbarui.');
    }

    public function destroy(User $user): RedirectResponse
    {
        $this->authorize('delete', $user);

        $name = $user->name;
        $email = $user->email;
        $userId = $user->id;

        $user->delete();

        ActivityLogger::log(
            aksi: 'delete',
            deskripsi: "Menghapus user: {$name} ({$email})",
            metadata: [
                'deleted_user_id' => $userId,
                'name' => $name,
                'email' => $email,
            ],
        );

        return redirect()->route('admin.users.index')
            ->with('success', 'User berhasil dihapus.');
    }

    /** @return array<string, mixed> */
    private function formProps(): array
    {
        $scope = UserScopeService::current();
        $hddapCodes = collect(config('cpcl.filter_kabupaten', []))->pluck('code')->all();
        $allowedCodes = $scope->isPusat()
            ? $hddapCodes
            : array_values(array_intersect($hddapCodes, $scope->allowedKabKotaCodes()));

        return [
            'roles' => Role::all(),
            'defaultAdminRoleId' => Role::query()->where('name', 'admin')->value('id'),
            'permissionGroups' => UserScopeService::permissionGroupsForForm()
                ->map(function (array $group) use ($scope) {
                    if ($scope->isPusat()) {
                        return $group;
                    }

                    return [
                        ...$group,
                        'permissions' => collect($group['permissions'])
                            ->filter(fn (array $item) => $scope->hasPermission($item['key']))
                            ->values()
                            ->all(),
                    ];
                })
                ->filter(fn (array $group) => $group['permissions'] !== [])
                ->values(),
            'kabKotaOptions' => KabKota::query()
                ->whereIn('code', $allowedCodes)
                ->orderBy('name')
                ->get(['code', 'name'])
                ->map(fn (KabKota $item) => ['value' => $item->code, 'label' => $item->name])
                ->values(),
            'canManagePusat' => $scope->isPusat(),
        ];
    }

    /** @return array<string, mixed> */
    private function validateUser(Request $request, ?User $user = null): array
    {
        $scope = UserScopeService::current();
        $allPermissionKeys = collect(config('admin_permissions', []))->pluck('key')->all();
        $assignablePermissions = $scope->isPusat()
            ? $allPermissionKeys
            : array_values(array_intersect($allPermissionKeys, $scope->permissionKeys()));

        $allowedKabCodes = $scope->allowedKabKotaCodeRules();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:m_users,email,'.($user?->id ?? 'NULL'),
            'password' => [$user ? 'nullable' : 'required', 'confirmed', Rules\Password::defaults()],
            'role_id' => 'required|exists:m_roles,id',
            'is_pusat' => 'boolean',
            'permission_keys' => 'array',
            'permission_keys.*' => ['string', Rule::in($assignablePermissions)],
            'kab_kota_codes' => 'array',
            'kab_kota_codes.*' => ['string', Rule::in($allowedKabCodes), 'exists:m_kab_kota,code'],
        ]);

        $validated['is_pusat'] = (bool) ($validated['is_pusat'] ?? false);

        if ($validated['is_pusat'] && ! $scope->isPusat()) {
            abort(403, 'Hanya user pusat yang dapat menetapkan akses pusat.');
        }

        if (! $validated['is_pusat'] && empty($validated['kab_kota_codes'])) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'kab_kota_codes' => 'Pilih minimal satu kabupaten/kota penugasan, atau aktifkan akses pusat.',
            ]);
        }

        if ($validated['is_pusat']) {
            $validated['kab_kota_codes'] = [];
        }

        $adminRoleId = Role::query()->where('name', 'admin')->value('id');
        if (! empty($validated['permission_keys']) && (int) $validated['role_id'] !== (int) $adminRoleId) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'role_id' => 'Agar menu admin muncul, role harus Administrator (bukan User).',
            ]);
        }

        return $validated;
    }

    /** @param  list<string>  $permissionKeys */
    /** @param  list<string>  $kabKotaCodes */
    private function syncAccess(User $user, array $permissionKeys, array $kabKotaCodes): void
    {
        if ($permissionKeys !== [] && ! in_array('dashboard.view', $permissionKeys, true)) {
            $permissionKeys[] = 'dashboard.view';
        }

        $permissionIds = Permission::query()
            ->whereIn('key', $permissionKeys)
            ->pluck('id');

        $user->permissions()->sync($permissionIds);
        $user->kabKotas()->sync($kabKotaCodes);
    }
}
