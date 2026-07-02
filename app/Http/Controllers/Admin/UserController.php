<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', User::class);

        return Inertia::render('Admin/Users/Index', [
            'users' => User::with('role')->latest()->paginate(10),
            'roles' => Role::all(),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', User::class);

        return Inertia::render('Admin/Users/Create', [
            'roles' => Role::all(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', User::class);

        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:m_users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role_id'  => 'required|exists:m_roles,id',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);

        ActivityLogger::log(
            aksi: 'create',
            deskripsi: "Membuat user: {$user->name} ({$user->email})",
            subject: $user,
            metadata: [
                'name' => $user->name,
                'email' => $user->email,
                'role_id' => $user->role_id,
            ],
        );

        return redirect()->route('admin.users.index')
            ->with('success', 'User berhasil dibuat.');
    }

    public function edit(User $user): Response
    {
        $this->authorize('update', $user);

        return Inertia::render('Admin/Users/Edit', [
            'user'  => $user->load('role'),
            'roles' => Role::all(),
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|string|email|max:255|unique:m_users,email,' . $user->id,
            'role_id' => 'required|exists:m_roles,id',
        ]);

        if ($request->filled('password')) {
            $request->validate([
                'password' => ['confirmed', Rules\Password::defaults()],
            ]);
            $validated['password'] = Hash::make($request->password);
        }

        $trackedFields = ['name', 'email', 'role_id'];
        $original = $user->only($trackedFields);
        $user->update($validated);

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
            metadata: ['changes' => $changes],
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
}
