<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePegawaiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nip' => ['required', 'string', Rule::unique('pegawais')->ignore($this->pegawai)],
            'nama' => 'required|string|max:255',
            'jabatan' => 'required|string|max:255',
            'unit_kerja' => 'required|string|max:255',
            'golongan' => 'required|string|max:10',
            'pangkat' => 'nullable|string|max:100',
            'tmt' => 'nullable|date',
        ];
    }
}
