<?php

namespace Database\Factories;

use App\Models\Pegawai;
use App\Models\SuratPerintah;
use Illuminate\Database\Eloquent\Factories\Factory;

class SuratPerintahFactory extends Factory
{
    protected $model = SuratPerintah::class;

    public function definition(): array
    {
        $tanggalBerangkat = fake()->dateTimeBetween('+1 week', '+1 month');
        $tanggalKembali = (clone $tanggalBerangkat)->modify('+'.fake()->numberBetween(1, 7).' days');

        return [
            'nomor_surat' => fake()->unique()->numerify('SPPD/###/'.date('Y')),
            'maksud' => fake()->sentence(),
            'dasar' => fake()->paragraph(),
            'tempat_berangkat' => 'Kantor Pengadilan Agama Penajam',
            'tempat_tujuan' => fake()->city(),
            'tanggal_berangkat' => $tanggalBerangkat->format('Y-m-d'),
            'tanggal_kembali' => $tanggalKembali->format('Y-m-d'),
            'jenis_angkutan' => fake()->randomElement(['darat', 'laut', 'udara', 'kendaraan_dinas']),
            'pejabat_penandatangan_id' => Pegawai::inRandomOrder()->first()?->id,
            'status' => fake()->randomElement(['draft', 'final']),
        ];
    }
}
