<?php

use App\Models\Pegawai;

it('can create a pegawai', function () {
    $pegawai = Pegawai::factory()->create();

    expect($pegawai->id)->not->toBeNull();
    expect($pegawai->nip)->not->toBeEmpty();
    expect($pegawai->nama)->not->toBeEmpty();
});

it('has many surat perintah as pejabat', function () {
    $pegawai = Pegawai::factory()->create();

    $pegawai->suratPerintahsAsPejabat()->create([
        'nomor_surat' => 'SPPD/001/2025',
        'maksud' => 'Test',
        'dasar' => 'Test',
        'tempat_berangkat' => 'Kantor',
        'tempat_tujuan' => 'Jakarta',
        'tanggal_berangkat' => now(),
        'tanggal_kembali' => now()->addDay(),
        'lama_perjalanan' => 1,
    ]);

    expect($pegawai->suratPerintahsAsPejabat)->toHaveCount(1);
});

it('has many peserta perjalanan', function () {
    $pegawai = Pegawai::factory()->create();

    $pegawai->pesertaPerjalanan()->create([
        'surat_perintah_id' => \App\Models\SuratPerintah::factory()->create()->id,
        'peran' => 'anggota',
    ]);

    expect($pegawai->pesertaPerjalanan)->toHaveCount(1);
});
