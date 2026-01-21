<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PegawaiFactory extends Factory
{
    public function definition(): array
    {
        $golongan = fake()->randomElement(['I/a', 'I/b', 'I/c', 'I/d', 'II/a', 'II/b', 'II/c', 'II/d', 'III/a', 'III/b', 'III/c', 'III/d', 'IV/a', 'IV/b', 'IV/c', 'IV/e']);

        return [
            'nip' => fake()->unique()->numerify('################'),
            'nama' => fake()->name(),
            'jabatan' => fake()->jobTitle(),
            'unit_kerja' => fake()->company(),
            'golongan' => $golongan,
            'pangkat' => fake()->randomElement(['Pengatur Muda', 'Pengatur', 'Penata Muda', 'Penata', 'Pembina']),
            'tmt' => fake()->date(),
        ];
    }
}
