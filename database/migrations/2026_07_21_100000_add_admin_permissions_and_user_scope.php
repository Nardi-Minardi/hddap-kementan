<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('m_users', function (Blueprint $table) {
            $table->boolean('is_pusat')->default(false)->after('role_id');
        });

        Schema::create('m_permissions', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('label');
            $table->string('group_key')->nullable();
            $table->string('menu_key')->nullable();
            $table->timestamps();
        });

        Schema::create('m_user_permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('m_users')->cascadeOnDelete();
            $table->foreignId('permission_id')->constrained('m_permissions')->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['user_id', 'permission_id']);
        });

        Schema::create('m_user_kab_kota', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('m_users')->cascadeOnDelete();
            $table->string('kab_kota_code', 10);
            $table->timestamps();
            $table->unique(['user_id', 'kab_kota_code']);
            $table->foreign('kab_kota_code')->references('code')->on('m_kab_kota')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('m_user_kab_kota');
        Schema::dropIfExists('m_user_permissions');
        Schema::dropIfExists('m_permissions');

        Schema::table('m_users', function (Blueprint $table) {
            $table->dropColumn('is_pusat');
        });
    }
};
