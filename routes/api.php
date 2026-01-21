<?php

use Illuminate\Support\Facades\Route;

Route::get('/pegawais', function () {
    return \App\Models\Pegawai::select('id', 'nip', 'nama', 'jabatan')->get();
});
