<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PesertaPerjalanan extends Model
{
    use HasFactory;

    protected $fillable = [
        'surat_perintah_id',
        'pegawai_id',
        'peran',
    ];

    protected function casts(): array
    {
        return [
            'peran' => 'string',
        ];
    }

    public function suratPerintah(): BelongsTo
    {
        return $this->belongsTo(SuratPerintah::class);
    }

    public function pegawai(): BelongsTo
    {
        return $this->belongsTo(Pegawai::class);
    }
}
