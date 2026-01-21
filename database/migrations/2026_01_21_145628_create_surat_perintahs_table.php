<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('surat_perintahs', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_surat')->unique();
            $table->text('maksud');
            $table->text('dasar');
            $table->string('tempat_berangkat');
            $table->string('tempat_tujuan');
            $table->date('tanggal_berangkat');
            $table->date('tanggal_kembali');
            $table->integer('lama_perjalanan');
            $table->enum('jenis_angkutan', ['darat', 'laut', 'udara', 'kendaraan_dinas'])->default('darat');
            $table->foreignId('pejabat_penandatangan_id')->nullable()->constrained('pegawais')->nullOnDelete();
            $table->enum('status', ['draft', 'final'])->default('draft');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('surat_perintahs');
    }
};
