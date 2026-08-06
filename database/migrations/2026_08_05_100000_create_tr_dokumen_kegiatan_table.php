<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tr_dokumen_kegiatan', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->string('slug')->unique();
            $table->text('deskripsi')->nullable();
            $table->string('file_path');
            $table->string('cover_path')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->boolean('is_published')->default(false);
            $table->unsignedSmallInteger('urutan')->default(0);
            $table->foreignId('user_id')->nullable()->constrained('m_users')->nullOnDelete();
            $table->timestamps();

            $table->index(['is_published', 'urutan'], 'tr_dokumen_kegiatan_publish_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tr_dokumen_kegiatan');
    }
};
