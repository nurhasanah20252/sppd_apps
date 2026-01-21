<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pegawais', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('surat_perintahs', function (Blueprint $table) {
            $table->softDeletes();
            $table->dropColumn('lama_perjalanan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pegawais', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('surat_perintahs', function (Blueprint $table) {
            $table->dropSoftDeletes();
            $table->integer('lama_perjalanan'); // We can't easily restore the data without calculation
        });
    }
};
