<?php

use App\Models\Pegawai;
use App\Models\SuratPerintah;

it('can create a surat perintah', function () {
    $surat = SuratPerintah::factory()->create();

    expect($surat->id)->not->toBeNull();
    expect($surat->nomor_surat)->not->toBeEmpty();
});

it('belongs to pejabat penandatangan', function () {
    $pejabat = Pegawai::factory()->create();
    $surat = SuratPerintah::factory()->create([
        'pejabat_penandatangan_id' => $pejabat->id,
    ]);

    expect($surat->pejabatPenandatangan->id)->toBe($pejabat->id);
});

it('has many peserta perjalanan', function () {
    $surat = SuratPerintah::factory()->create();

    $surat->pesertaPerjalanan()->createMany([
        ['pegawai_id' => Pegawai::factory()->create()->id, 'peran' => 'ketua_tim'],
        ['pegawai_id' => Pegawai::factory()->create()->id, 'peran' => 'anggota'],
    ]);

    expect($surat->pesertaPerjalanan)->toHaveCount(2);
});

it('calculates lama_perjalanan correctly', function () {
    $surat = SuratPerintah::factory()->create([
        'tanggal_berangkat' => '2025-01-15',
        'tanggal_kembali' => '2025-01-17',
    ]);

    expect($surat->lama_perjalanan)->toEqual(3);
});
