<?php

use App\Models\Pegawai;

it('can display pegawai index page', function () {
    Pegawai::factory(5)->create();

    $response = $this->get('/pegawai');

    $response->assertStatus(200);
});

it('can display pegawai create page', function () {
    $response = $this->get('/pegawai/create');

    $response->assertStatus(200);
});

it('can store a new pegawai', function () {
    $response = $this->post('/pegawai', [
        'nip' => '123456789012345678',
        'nama' => 'John Doe',
        'jabatan' => 'Staff',
        'unit_kerja' => 'Unit 1',
        'golongan' => 'III/a',
        'pangkat' => 'Penata',
        'tmt' => '2020-01-01',
    ]);

    $response->assertRedirect('/pegawai');
    $this->assertDatabaseHas('pegawais', [
        'nip' => '123456789012345678',
        'nama' => 'John Doe',
    ]);
});

it('validates required fields when storing pegawai', function () {
    $response = $this->post('/pegawai', []);

    $response->assertSessionHasErrors(['nip', 'nama', 'jabatan', 'unit_kerja', 'golongan']);
});

it('can update a pegawai', function () {
    $pegawai = Pegawai::factory()->create();

    $response = $this->put("/pegawai/{$pegawai->id}", [
        'nip' => $pegawai->nip,
        'nama' => 'Updated Name',
        'jabatan' => $pegawai->jabatan,
        'unit_kerja' => $pegawai->unit_kerja,
        'golongan' => $pegawai->golongan,
    ]);

    $response->assertRedirect('/pegawai');
    $this->assertDatabaseHas('pegawais', [
        'id' => $pegawai->id,
        'nama' => 'Updated Name',
    ]);
});

it('can delete a pegawai', function () {
    $pegawai = Pegawai::factory()->create();

    $response = $this->delete("/pegawai/{$pegawai->id}");

    $response->assertRedirect('/pegawai');
    $this->assertSoftDeleted('pegawais', [
        'id' => $pegawai->id,
    ]);
});
