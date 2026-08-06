<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password', 'role_id', 'is_pusat'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $table = 'm_users';

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_pusat' => 'boolean',
        ];
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'm_user_permissions', 'user_id', 'permission_id')
            ->withTimestamps();
    }

    public function kabKotas(): BelongsToMany
    {
        return $this->belongsToMany(KabKota::class, 'm_user_kab_kota', 'user_id', 'kab_kota_code', 'id', 'code')
            ->withTimestamps();
    }

    public function isAdmin(): bool
    {
        return $this->role?->name === 'admin';
    }

    public function hasRole(string $role): bool
    {
        return $this->role?->name === $role;
    }
}
