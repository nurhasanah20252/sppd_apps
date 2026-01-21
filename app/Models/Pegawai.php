<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pegawai extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nip',
        'nama',
        'jabatan',
        'unit_kerja',
        'golongan',
        'pangkat',
        'tmt',
    ];

    protected function casts(): array
    {
        return [
            'tmt' => 'date',
        ];
    }

    public function suratPerintahsAsPejabat(): HasMany
    {
        return $this->hasMany(SuratPerintah::class, 'pejabat_penandatangan_id');
    }

    public function pesertaPerjalanan(): HasMany
    {
        return $this->hasMany(PesertaPerjalanan::class);
    }
}
