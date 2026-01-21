# Aplikasi SPPD Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Membangun aplikasi web berbasis Laravel 12 + React untuk mengelola Surat Perintah Perjalanan Dinas (SPPD) dengan fitur manajemen pegawai, pembuatan SPPD, dan pencetakan dokumen resmi.

**Architecture:** Aplikasi menggunakan Laravel 12 sebagai backend dengan Inertia.js v2 + React sebagai frontend. Data disimpan dalam SQLite (development) dengan relasi one-to-many antara Pegawai dan SuratPerintah. Format pencetakan menggunakan CSS Print Media.

**Tech Stack:** Laravel 12, PHP 8.2+, Inertia.js v2, React 19, TypeScript, Tailwind CSS v4, Pest 4, Laravel Fortify, SQLite

---

## Phase 1: Foundation & Database Setup

### Task 1: Create Pegawai Migration

**Files:**
- Create: `database/migrations/2025_01_21_000001_create_pegawais_table.php`

**Step 1: Generate migration file**

Run: `php artisan make:migration create_pegawais_table --no-interaction`
Expected: Migration file created with timestamp

**Step 2: Write migration schema**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pegawais', function (Blueprint $table) {
            $table->id();
            $table->string('nip')->unique();
            $table->string('nama');
            $table->string('jabatan');
            $table->string('unit_kerja');
            $table->string('golongan');
            $table->string('pangkat')->nullable();
            $table->date('tmt')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pegawais');
    }
};
```

**Step 3: Commit**

```bash
git add database/migrations/2025_01_21_000001_create_pegawais_table.php
git commit -m "feat: create pegawais table migration"
```

---

### Task 2: Create SuratPerintah Migration

**Files:**
- Create: `database/migrations/2025_01_21_000002_create_surat_perintahs_table.php`

**Step 1: Generate migration file**

Run: `php artisan make:migration create_surat_perintahs_table --no-interaction`
Expected: Migration file created with timestamp

**Step 2: Write migration schema**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('surat_perintahs', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_surat')->unique();
            $table->text('maksud');
            $table->text('dasar');
            $table->string('tempat_berangkat');
            $table->string('tempat_tujuan');
            $table->date('tanggal_berangkat');
            $table->date('tanggal_kembali');
            $table->integer('lama_perjalanan');
            $table->enum('jenis_angkutan', ['darat', 'laut', 'udara', 'kendaraan_dinas'])->default('darat');
            $table->foreignId('pejabat_penandatangan_id')->nullable()->constrained('pegawais')->nullOnDelete();
            $table->enum('status', ['draft', 'final'])->default('draft');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('surat_perintahs');
    }
};
```

**Step 3: Commit**

```bash
git add database/migrations/2025_01_21_000002_create_surat_perintahs_table.php
git commit -m "feat: create surat_perintahs table migration"
```

---

### Task 3: Create PesertaPerjalanan Migration

**Files:**
- Create: `database/migrations/2025_01_21_000003_create_peserta_perjalanans_table.php`

**Step 1: Generate migration file**

Run: `php artisan make:migration create_peserta_perjalanans_table --no-interaction`
Expected: Migration file created with timestamp

**Step 2: Write migration schema**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('peserta_perjalanans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('surat_perintah_id')->constrained()->cascadeOnDelete();
            $table->foreignId('pegawai_id')->constrained('pegawais')->cascadeOnDelete();
            $table->enum('peran', ['ketua_tim', 'anggota'])->default('anggota');
            $table->timestamps();

            $table->unique(['surat_perintah_id', 'pegawai_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('peserta_perjalanans');
    }
};
```

**Step 3: Commit**

```bash
git add database/migrations/2025_01_21_000003_create_peserta_perjalanans_table.php
git commit -m "feat: create peserta_perjalanans table migration"
```

---

### Task 4: Run Migrations

**Files:**
- Modify: None (database change only)

**Step 1: Run all migrations**

Run: `php artisan migrate --no-interaction`
Expected: All three tables created successfully

**Step 2: Verify tables created**

Run: `php artisan tinker --execute="echo \DB::getTablePrefix();"`
Expected: No errors, tables exist in database

**Step 3: Commit migration record**

```bash
git add database/migrations
git commit -m "chore: run initial migrations"
```

---

## Phase 2: Models & Relationships

### Task 5: Create Pegawai Model with Factory and Seeder

**Files:**
- Create: `app/Models/Pegawai.php`
- Create: `database/factories/PegawaiFactory.php`
- Create: `database/seeders/PegawaiSeeder.php`

**Step 1: Generate model with factory and seeder**

Run: `php artisan make:model Pegawai --factory --seeder --no-interaction`
Expected: Three files created

**Step 2: Write Pegawai model**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pegawai extends Model
{
    use HasFactory;

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
```

**Step 3: Write PegawaiFactory**

```php
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
```

**Step 4: Write PegawaiSeeder**

```php
<?php

namespace Database\Seeders;

use App\Models\Pegawai;
use Illuminate\Database\Seeder;

class PegawaiSeeder extends Seeder
{
    public function run(): void
    {
        Pegawai::factory(10)->create();
    }
}
```

**Step 5: Update DatabaseSeeder**

```php
<?php

namespace Database\Seeders;

use App\Models\Pegawai;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            PegawaiSeeder::class,
        ]);
    }
}
```

**Step 6: Run seeder**

Run: `php artisan db:seed --class=PegawaiSeeder --no-interaction`
Expected: 10 pegawai records created

**Step 7: Commit**

```bash
git add app/Models/Pegawai.php database/factories/PegawaiFactory.php database/seeders/PegawaiSeeder.php database/seeders/DatabaseSeeder.php
git commit -m "feat: create Pegawai model with factory and seeder"
```

---

### Task 6: Create SuratPerintah Model

**Files:**
- Create: `app/Models/SuratPerintah.php`
- Create: `database/factories/SuratPerintahFactory.php`

**Step 1: Generate model with factory**

Run: `php artisan make:model SuratPerintah --factory --no-interaction`
Expected: Two files created

**Step 2: Write SuratPerintah model**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SuratPerintah extends Model
{
    use HasFactory;

    protected $fillable = [
        'nomor_surat',
        'maksud',
        'dasar',
        'tempat_berangkat',
        'tempat_tujuan',
        'tanggal_berangkat',
        'tanggal_kembali',
        'lama_perjalanan',
        'jenis_angkutan',
        'pejabat_penandatangan_id',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_berangkat' => 'date',
            'tanggal_kembali' => 'date',
        ];
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
```

**Step 3: Write SuratPerintahFactory**

```php
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
        $tanggalKembali = fake()->dateTimeBetween($tanggalBerangkat, '+1 week');

        return [
            'nomor_surat' => fake()->unique()->numerify('SPPD/###/' . date('Y')),
            'maksud' => fake()->sentence(),
            'dasar' => fake()->paragraph(),
            'tempat_berangkat' => 'Kantor Pengadilan Agama Penajam',
            'tempat_tujuan' => fake()->city(),
            'tanggal_berangkat' => $tanggalBerangkat->format('Y-m-d'),
            'tanggal_kembali' => $tanggalKembali->format('Y-m-d'),
            'lama_perjalanan' => fake()->numberBetween(1, 7),
            'jenis_angkutan' => fake()->randomElement(['darat', 'laut', 'udara', 'kendaraan_dinas']),
            'pejabat_penandatangan_id' => Pegawai::inRandomOrder()->first()?->id,
            'status' => fake()->randomElement(['draft', 'final']),
        ];
    }
}
```

**Step 4: Commit**

```bash
git add app/Models/SuratPerintah.php database/factories/SuratPerintahFactory.php
git commit -m "feat: create SuratPerintah model with factory"
```

---

### Task 7: Create PesertaPerjalanan Model

**Files:**
- Create: `app/Models/PesertaPerjalanan.php`

**Step 1: Generate model**

Run: `php artisan make:model PesertaPerjalanan --no-interaction`
Expected: Model file created

**Step 2: Write PesertaPerjalanan model**

```php
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
```

**Step 3: Commit**

```bash
git add app/Models/PesertaPerjalanan.php
git commit -m "feat: create PesertaPerjalanan model"
```

---

## Phase 3: API Routes & Controllers

### Task 8: Create PegawaiController

**Files:**
- Create: `app/Http/Controllers/PegawaiController.php`
- Create: `app/Http/Requests/StorePegawaiRequest.php`
- Create: `app/Http/Requests/UpdatePegawaiRequest.php`

**Step 1: Generate controller**

Run: `php artisan make:controller PegawaiController --no-interaction`
Expected: Controller file created

**Step 2: Generate form requests**

Run: `php artisan make:request StorePegawaiRequest --no-interaction`
Run: `php artisan make:request UpdatePegawaiRequest --no-interaction`
Expected: Two request files created

**Step 3: Write StorePegawaiRequest**

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePegawaiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nip' => 'required|string|unique:pegawais,nip',
            'nama' => 'required|string|max:255',
            'jabatan' => 'required|string|max:255',
            'unit_kerja' => 'required|string|max:255',
            'golongan' => 'required|string|max:10',
            'pangkat' => 'nullable|string|max:100',
            'tmt' => 'nullable|date',
        ];
    }

    public function messages(): array
    {
        return [
            'nip.required' => 'NIP wajib diisi',
            'nip.unique' => 'NIP sudah terdaftar',
            'nama.required' => 'Nama wajib diisi',
            'jabatan.required' => 'Jabatan wajib diisi',
            'unit_kerja.required' => 'Unit kerja wajib diisi',
            'golongan.required' => 'Golongan wajib diisi',
        ];
    }
}
```

**Step 4: Write UpdatePegawaiRequest**

```php
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
            'nip' => 'required|string', Rule::unique('pegawais')->ignore($this->pegawai),
            'nama' => 'required|string|max:255',
            'jabatan' => 'required|string|max:255',
            'unit_kerja' => 'required|string|max:255',
            'golongan' => 'required|string|max:10',
            'pangkat' => 'nullable|string|max:100',
            'tmt' => 'nullable|date',
        ];
    }
}
```

**Step 5: Write PegawaiController**

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePegawaiRequest;
use App\Http\Requests\UpdatePegawaiRequest;
use App\Models\Pegawai;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PegawaiController extends Controller
{
    public function index(): Response
    {
        $pegawais = Pegawai::orderBy('nama')->get();

        return Inertia::render('Pegawai/Index', [
            'pegawais' => $pegawais,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Pegawai/Create');
    }

    public function store(StorePegawaiRequest $request): RedirectResponse
    {
        Pegawai::create($request->validated());

        return redirect()->route('pegawai.index')
            ->with('success', 'Data pegawai berhasil ditambahkan');
    }

    public function show(Pegawai $pegawai): Response
    {
        return Inertia::render('Pegawai/Show', [
            'pegawai' => $pegawai,
        ]);
    }

    public function edit(Pegawai $pegawai): Response
    {
        return Inertia::render('Pegawai/Edit', [
            'pegawai' => $pegawai,
        ]);
    }

    public function update(UpdatePegawaiRequest $request, Pegawai $pegawai): RedirectResponse
    {
        $pegawai->update($request->validated());

        return redirect()->route('pegawai.index')
            ->with('success', 'Data pegawai berhasil diperbarui');
    }

    public function destroy(Pegawai $pegawai): RedirectResponse
    {
        $pegawai->delete();

        return redirect()->route('pegawai.index')
            ->with('success', 'Data pegawai berhasil dihapus');
    }
}
```

**Step 6: Commit**

```bash
git add app/Http/Controllers/PegawaiController.php app/Http/Requests/StorePegawaiRequest.php app/Http/Requests/UpdatePegawaiRequest.php
git commit -m "feat: create PegawaiController with form requests"
```

---

### Task 9: Create SuratPerintahController

**Files:**
- Create: `app/Http/Controllers/SuratPerintahController.php`
- Create: `app/Http/Requests/StoreSuratPerintahRequest.php`
- Create: `app/Http/Requests/UpdateSuratPerintahRequest.php`

**Step 1: Generate controller and form requests**

Run: `php artisan make:controller SuratPerintahController --no-interaction`
Run: `php artisan make:request StoreSuratPerintahRequest --no-interaction`
Run: `php artisan make:request UpdateSuratPerintahRequest --no-interaction`
Expected: Three files created

**Step 2: Write StoreSuratPerintahRequest**

```php
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
            'lama_perjalanan' => 'required|integer|min:1',
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
```

**Step 3: Write UpdateSuratPerintahRequest**

```php
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
            'nomor_surat' => 'required|string', Rule::unique('surat_perintahs')->ignore($this->suratPerintah),
            'maksud' => 'required|string',
            'dasar' => 'required|string',
            'tempat_berangkat' => 'required|string',
            'tempat_tujuan' => 'required|string',
            'tanggal_berangkat' => 'required|date',
            'tanggal_kembali' => 'required|date|after:tanggal_berangkat',
            'lama_perjalanan' => 'required|integer|min:1',
            'jenis_angkutan' => 'required|in:darat,laut,udara,kendaraan_dinas',
            'pejabat_penandatangan_id' => 'nullable|exists:pegawais,id',
            'peserta' => 'required|array|min:1',
            'peserta.*.pegawai_id' => 'required|exists:pegawais,id',
            'peserta.*.peran' => 'required|in:ketua_tim,anggota',
            'status' => 'nullable|in:draft,final',
        ];
    }
}
```

**Step 4: Write SuratPerintahController**

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSuratPerintahRequest;
use App\Http\Requests\UpdateSuratPerintahRequest;
use App\Models\SuratPerintah;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SuratPerintahController extends Controller
{
    public function index(): Response
    {
        $suratPerintahs = SuratPerintah::with(['pejabatPenandatangan', 'pesertaPerjalanan.pegawai'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('SuratPerintah/Index', [
            'suratPerintahs' => $suratPerintahs,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('SuratPerintah/Create');
    }

    public function store(StoreSuratPerintahRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated) {
            $pesertaData = $validated['peserta'] ?? [];
            unset($validated['peserta']);

            $suratPerintah = SuratPerintah::create($validated);

            foreach ($pesertaData as $peserta) {
                $suratPerintah->pesertaPerjalanan()->create($peserta);
            }
        });

        return redirect()->route('surat-perintah.index')
            ->with('success', 'SPPD berhasil dibuat');
    }

    public function show(SuratPerintah $suratPerintah): Response
    {
        $suratPerintah->load(['pejabatPenandatangan', 'pesertaPerjalanan.pegawai']);

        return Inertia::render('SuratPerintah/Show', [
            'suratPerintah' => $suratPerintah,
        ]);
    }

    public function edit(SuratPerintah $suratPerintah): Response
    {
        $suratPerintah->load(['pejabatPenandatangan', 'pesertaPerjalanan.pegawai']);

        return Inertia::render('SuratPerintah/Edit', [
            'suratPerintah' => $suratPerintah,
        ]);
    }

    public function update(UpdateSuratPerintahRequest $request, SuratPerintah $suratPerintah): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated, $suratPerintah) {
            $pesertaData = $validated['peserta'] ?? [];
            unset($validated['peserta']);

            $suratPerintah->update($validated);

            $suratPerintah->pesertaPerjalanan()->delete();

            foreach ($pesertaData as $peserta) {
                $suratPerintah->pesertaPerjalanan()->create($peserta);
            }
        });

        return redirect()->route('surat-perintah.index')
            ->with('success', 'SPPD berhasil diperbarui');
    }

    public function destroy(SuratPerintah $suratPerintah): RedirectResponse
    {
        $suratPerintah->delete();

        return redirect()->route('surat-perintah.index')
            ->with('success', 'SPPD berhasil dihapus');
    }
}
```

**Step 5: Commit**

```bash
git add app/Http/Controllers/SuratPerintahController.php app/Http/Requests/StoreSuratPerintahRequest.php app/Http/Requests/UpdateSuratPerintahRequest.php
git commit -m "feat: create SuratPerintahController with form requests"
```

---

### Task 10: Register Routes

**Files:**
- Modify: `routes/web.php`

**Step 1: Add routes to web.php**

```php
<?php

use App\Http\Controllers\PegawaiController;
use App\Http\Controllers\SuratPerintahController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('surat-perintah.index');
});

Route::resource('pegawai', PegawaiController::class);
Route::resource('surat-perintah', SuratPerintahController::class);
```

**Step 2: Generate Wayfinder types**

Run: `php artisan wayfinder:generate --no-interaction`
Expected: TypeScript types generated for routes

**Step 3: Commit**

```bash
git add routes/web.php
git commit -m "feat: register pegawai and surat-perintah routes"
```

---

## Phase 4: Frontend - React Components

### Task 11: Create Pegawai Index Page

**Files:**
- Create: `resources/js/Pages/Pegawai/Index.tsx`
- Create: `resources/js/types/pegawai.ts`

**Step 1: Create Pegawai types**

```typescript
// resources/js/types/pegawai.ts
export interface Pegawai {
  id: number;
  nip: string;
  nama: string;
  jabatan: string;
  unit_kerja: string;
  golongan: string;
  pangkat: string | null;
  tmt: string | null;
  created_at: string;
  updated_at: string;
}
```

**Step 2: Create Pegawai Index component**

```tsx
// resources/js/Pages/Pegawai/Index.tsx
import { Head, Link } from '@inertiajs/react';
import type { Pegawai } from '@/types/pegawai';

interface Props {
  pegawais: Pegawai[];
}

export default function Index({ pegawais }: Props) {
  return (
    <>
      <Head title="Data Pegawai" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Data Pegawai
          </h1>
          <Link
            href="/pegawai/create"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Tambah Pegawai
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  NIP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Jabatan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Golongan
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {pegawais.map((pegawai) => (
                <tr key={pegawai.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {pegawai.nip}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {pegawai.nama}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {pegawai.jabatan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {pegawai.golongan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/pegawai/${pegawai.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pegawais.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Belum ada data pegawai</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
```

**Step 3: Commit**

```bash
git add resources/js/types/pegawai.ts resources/js/Pages/Pegawai/Index.tsx
git commit -m "feat: create Pegawai index page"
```

---

### Task 12: Create Pegawai Create Page with Form

**Files:**
- Create: `resources/js/Pages/Pegawai/Create.tsx`

**Step 1: Create Pegawai Create component**

```tsx
// resources/js/Pages/Pegawai/Create.tsx
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    nip: '',
    nama: '',
    jabatan: '',
    unit_kerja: '',
    golongan: '',
    pangkat: '',
    tmt: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/pegawai');
  };

  return (
    <>
      <Head title="Tambah Pegawai" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/pegawai"
            className="text-indigo-600 hover:text-indigo-800"
          >
            &larr; Kembali
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Tambah Pegawai Baru
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              NIP *
            </label>
            <input
              type="text"
              value={data.nip}
              onChange={(e) => setData('nip', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            {errors.nip && (
              <p className="mt-1 text-sm text-red-600">{errors.nip}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nama Lengkap *
            </label>
            <input
              type="text"
              value={data.nama}
              onChange={(e) => setData('nama', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            {errors.nama && (
              <p className="mt-1 text-sm text-red-600">{errors.nama}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Jabatan *
            </label>
            <input
              type="text"
              value={data.jabatan}
              onChange={(e) => setData('jabatan', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            {errors.jabatan && (
              <p className="mt-1 text-sm text-red-600">{errors.jabatan}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Unit Kerja *
            </label>
            <input
              type="text"
              value={data.unit_kerja}
              onChange={(e) => setData('unit_kerja', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            {errors.unit_kerja && (
              <p className="mt-1 text-sm text-red-600">{errors.unit_kerja}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Golongan *
              </label>
              <select
                value={data.golongan}
                onChange={(e) => setData('golongan', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="">Pilih Golongan</option>
                <option value="I/a">I/a</option>
                <option value="I/b">I/b</option>
                <option value="I/c">I/c</option>
                <option value="I/d">I/d</option>
                <option value="II/a">II/a</option>
                <option value="II/b">II/b</option>
                <option value="II/c">II/c</option>
                <option value="II/d">II/d</option>
                <option value="III/a">III/a</option>
                <option value="III/b">III/b</option>
                <option value="III/c">III/c</option>
                <option value="III/d">III/d</option>
                <option value="IV/a">IV/a</option>
                <option value="IV/b">IV/b</option>
                <option value="IV/c">IV/c</option>
                <option value="IV/e">IV/e</option>
              </select>
              {errors.golongan && (
                <p className="mt-1 text-sm text-red-600">{errors.golongan}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pangkat
              </label>
              <input
                type="text"
                value={data.pangkat}
                onChange={(e) => setData('pangkat', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {errors.pangkat && (
                <p className="mt-1 text-sm text-red-600">{errors.pangkat}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              TMT (Terhitung Mulai Tanggal)
            </label>
            <input
              type="date"
              value={data.tmt}
              onChange={(e) => setData('tmt', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.tmt && (
              <p className="mt-1 text-sm text-red-600">{errors.tmt}</p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Link
              href="/pegawai"
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {processing ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
```

**Step 2: Commit**

```bash
git add resources/js/Pages/Pegawai/Create.tsx
git commit -m "feat: create Pegawai create form page"
```

---

### Task 13: Create SuratPerintah Index Page

**Files:**
- Create: `resources/js/types/surat-perintah.ts`
- Create: `resources/js/Pages/SuratPerintah/Index.tsx`

**Step 1: Create SuratPerintah types**

```typescript
// resources/js/types/surat-perintah.ts
export interface PesertaPerjalanan {
  id: number;
  pegawai_id: number;
  peran: 'ketua_tim' | 'anggota';
  pegawai: {
    id: number;
    nip: string;
    nama: string;
    jabatan: string;
    golongan: string;
  };
}

export interface SuratPerintah {
  id: number;
  nomor_surat: string;
  maksud: string;
  dasar: string;
  tempat_berangkat: string;
  tempat_tujuan: string;
  tanggal_berangkat: string;
  tanggal_kembali: string;
  lama_perjalanan: number;
  jenis_angkutan: 'darat' | 'laut' | 'udara' | 'kendaraan_dinas';
  pejabat_penandatangan_id: number | null;
  status: 'draft' | 'final';
  pejabat_penandatangan?: {
    id: number;
    nama: string;
    jabatan: string;
  };
  peserta_perjalanan?: PesertaPerjalanan[];
  created_at: string;
  updated_at: string;
}
```

**Step 2: Create SuratPerintah Index component**

```tsx
// resources/js/Pages/SuratPerintah/Index.tsx
import { Head, Link } from '@inertiajs/react';
import type { SuratPerintah } from '@/types/surat-perintah';

interface Props {
  suratPerintahs: SuratPerintah[];
}

export default function Index({ suratPerintahs }: Props) {
  return (
    <>
      <Head title="Surat Perintah Perjalanan Dinas" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Surat Perintah Perjalanan Dinas
          </h1>
          <Link
            href="/surat-perintah/create"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Buat SPPD Baru
          </Link>
        </div>

        <div className="grid gap-4">
          {suratPerintahs.map((surat) => (
            <div
              key={surat.id}
              className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {surat.nomor_surat}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      surat.status === 'final'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {surat.status === 'final' ? 'Final' : 'Draft'}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    {surat.maksud}
                  </p>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>
                      <strong>Tujuan:</strong> {surat.tempat_tujuan}
                    </span>
                    <span>
                      <strong>Berangkat:</strong> {new Date(surat.tanggal_berangkat).toLocaleDateString('id-ID')}
                    </span>
                    <span>
                      <strong>Kembali:</strong> {new Date(surat.tanggal_kembali).toLocaleDateString('id-ID')}
                    </span>
                    <span>
                      <strong>Durasi:</strong> {surat.lama_perjalanan} hari
                    </span>
                  </div>

                  {surat.peserta_perjalanan && surat.peserta_perjalanan.length > 0 && (
                    <div className="mt-3">
                      <strong className="text-sm text-gray-600 dark:text-gray-400">Peserta:</strong>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {surat.peserta_perjalanan.map((peserta) => (
                          <span
                            key={peserta.id}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-sm rounded"
                          >
                            {peserta.peran === 'ketua_tim' ? '👑 ' : ''}{peserta.pegawai.nama}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <Link
                    href={`/surat-perintah/${surat.id}`}
                    className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-200"
                  >
                    Lihat
                  </Link>
                  <Link
                    href={`/surat-perintah/${surat.id}/edit`}
                    className="px-3 py-1 text-sm bg-gray-50 text-gray-600 rounded hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {suratPerintahs.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 shadow rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">Belum ada data SPPD</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
```

**Step 3: Commit**

```bash
git add resources/js/types/surat-perintah.ts resources/js/Pages/SuratPerintah/Index.tsx
git commit -m "feat: create SuratPerintah index page"
```

---

### Task 14: Create SuratPerintah Create Page with Multi-Step Form

**Files:**
- Create: `resources/js/Pages/SuratPerintah/Create.tsx`

**Step 1: Create SuratPerintah Create component with wizard**

```tsx
// resources/js/Pages/SuratPerintah/Create.tsx
import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

type JenisAngkutan = 'darat' | 'laut' | 'udara' | 'kendaraan_dinas';
type Peran = 'ketua_tim' | 'anggota';

interface PegawaiOption {
  id: number;
  nip: string;
  nama: string;
  jabatan: string;
}

export default function Create() {
  const [step, setStep] = useState(1);
  const [pegawais, setPegawais] = useState<PegawaiOption[]>([]);

  const { data, setData, post, processing, errors } = useForm({
    nomor_surat: '',
    maksud: '',
    dasar: '',
    tempat_berangkat: 'Kantor Pengadilan Agama Penajam',
    tempat_tujuan: '',
    tanggal_berangkat: '',
    tanggal_kembali: '',
    lama_perjalanan: 1,
    jenis_angkutan: 'darat' as JenisAngkutan,
    pejabat_penandatangan_id: '',
    peserta: [] as Array<{ pegawai_id: number; peran: Peran }>,
  });

  // Fetch pegawais on mount
  useState(() => {
    fetch('/api/pegawais')
      .then(res => res.json())
      .then(data => setPegawais(data));
  });

  const calculateDuration = () => {
    if (data.tanggal_berangkat && data.tanggal_kembali) {
      const start = new Date(data.tanggal_berangkat);
      const end = new Date(data.tanggal_kembali);
      const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      if (diff > 0) {
        setData('lama_perjalanan', diff);
      }
    }
  };

  const addPeserta = (pegawaiId: number) => {
    if (!data.peserta.find(p => p.pegawai_id === pegawaiId)) {
      setData('peserta', [...data.peserta, { pegawai_id: pegawaiId, peran: 'anggota' as Peran }]);
    }
  };

  const removePeserta = (pegawaiId: number) => {
    setData('peserta', data.peserta.filter(p => p.pegawai_id !== pegawaiId));
  };

  const updatePeran = (pegawaiId: number, peran: Peran) => {
    setData('peserta', data.peserta.map(p =>
      p.pegawai_id === pegawaiId ? { ...p, peran } : p
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      post('/surat-perintah');
    }
  };

  return (
    <>
      <Head title="Buat SPPD Baru" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/surat-perintah" className="text-indigo-600 hover:text-indigo-800">
            &larr; Kembali
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Buat SPPD Baru
        </h1>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step >= s ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-24 h-1 mx-2 ${step > s ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span>Detail Surat</span>
            <span>Waktu & Tempat</span>
            <span>Peserta</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Detail Surat */}
          {step === 1 && (
            <div className="space-y-6 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nomor Surat *
                </label>
                <input
                  type="text"
                  value={data.nomor_surat}
                  onChange={(e) => setData('nomor_surat', e.target.value)}
                  placeholder="Contoh: SPPD/001/2025"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
                {errors.nomor_surat && (
                  <p className="mt-1 text-sm text-red-600">{errors.nomor_surat}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Maksud Perjalanan *
                </label>
                <textarea
                  value={data.maksud}
                  onChange={(e) => setData('maksud', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
                {errors.maksud && (
                  <p className="mt-1 text-sm text-red-600">{errors.maksud}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Dasar Surat *
                </label>
                <textarea
                  value={data.dasar}
                  onChange={(e) => setData('dasar', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
                {errors.dasar && (
                  <p className="mt-1 text-sm text-red-600">{errors.dasar}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Waktu & Tempat */}
          {step === 2 && (
            <div className="space-y-6 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tempat Berangkat *
                </label>
                <input
                  type="text"
                  value={data.tempat_berangkat}
                  onChange={(e) => setData('tempat_berangkat', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tempat Tujuan *
                </label>
                <input
                  type="text"
                  value={data.tempat_tujuan}
                  onChange={(e) => setData('tempat_tujuan', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
                {errors.tempat_tujuan && (
                  <p className="mt-1 text-sm text-red-600">{errors.tempat_tujuan}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tanggal Berangkat *
                  </label>
                  <input
                    type="date"
                    value={data.tanggal_berangkat}
                    onChange={(e) => {
                      setData('tanggal_berangkat', e.target.value);
                      setTimeout(calculateDuration, 0);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                  {errors.tanggal_berangkat && (
                    <p className="mt-1 text-sm text-red-600">{errors.tanggal_berangkat}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tanggal Kembali *
                  </label>
                  <input
                    type="date"
                    value={data.tanggal_kembali}
                    onChange={(e) => {
                      setData('tanggal_kembali', e.target.value);
                      setTimeout(calculateDuration, 0);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                  {errors.tanggal_kembali && (
                    <p className="mt-1 text-sm text-red-600">{errors.tanggal_kembali}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Lama Perjalanan (hari)
                  </label>
                  <input
                    type="number"
                    value={data.lama_perjalanan}
                    onChange={(e) => setData('lama_perjalanan', parseInt(e.target.value) || 1)}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Jenis Angkutan *
                  </label>
                  <select
                    value={data.jenis_angkutan}
                    onChange={(e) => setData('jenis_angkutan', e.target.value as JenisAngkutan)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  >
                    <option value="darat">Darat</option>
                    <option value="laut">Laut</option>
                    <option value="udara">Udara</option>
                    <option value="kendaraan_dinas">Kendaraan Dinas</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Peserta */}
          {step === 3 && (
            <div className="space-y-6 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cari Pegawai
                </label>
                <input
                  type="text"
                  placeholder="Ketik nama atau NIP..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {data.peserta.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Peserta yang Dipilih ({data.peserta.length})
                  </label>
                  <div className="space-y-2">
                    {data.peserta.map((p) => {
                      const pegawai = pegawais.find(pg => pg.id === p.pegawai_id);
                      if (!pegawai) return null;

                      return (
                        <div key={p.pegawai_id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{pegawai.nama}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{pegawai.nip}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <select
                              value={p.peran}
                              onChange={(e) => updatePeran(p.pegawai_id, e.target.value as Peran)}
                              className="px-2 py-1 border border-gray-300 rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white text-sm"
                            >
                              <option value="anggota">Anggota</option>
                              <option value="ketua_tim">Ketua Tim</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => removePeserta(p.pegawai_id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {errors.peserta && (
                <p className="text-sm text-red-600">{errors.peserta}</p>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Sebelumnya
            </button>

            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {processing ? 'Memproses...' : step === 3 ? 'Simpan SPPD' : 'Selanjutnya'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
```

**Step 2: Create API endpoint for pegawais list**

Add to `routes/api.php`:
```php
Route::get('/pegawais', function () {
    return \App\Models\Pegawai::select('id', 'nip', 'nama', 'jabatan')->get();
});
```

**Step 3: Commit**

```bash
git add routes/api.php resources/js/Pages/SuratPerintah/Create.tsx
git commit -m "feat: create SuratPerintah create page with multi-step form"
```

---

## Phase 5: Tests

### Task 15: Write Pegawai Model Tests

**Files:**
- Create: `tests/Unit/PegawaiTest.php`

**Step 1: Create Pest test file**

Run: `php artisan make:test --pest --unit PegawaiTest --no-interaction`
Expected: Test file created in tests/Unit

**Step 2: Write Pegawai model tests**

```php
<?php

use App\Models\Pegawai;

it('can create a pegawai', function () {
    $pegawai = Pegawai::factory()->create();

    expect($pegawai->id)->not->toBeNull();
    expect($pegawai->nip)->not->toBeEmpty();
    expect($pegawai->nama)->not->toBeEmpty();
});

it('has many surat perintah as pejabat', function () {
    $pegawai = Pegawai::factory()->create();

    $pegawai->suratPerintahsAsPejabat()->create([
        'nomor_surat' => 'SPPD/001/2025',
        'maksud' => 'Test',
        'dasar' => 'Test',
        'tempat_berangkat' => 'Kantor',
        'tempat_tujuan' => 'Jakarta',
        'tanggal_berangkat' => now(),
        'tanggal_kembali' => now()->addDay(),
        'lama_perjalanan' => 1,
    ]);

    expect($pegawai->suratPerintahsAsPejabat)->toHaveCount(1);
});

it('has many peserta perjalanan', function () {
    $pegawai = Pegawai::factory()->create();

    $pegawai->pesertaPerjalanan()->create([
        'surat_perintah_id' => \App\Models\SuratPerintah::factory()->create()->id,
        'peran' => 'anggota',
    ]);

    expect($pegawai->pesertaPerjalanan)->toHaveCount(1);
});
```

**Step 3: Run tests**

Run: `php artisan test --compact tests/Unit/PegawaiTest.php`
Expected: All tests pass

**Step 4: Commit**

```bash
git add tests/Unit/PegawaiTest.php
git commit -m "test: add Pegawai model unit tests"
```

---

### Task 16: Write SuratPerintah Model Tests

**Files:**
- Create: `tests/Unit/SuratPerintahTest.php`

**Step 1: Create Pest test file**

Run: `php artisan make:test --pest --unit SuratPerintahTest --no-interaction`
Expected: Test file created

**Step 2: Write SuratPerintah model tests**

```php
<?php

use App\Models\Pegawai;
use App\Models\SuratPerintah;

it('can create a surat perintah', function () {
    $surat = SuratPerintah::factory()->create();

    expect($surat->id)->not->toBeNull();
    expect($surat->nomor_surat)->not->toBeEmpty();
});

it('belongs to pejabat penandatangan', function () {
    $pejabat = Pegawai::factory()->create();
    $surat = SuratPerintah::factory()->create([
        'pejabat_penandatangan_id' => $pejabat->id,
    ]);

    expect($surat->pejabatPenandatangan->id)->toBe($pejabat->id);
});

it('has many peserta perjalanan', function () {
    $surat = SuratPerintah::factory()->create();

    $surat->pesertaPerjalanan()->createMany([
        ['pegawai_id' => Pegawai::factory()->create()->id, 'peran' => 'ketua_tim'],
        ['pegawai_id' => Pegawai::factory()->create()->id, 'peran' => 'anggota'],
    ]);

    expect($surat->pesertaPerjalanan)->toHaveCount(2);
});

it('calculates lama_perjalanan correctly', function () {
    $surat = SuratPerintah::factory()->create([
        'tanggal_berangkat' => '2025-01-15',
        'tanggal_kembali' => '2025-01-17',
        'lama_perjalanan' => 3,
    ]);

    expect($surat->lama_perjalanan)->toBe(3);
});
```

**Step 3: Run tests**

Run: `php artisan test --compact tests/Unit/SuratPerintahTest.php`
Expected: All tests pass

**Step 4: Commit**

```bash
git add tests/Unit/SuratPerintahTest.php
git commit -m "test: add SuratPerintah model unit tests"
```

---

### Task 17: Write Pegawai Controller Feature Tests

**Files:**
- Create: `tests/Feature/PegawaiTest.php`

**Step 1: Create Pest test file**

Run: `php artisan make:test --pest PegawaiTest --no-interaction`
Expected: Test file created in tests/Feature

**Step 2: Write Pegawai controller tests**

```php
<?php

use App\Models\Pegawai;

it('can display pegawai index page', function () {
    Pegawai::factory(5)->create();

    $response = $this->get('/pegawai');

    $response->assertStatus(200);
});

it('can display pegawai create page', function () {
    $response = $this->get('/pegawai/create');

    $response->assertStatus(200);
});

it('can store a new pegawai', function () {
    $response = $this->post('/pegawai', [
        'nip' => '123456789012345678',
        'nama' => 'John Doe',
        'jabatan' => 'Staff',
        'unit_kerja' => 'Unit 1',
        'golongan' => 'III/a',
        'pangkat' => 'Penata',
        'tmt' => '2020-01-01',
    ]);

    $response->assertRedirect('/pegawai');
    $this->assertDatabaseHas('pegawais', [
        'nip' => '123456789012345678',
        'nama' => 'John Doe',
    ]);
});

it('validates required fields when storing pegawai', function () {
    $response = $this->post('/pegawai', []);

    $response->assertSessionHasErrors(['nip', 'nama', 'jabatan', 'unit_kerja', 'golongan']);
});

it('can update a pegawai', function () {
    $pegawai = Pegawai::factory()->create();

    $response = $this->put("/pegawai/{$pegawai->id}", [
        'nip' => $pegawai->nip,
        'nama' => 'Updated Name',
        'jabatan' => $pegawai->jabatan,
        'unit_kerja' => $pegawai->unit_kerja,
        'golongan' => $pegawai->golongan,
    ]);

    $response->assertRedirect('/pegawai');
    $this->assertDatabaseHas('pegawais', [
        'id' => $pegawai->id,
        'nama' => 'Updated Name',
    ]);
});

it('can delete a pegawai', function () {
    $pegawai = Pegawai::factory()->create();

    $response = $this->delete("/pegawai/{$pegawai->id}");

    $response->assertRedirect('/pegawai');
    $this->assertDatabaseMissing('pegawais', [
        'id' => $pegawai->id,
    ]);
});
```

**Step 3: Run tests**

Run: `php artisan test --compact tests/Feature/PegawaiTest.php`
Expected: All tests pass

**Step 4: Commit**

```bash
git add tests/Feature/PegawaiTest.php
git commit -m "test: add Pegawai controller feature tests"
```

---

### Task 18: Write SuratPerintah Controller Feature Tests

**Files:**
- Create: `tests/Feature/SuratPerintahTest.php`

**Step 1: Create Pest test file**

Run: `php artisan make:test --pest SuratPerintahTest --no-interaction`
Expected: Test file created

**Step 2: Write SuratPerintah controller tests**

```php
<?php

use App\Models\Pegawai;
use App\Models\SuratPerintah;

it('can display surat perintah index page', function () {
    SuratPerintah::factory(5)->create();

    $response = $this->get('/surat-perintah');

    $response->assertStatus(200);
});

it('can display surat perintah create page', function () {
    $response = $this->get('/surat-perintah/create');

    $response->assertStatus(200);
});

it('can store a new surat perintah with peserta', function () {
    $peserta1 = Pegawai::factory()->create();
    $peserta2 = Pegawai::factory()->create();

    $response = $this->post('/surat-perintah', [
        'nomor_surat' => 'SPPD/001/2025',
        'maksud' => 'Test perjalanan',
        'dasar' => 'Surat undangan',
        'tempat_berangkat' => 'Kantor',
        'tempat_tujuan' => 'Jakarta',
        'tanggal_berangkat' => '2025-02-01',
        'tanggal_kembali' => '2025-02-03',
        'lama_perjalanan' => 3,
        'jenis_angkutan' => 'darat',
        'peserta' => [
            ['pegawai_id' => $peserta1->id, 'peran' => 'ketua_tim'],
            ['pegawai_id' => $peserta2->id, 'peran' => 'anggota'],
        ],
        'status' => 'draft',
    ]);

    $response->assertRedirect('/surat-perintah');
    $this->assertDatabaseHas('surat_perintahs', [
        'nomor_surat' => 'SPPD/001/2025',
    ]);
    $this->assertDatabaseHas('peserta_perjalanans', [
        'pegawai_id' => $peserta1->id,
        'peran' => 'ketua_tim',
    ]);
});

it('validates tanggal_kembali is after tanggal_berangkat', function () {
    $response = $this->post('/surat-perintah', [
        'nomor_surat' => 'SPPD/002/2025',
        'maksud' => 'Test',
        'dasar' => 'Test',
        'tempat_berangkat' => 'Kantor',
        'tempat_tujuan' => 'Jakarta',
        'tanggal_berangkat' => '2025-02-03',
        'tanggal_kembali' => '2025-02-01',
        'lama_perjalanan' => 1,
        'jenis_angkutan' => 'darat',
        'peserta' => [['pegawai_id' => Pegawai::factory()->create()->id, 'peran' => 'anggota']],
    ]);

    $response->assertSessionHasErrors(['tanggal_kembali']);
});

it('requires at least one peserta', function () {
    $response = $this->post('/surat-perintah', [
        'nomor_surat' => 'SPPD/003/2025',
        'maksud' => 'Test',
        'dasar' => 'Test',
        'tempat_berangkat' => 'Kantor',
        'tempat_tujuan' => 'Jakarta',
        'tanggal_berangkat' => '2025-02-01',
        'tanggal_kembali' => '2025-02-03',
        'lama_perjalanan' => 3,
        'jenis_angkutan' => 'darat',
        'peserta' => [],
    ]);

    $response->assertSessionHasErrors(['peserta']);
});

it('can delete a surat perintah', function () {
    $surat = SuratPerintah::factory()->create();

    $response = $this->delete("/surat-perintah/{$surat->id}");

    $response->assertRedirect('/surat-perintah');
    $this->assertDatabaseMissing('surat_perintahs', [
        'id' => $surat->id,
    ]);
});
```

**Step 3: Run tests**

Run: `php artisan test --compact tests/Feature/SuratPerintahTest.php`
Expected: All tests pass

**Step 4: Commit**

```bash
git add tests/Feature/SuratPerintahTest.php
git commit -m "test: add SuratPerintah controller feature tests"
```

---

## Phase 6: Print Views

### Task 19: Create Surat Tugas Print View

**Files:**
- Create: `resources/js/Pages/SuratPerintah/PrintSuratTugas.tsx`

**Step 1: Create Surat Tugas print component**

```tsx
// resources/js/Pages/SuratPerintah/PrintSuratTugas.tsx
import { Head } from '@inertiajs/react';
import type { SuratPerintah } from '@/types/surat-perintah';

interface Props {
  suratPerintah: SuratPerintah;
}

export default function PrintSuratTugas({ suratPerintah }: Props) {
  const tanggalBerangkat = new Date(suratPerintah.tanggal_berangkat).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const tanggalKembali = new Date(suratPerintah.tanggal_kembali).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <Head title={`Surat Tugas - ${suratPerintah.nomor_surat}`} />

      <div className="max-w-4xl mx-auto bg-white p-12 print:p-8">
        {/* Kop Surat */}
        <div className="text-center border-b-2 border-black pb-4 mb-8">
          <h1 className="text-xl font-bold uppercase">Kementerian Agama Republik Indonesia</h1>
          <h2 className="text-lg font-bold uppercase">Pengadilan Agama Penajam</h2>
          <p className="text-sm mt-2">Jl. Jenderal Sudirman No. 123, Penajam Paser Utara</p>
        </div>

        {/* Judul */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold underline">SURAT TUGAS</h2>
          <p className="text-lg">Nomor: {suratPerintah.nomor_surat}</p>
        </div>

        {/* Isi Surat */}
        <div className="text-justify leading-relaxed">
          <p className="mb-4">
            Menimbang demi terselenggaranya tugas pokok Pengadilan Agama Penajam, dengan ini ditugaskan kepada:
          </p>

          {/* Daftar Peserta */}
          <div className="ml-8 mb-6">
            {suratPerintah.peserta_perjalanan?.map((peserta, index) => (
              <p key={peserta.id} className="mb-2">
                {index + 1}. Nama: <strong>{peserta.pegawai.nama}</strong><br />
                <span className="ml-8">NIP: {peserta.pegawai.nip}</span><br />
                <span className="ml-8">Jabatan: {peserta.pegawai.jabatan}</span>
              </p>
            ))}
          </div>

          <p className="mb-4">
            Untuk melaksanakan tugas perjalanan dinas dengan rincian sebagai berikut:
          </p>

          <div className="ml-8 mb-6">
            <p>a. Maksud perjalanan: {suratPerintah.maksud}</p>
            <p>b. Tempat berangkat: {suratPerintah.tempat_berangkat}</p>
            <p>c. Tempat tujuan: {suratPerintah.tempat_tujuan}</p>
            <p>d. Tanggal berangkat: {tanggalBerangkat}</p>
            <p>e. Tanggal kembali: {tanggalKembali}</p>
            <p>f. Lama perjalanan: {suratPerintah.lama_perjalanan} hari</p>
            <p>g. Jenis angkutan: {suratPerintah.jenis_angkutan === 'kendaraan_dinas' ? 'Kendaraan Dinas' : suratPerintah.jenis_angkutan}</p>
          </div>

          <p className="mb-4">
            Demikian surat tugas ini dibuat untuk dilaksanakan dengan penuh tanggung jawab.
          </p>
        </div>

        {/* Tanda Tangan */}
        <div className="flex justify-end mt-12">
          <div className="text-center w-64">
            <p className="mb-2">Penajam, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="mb-16">Pejabat Penandatangan</p>
            {suratPerintah.pejabat_penandatangan && (
              <>
                <p className="font-bold underline">{suratPerintah.pejabat_penandatangan.nama}</p>
                <p>{suratPerintah.pejabat_penandatangan.jabatan}</p>
                <p className="text-sm mt-2">NIP. {suratPerintah.pejabat_penandatangan_id}</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Print Button */}
      <div className="no-print fixed bottom-4 right-4">
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg"
        >
          Cetak Surat
        </button>
      </div>

      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
```

**Step 2: Add print route**

In `routes/web.php`, add:
```php
Route::get('/surat-perintah/{suratPerintah}/print-surat-tugas', [SuratPerintahController::class, 'printSuratTugas'])->name('surat-perintah.print-surat-tugas');
```

**Step 3: Add controller method**

```php
public function printSuratTugas(SuratPerintah $suratPerintah): Response
{
    $suratPerintah->load(['pejabatPenandatangan', 'pesertaPerjalanan.pegawai']);

    return Inertia::render('SuratPerintah/PrintSuratTugas', [
        'suratPerintah' => $suratPerintah,
    ]);
}
```

**Step 4: Commit**

```bash
git add resources/js/Pages/SuratPerintah/PrintSuratTugas.tsx routes/web.php app/Http/Controllers/SuratPerintahController.php
git commit -m "feat: add Surat Tugas print view"
```

---

### Task 20: Create SPPD Lembar 1 Print View

**Files:**
- Create: `resources/js/Pages/SuratPerintah/PrintSPPDLembar1.tsx`

**Step 1: Create SPPD Lembar 1 print component**

```tsx
// resources/js/Pages/SuratPerintah/PrintSPPDLembar1.tsx
import { Head } from '@inertiajs/react';
import type { SuratPerintah } from '@/types/surat-perintah';

interface Props {
  suratPerintah: SuratPerintah;
}

export default function PrintSPPDLembar1({ suratPerintah }: Props) {
  const ketuaTim = suratPerintah.peserta_perjalanan?.find(p => p.peran === 'ketua_tim')?.pegawai;
  const peserta = suratPerintah.peserta_perjalanan?.filter(p => p.peran === 'anggota');

  return (
    <>
      <Head title={`SPPD Lembar 1 - ${suratPerintah.nomor_surat}`} />

      <div className="max-w-4xl mx-auto bg-white p-8 print:p-6 border-2 border-black">
        {/* Header */}
        <div className="text-center border-b border-black pb-2 mb-4">
          <h1 className="text-lg font-bold">SURAT PERINTAH PERJALANAN DINAS</h1>
          <p className="text-sm">SPPD</p>
        </div>

        {/* Info Peserta */}
        {ketuaTim && (
          <div className="mb-4">
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="w-1/3 py-1">1. Nama</td>
                  <td className="w-1/6">: {ketuaTim.nama}</td>
                  <td className="w-1/6">3. Nama</td>
                  <td className="w-1/3">: {peserta?.[0]?.pegawai.nama || '-'}</td>
                </tr>
                <tr>
                  <td className="py-1">2. NIP</td>
                  <td>: {ketuaTim.nip}</td>
                  <td>4. NIP</td>
                  <td>: {peserta?.[0]?.pegawai.nip || '-'}</td>
                </tr>
                <tr>
                  <td className="py-1">Golongan/Pangkat</td>
                  <td>: {ketuaTim.golongan || '-'}</td>
                  <td>Golongan/Pangkat</td>
                  <td>: {peserta?.[0]?.pegawai.golongan || '-'}</td>
                </tr>
                <tr>
                  <td className="py-1">Jabatan</td>
                  <td>: {ketuaTim.jabatan}</td>
                  <td>Jabatan</td>
                  <td>: {peserta?.[0]?.pegawai.jabatan || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Rincian Perjalanan */}
        <div className="mb-4">
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-1">5. Maksud Perjalanan Dinas</td>
              </tr>
              <tr>
                <td className="pl-8 pb-2">{suratPerintah.maksud}</td>
              </tr>
              <tr>
                <td className="py-1">6. Tempat Berangkat</td>
                <td>: {suratPerintah.tempat_berangkat}</td>
              </tr>
              <tr>
                <td className="py-1">7. Tempat Tujuan</td>
                <td>: {suratPerintah.tempat_tujuan}</td>
              </tr>
              <tr>
                <td className="py-1">8. Tanggal Berangkat</td>
                <td>: {new Date(suratPerintah.tanggal_berangkat).toLocaleDateString('id-ID')}</td>
              </tr>
              <tr>
                <td className="py-1">9. Tanggal Kembali</td>
                <td>: {new Date(suratPerintah.tanggal_kembali).toLocaleDateString('id-ID')}</td>
              </tr>
              <tr>
                <td className="py-1">10. Lama Perjalanan</td>
                <td>: {suratPerintah.lama_perjalanan} hari</td>
              </tr>
              <tr>
                <td className="py-1">11. Jenis Angkutan</td>
                <td>: {suratPerintah.jenis_angkutan === 'kendaraan_dinas' ? 'Kendaraan Dinas' : suratPerintah.jenis_angkutan}</td>
              </tr>
              <tr>
                <td className="py-1">12. Pengikut</td>
                <td>: -</td>
              </tr>
              <tr>
                <td className="py-1">13. Alat Angkutan</td>
                <td>: -</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Dasar Penugasan */}
        <div className="mb-6">
          <p className="text-sm">14. Dasar Penugasan:</p>
          <p className="text-sm pl-8">{suratPerintah.dasar}</p>
        </div>

        {/* Tanda Tangan */}
        <div className="flex justify-between mt-8">
          <div className="text-center w-48">
            <p className="text-sm mb-16">Yang diperintahkan,</p>
            <p className="font-bold underline text-sm">{ketuaTim?.nama}</p>
            <p className="text-sm">NIP. {ketuaTim?.nip}</p>
          </div>

          <div className="text-center w-48">
            <p className="text-sm mb-2">Penajam, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="text-sm mb-16">Pejabat Penandatangan,</p>
            {suratPerintah.pejabat_penandatangan && (
              <>
                <p className="font-bold underline text-sm">{suratPerintah.pejabat_penandatangan.nama}</p>
                <p className="text-sm">NIP. {suratPerintah.pejabat_penandatangan_id}</p>
              </>
            )}
          </div>
        </div>

        {/* Nomor Surat */}
        <div className="text-center mt-8 pt-4 border-t border-black">
          <p className="text-sm">Nomor: {suratPerintah.nomor_surat}</p>
        </div>
      </div>

      {/* Print Button */}
      <div className="no-print fixed bottom-4 right-4">
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg"
        >
          Cetak SPPD
        </button>
      </div>

      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
```

**Step 2: Add route and controller method**

In `routes/web.php`:
```php
Route::get('/surat-perintah/{suratPerintah}/print-sppd-lembar-1', [SuratPerintahController::class, 'printSPPDLembar1'])->name('surat-perintah.print-sppd-lembar-1');
```

In `SuratPerintahController.php`:
```php
public function printSPPDLembar1(SuratPerintah $suratPerintah): Response
{
    $suratPerintah->load(['pejabatPenandatangan', 'pesertaPerjalanan.pegawai']);

    return Inertia::render('SuratPerintah/PrintSPPDLembar1', [
        'suratPerintah' => $suratPerintah,
    ]);
}
```

**Step 3: Commit**

```bash
git add resources/js/Pages/SuratPerintah/PrintSPPDLembar1.tsx routes/web.php app/Http/Controllers/SuratPerintahController.php
git commit -m "feat: add SPPD Lembar 1 print view"
```

---

### Task 21: Run Pint and Final Tests

**Files:**
- Modify: All PHP files (code style only)

**Step 1: Run Laravel Pint**

Run: `vendor/bin/pint --dirty`
Expected: Code formatting applied if needed

**Step 2: Run complete test suite**

Run: `php artisan test --compact`
Expected: All tests pass

**Step 3: Generate Wayfinder types**

Run: `php artisan wayfinder:generate --no-interaction`
Expected: TypeScript types updated

**Step 4: Build frontend**

Run: `npm run build`
Expected: Frontend assets compiled

**Step 5: Final commit**

```bash
git add .
git commit -m "chore: final code formatting and build"
```

---

## Summary

Rencana ini mencakup:

1. **Database Setup** (Tasks 1-4): Migrations untuk pegawais, surat_perintahs, dan peserta_perjalanans
2. **Models & Factories** (Tasks 5-7): Model dengan relationships dan factories untuk testing
3. **Controllers & Validation** (Tasks 8-10): RESTful controllers dengan form requests
4. **Frontend Pages** (Tasks 11-14): React components dengan Inertia untuk CRUD pegawai dan SPPD
5. **Tests** (Tasks 15-18): Unit dan feature tests untuk models dan controllers
6. **Print Views** (Tasks 19-20): Format cetak Surat Tugas dan SPPD

**Total Tasks:** 21
**Estimated Time:** 6-8 jam implementasi
**Tech Stack:** Laravel 12, PHP 8.2+, Inertia v2, React 19, TypeScript, Tailwind CSS v4, Pest 4
