<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSuratPerintahRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nomor_surat' => 'required|string|unique:surat_perintahs,nomor_surat',
            'maksud' => 'required|string',
            'dasar' => 'required|string',
            'tempat_berangkat' => 'required|string',
            'tempat_tujuan' => 'required|string',
            'tanggal_berangkat' => 'required|date',
            'tanggal_kembali' => 'required|date|after:tanggal_berangkat',
            'jenis_angkutan' => 'required|in:darat,laut,udara,kendaraan_dinas',
            'pejabat_penandatangan_id' => 'nullable|exists:pegawais,id',
            'peserta' => 'required|array|min:1',
            'peserta.*.pegawai_id' => 'required|exists:pegawais,id',
            'peserta.*.peran' => 'required|in:ketua_tim,anggota',
            'status' => 'nullable|in:draft,final',
        ];
    }

    public function messages(): array
    {
        return [
            'nomor_surat.required' => 'Nomor surat wajib diisi',
            'nomor_surat.unique' => 'Nomor surat sudah digunakan',
            'maksud.required' => 'Maksud perjalanan wajib diisi',
            'dasar.required' => 'Dasar surat wajib diisi',
            'tanggal_kembali.after' => 'Tanggal kembali harus setelah tanggal berangkat',
            'peserta.required' => 'Minimal satu peserta harus dipilih',
            'peserta.min' => 'Minimal satu peserta harus dipilih',
        ];
    }
}
