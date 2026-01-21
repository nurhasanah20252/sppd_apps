<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class SuratPerintah extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nomor_surat',
        'maksud',
        'dasar',
        'tempat_berangkat',
        'tempat_tujuan',
        'tanggal_berangkat',
        'tanggal_kembali',
        'jenis_angkutan',
        'pejabat_penandatangan_id',
        'status',
    ];

    protected $appends = [
        'lama_perjalanan',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_berangkat' => 'date',
            'tanggal_kembali' => 'date',
        ];
    }

    protected function lamaPerjalanan(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->tanggal_berangkat && $this->tanggal_kembali
                ? $this->tanggal_berangkat->diffInDays($this->tanggal_kembali) + 1
                : 0,
        );
    }

    public function pejabatPenandatangan(): BelongsTo
    {
        return $this->belongsTo(Pegawai::class, 'pejabat_penandatangan_id');
    }

    public function pesertaPerjalanan(): HasMany
    {
        return $this->hasMany(PesertaPerjalanan::class);
    }

    public function pegawais(): HasMany
    {
        return $this->hasManyThrough(Pegawai::class, PesertaPerjalanan::class);
    }
}
