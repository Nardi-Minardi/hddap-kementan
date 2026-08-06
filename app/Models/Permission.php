<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Permission extends Model
{
    protected $table = 'm_permissions';

    protected $fillable = ['key', 'label', 'group_key', 'menu_key'];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'm_user_permissions', 'permission_id', 'user_id')
            ->withTimestamps();
    }
}
