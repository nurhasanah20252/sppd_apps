<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSuratPerintahRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nomor_surat' => ['required', 'string', Rule::unique('surat_perintahs')->ignore($this->suratPerintah)],
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
}
