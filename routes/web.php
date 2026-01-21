<?php

use App\Http\Controllers\PegawaiController;
use App\Http\Controllers\SuratPerintahController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('surat-perintah.index');
})->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('dashboard');
})->middleware('auth')->name('dashboard');

Route::resource('pegawai', PegawaiController::class);
Route::resource('surat-perintah', SuratPerintahController::class);
Route::get('/surat-perintah/{suratPerintah}/print-surat-tugas', [SuratPerintahController::class, 'printSuratTugas'])->name('surat-perintah.print-surat-tugas');
Route::get('/surat-perintah/{suratPerintah}/print-sppd-lembar-1', [SuratPerintahController::class, 'printSPPDLembar1'])->name('surat-perintah.print-sppd-lembar-1');

require __DIR__.'/settings.php';
