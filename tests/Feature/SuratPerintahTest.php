<?php

use App\Models\Pegawai;
use App\Models\SuratPerintah;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;

it('can display surat perintah index page', function () {
    SuratPerintah::factory(5)->create();

    $response = $this->get('/surat-perintah');

    $response->assertStatus(200);
});

it('can display surat perintah create page', function () {
    $response = $this->get('/surat-perintah/create');

    $response->assertStatus(200);
});

it('can store a new surat perintah with peserta', function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);

    $peserta1 = Pegawai::factory()->create();
    $peserta2 = Pegawai::factory()->create();

    $response = $this->post('/surat-perintah', [
        'nomor_surat' => 'SPPD/001/2025',
        'maksud' => 'Test perjalanan',
        'dasar' => 'Surat undangan',
        'tempat_berangkat' => 'Kantor',
        'tempat_tujuan' => 'Jakarta',
        'tanggal_berangkat' => '2025-02-01',
        'tanggal_kembali' => '2025-02-03',
        'jenis_angkutan' => 'darat',
        'peserta' => [
            ['pegawai_id' => $peserta1->id, 'peran' => 'ketua_tim'],
            ['pegawai_id' => $peserta2->id, 'peran' => 'anggota'],
        ],
        'status' => 'draft',
    ]);

    $response->assertRedirect('/surat-perintah');
    $this->assertDatabaseHas('surat_perintahs', [
        'nomor_surat' => 'SPPD/001/2025',
    ]);
    $this->assertDatabaseHas('peserta_perjalanans', [
        'pegawai_id' => $peserta1->id,
        'peran' => 'ketua_tim',
    ]);
});

it('validates tanggal_kembali is after tanggal_berangkat', function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);

    $response = $this->post('/surat-perintah', [
        'nomor_surat' => 'SPPD/002/2025',
        'maksud' => 'Test',
        'dasar' => 'Test',
        'tempat_berangkat' => 'Kantor',
        'tempat_tujuan' => 'Jakarta',
        'tanggal_berangkat' => '2025-02-03',
        'tanggal_kembali' => '2025-02-01',
        'jenis_angkutan' => 'darat',
        'peserta' => [['pegawai_id' => Pegawai::factory()->create()->id, 'peran' => 'anggota']],
    ]);

    $response->assertSessionHasErrors(['tanggal_kembali']);
});

it('requires at least one peserta', function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);

    $response = $this->post('/surat-perintah', [
        'nomor_surat' => 'SPPD/003/2025',
        'maksud' => 'Test',
        'dasar' => 'Test',
        'tempat_berangkat' => 'Kantor',
        'tempat_tujuan' => 'Jakarta',
        'tanggal_berangkat' => '2025-02-01',
        'tanggal_kembali' => '2025-02-03',
        'jenis_angkutan' => 'darat',
        'peserta' => [],
    ]);

    $response->assertSessionHasErrors(['peserta']);
});

it('can delete a surat perintah', function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);

    $surat = SuratPerintah::factory()->create();

    $response = $this->delete("/surat-perintah/{$surat->id}");

    $response->assertRedirect('/surat-perintah');
    $this->assertSoftDeleted('surat_perintahs', [
        'id' => $surat->id,
    ]);
});
