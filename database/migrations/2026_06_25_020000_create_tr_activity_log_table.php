<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tr_activity_log', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('m_users')
                ->nullOnDelete();
            $table->string('aksi');
            $table->text('deskripsi')->nullable();
            $table->nullableMorphs('subject');
            $table->json('metadata')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('url')->nullable();
            $table->string('method', 10)->nullable();
            $table->timestamps();

            $table->index('aksi');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tr_activity_log');
    }
};
