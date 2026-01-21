<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('peserta_perjalanans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('surat_perintah_id')->constrained()->cascadeOnDelete();
            $table->foreignId('pegawai_id')->constrained('pegawais')->cascadeOnDelete();
            $table->enum('peran', ['ketua_tim', 'anggota'])->default('anggota');
            $table->timestamps();

            $table->unique(['surat_perintah_id', 'pegawai_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('peserta_perjalanans');
    }
};
