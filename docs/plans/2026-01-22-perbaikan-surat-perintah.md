# Perbaikan Surat Perintah - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Memperbaiki aplikasi SPPD dengan membuat file frontend yang hilang (Show.tsx, Edit.tsx) dan memperbaiki test yang gagal.

**Architecture:** Laravel 12 + Inertia.js v2 + React 19 + Tailwind CSS v4. Menggunakan pattern yang sudah ada di Index.tsx dan Create.tsx sebagai referensi.

**Tech Stack:** Laravel, Inertia.js, React, TypeScript, Tailwind CSS, Pest

---

## Task 1: Buat file Show.tsx untuk detail Surat Perintah

**Files:**
- Create: `resources/js/pages/SuratPerintah/Show.tsx`
- Reference: `resources/js/pages/SuratPerintah/Index.tsx`
- Controller: `app/Http/Controllers/SuratPerintahController.php:50-57`

**Step 1: Buat file Show.tsx dengan tampilan detail surat perintah**

```tsx
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app/app-header-layout';
import { Heading } from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import type { SuratPerintah as SuratPerintahType } from '@/pages/types/surat-perintah';

interface ShowProps {
    suratPerintah: SuratPerintahType & {
        pejabat_penandatangan: { nama: string; nip: string; jabatan: string };
        peserta_perjalanan: Array<{
            id: number;
            pegawai: { nama: string; nip: string; jabatan: string };
            peran: string;
        }>;
    };
}

export default function Show({ suratPerintah }: ShowProps) {
    return (
        <AppLayout>
            <Head title={`Surat Perintah - ${suratPerintah.nomor_surat}`} />

            <div className="space-y-6 px-6 py-6">
                <Heading title="Detail Surat Perintah" subtitle={suratPerintah.nomor_surat} />

                <Separator />

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Informasi Surat</h3>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Nomor Surat:</span>
                                <span className="font-medium">{suratPerintah.nomor_surat}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Status:</span>
                                <span className={`font-medium ${suratPerintah.status === 'draft' ? 'text-yellow-600' : 'text-green-600'}`}>
                                    {suratPerintah.status === 'draft' ? 'Draft' : 'Final'}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Maksud:</span>
                                <span className="font-medium">{suratPerintah.maksud}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Dasar:</span>
                                <span className="font-medium">{suratPerintah.dasar}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Perjalanan</h3>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tempat Berangkat:</span>
                                <span className="font-medium">{suratPerintah.tempat_berangkat}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tempat Tujuan:</span>
                                <span className="font-medium">{suratPerintah.tempat_tujuan}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tanggal Berangkat:</span>
                                <span className="font-medium">{suratPerintah.tanggal_berangkat}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tanggal Kembali:</span>
                                <span className="font-medium">{suratPerintah.tanggal_kembali}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Lama Perjalanan:</span>
                                <span className="font-medium">{suratPerintah.lama_perjalanan} hari</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Jenis Angkutan:</span>
                                <span className="font-medium">{suratPerintah.jenis_angkutan}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Pejabat Penandatangan</h3>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Nama:</span>
                            <span className="font-medium">{suratPerintah.pejabat_penandatangan.nama}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-muted-foreground">NIP:</span>
                            <span className="font-medium">{suratPerintah.pejabat_penandatangan.nip}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Jabatan:</span>
                            <span className="font-medium">{suratPerintah.pejabat_penandatangan.jabatan}</span>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Peserta Perjalanan</h3>

                    {suratPerintah.peserta_perjalanan.length > 0 ? (
                        <div className="grid gap-4">
                            {suratPerintah.peserta_perjalanan.map((peserta) => (
                                <div key={peserta.id} className="rounded-lg border p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="font-medium">{peserta.pegawai.nama}</p>
                                            <p className="text-sm text-muted-foreground">{peserta.pegawai.nip}</p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-sm text-muted-foreground">Peran</p>
                                            <p className="font-medium">{peserta.peran}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">Tidak ada peserta perjalanan.</p>
                    )}
                </div>

                <Separator />

                <div className="flex gap-4">
                    <a
                        href={route('surat-perintah.edit', suratPerintah.id)}
                        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        Edit Surat Perintah
                    </a>

                    <a
                        href={route('surat-perintah.print-surat-tugas', suratPerintah.id)}
                        target="_blank"
                        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                    >
                        Cetak Surat Tugas
                    </a>

                    <a
                        href={route('surat-perintah.print-sppd-lembar-1', suratPerintah.id)}
                        target="_blank"
                        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                    >
                        Cetak SPPD Lembar 1
                    </a>

                    <a
                        href={route('surat-perintah.index')}
                        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                    >
                        Kembali
                    </a>
                </div>
            </div>
        </AppLayout>
    );
}
```

**Step 2: Verifikasi file dibuat**

Run: `ls -la resources/js/pages/SuratPerintah/Show.tsx`
Expected: File exists

**Step 3: Jalankan rebuild Vite**

Run: `npm run build`
Expected: Build completes without errors

**Step 4: Commit**

```bash
git add resources/js/pages/SuratPerintah/Show.tsx
git commit -m "feat: add Show page for Surat Perintah detail view"
```

---

## Task 2: Buat file Edit.tsx untuk edit Surat Perintah

**Files:**
- Create: `resources/js/pages/SuratPerintah/Edit.tsx`
- Reference: `resources/js/pages/SuratPerintah/Create.tsx`
- Controller: `app/Http/Controllers/SuratPerintahController.php:59-66`

**Step 1: Buat file Edit.tsx dengan form edit surat perintah**

```tsx
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app/app-header-layout';
import { Heading } from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputError } from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type { SuratPerintah as SuratPerintahType } from '@/pages/types/surat-perintah';

interface EditProps {
    suratPerintah: SuratPerintahType & {
        pejabat_penandatangan: { id: number; nama: string; nip: string; jabatan: string };
        peserta_perjalanan: Array<{
            id: number;
            pegawai: { id: number; nama: string; nip: string; jabatan: string };
            peran: string;
        }>;
    };
    pegawais: Array<{ id: number; nama: string; nip: string }>;
}

interface FormData {
    nomor_surat: string;
    maksud: string;
    dasar: string;
    tempat_berangkat: string;
    tempat_tujuan: string;
    tanggal_berangkat: string;
    tanggal_kembali: string;
    lama_perjalanan: number;
    jenis_angkutan: string;
    pejabat_penandatangan_id: number | null;
    peserta: Array<{ pegawai_id: number; peran: string }>;
}

export default function Edit({ suratPerintah, pegawais }: EditProps) {
    const { data, setData, put, processing, errors } = useForm<FormData>({
        nomor_surat: suratPerintah.nomor_surat,
        maksud: suratPerintah.maksud,
        dasar: suratPerintah.dasar,
        tempat_berangkat: suratPerintah.tempat_berangkat,
        tempat_tujuan: suratPerintah.tempat_tujuan,
        tanggal_berangkat: suratPerintah.tanggal_berangkat,
        tanggal_kembali: suratPerintah.tanggal_kembali,
        lama_perjalanan: suratPerintah.lama_perjalanan,
        jenis_angkutan: suratPerintah.jenis_angkutan,
        pejabat_penandatangan_id: suratPerintah.pejabat_penandatangan_id,
        peserta: suratPerintah.peserta_perjalanan.map(p => ({
            pegawai_id: p.pegawai.id,
            peran: p.peran
        }))
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('surat-perintah.update', suratPerintah.id));
    };

    const addPeserta = () => {
        setData('peserta', [...data.peserta, { pegawai_id: 0, peran: 'peserta' }]);
    };

    const removePeserta = (index: number) => {
        const newPeserta = data.peserta.filter((_, i) => i !== index);
        setData('peserta', newPeserta);
    };

    const updatePeserta = (index: number, field: 'pegawai_id' | 'peran', value: number | string) => {
        const newPeserta = [...data.peserta];
        newPeserta[index] = { ...newPeserta[index], [field]: value };
        setData('peserta', newPeserta);
    };

    return (
        <AppLayout>
            <Head title={`Edit Surat Perintah - ${suratPerintah.nomor_surat}`} />

            <div className="space-y-6 px-6 py-6">
                <Heading title="Edit Surat Perintah" subtitle={suratPerintah.nomor_surat} />

                <Separator />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Informasi Surat</h3>

                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="nomor_surat">Nomor Surat</Label>
                                    <Input
                                        id="nomor_surat"
                                        value={data.nomor_surat}
                                        onChange={e => setData('nomor_surat', e.target.value)}
                                        error={errors.nomor_surat}
                                    />
                                    <InputError message={errors.nomor_surat} />
                                </div>

                                <div>
                                    <Label htmlFor="maksud">Maksud</Label>
                                    <Input
                                        id="maksud"
                                        value={data.maksud}
                                        onChange={e => setData('maksud', e.target.value)}
                                        error={errors.maksud}
                                    />
                                    <InputError message={errors.maksud} />
                                </div>

                                <div>
                                    <Label htmlFor="dasar">Dasar</Label>
                                    <Input
                                        id="dasar"
                                        value={data.dasar}
                                        onChange={e => setData('dasar', e.target.value)}
                                        error={errors.dasar}
                                    />
                                    <InputError message={errors.dasar} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Perjalanan</h3>

                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="tempat_berangkat">Tempat Berangkat</Label>
                                    <Input
                                        id="tempat_berangkat"
                                        value={data.tempat_berangkat}
                                        onChange={e => setData('tempat_berangkat', e.target.value)}
                                        error={errors.tempat_berangkat}
                                    />
                                    <InputError message={errors.tempat_berangkat} />
                                </div>

                                <div>
                                    <Label htmlFor="tempat_tujuan">Tempat Tujuan</Label>
                                    <Input
                                        id="tempat_tujuan"
                                        value={data.tempat_tujuan}
                                        onChange={e => setData('tempat_tujuan', e.target.value)}
                                        error={errors.tempat_tujuan}
                                    />
                                    <InputError message={errors.tempat_tujuan} />
                                </div>

                                <div>
                                    <Label htmlFor="tanggal_berangkat">Tanggal Berangkat</Label>
                                    <Input
                                        id="tanggal_berangkat"
                                        type="date"
                                        value={data.tanggal_berangkat}
                                        onChange={e => setData('tanggal_berangkat', e.target.value)}
                                        error={errors.tanggal_berangkat}
                                    />
                                    <InputError message={errors.tanggal_berangkat} />
                                </div>

                                <div>
                                    <Label htmlFor="tanggal_kembali">Tanggal Kembali</Label>
                                    <Input
                                        id="tanggal_kembali"
                                        type="date"
                                        value={data.tanggal_kembali}
                                        onChange={e => setData('tanggal_kembali', e.target.value)}
                                        error={errors.tanggal_kembali}
                                    />
                                    <InputError message={errors.tanggal_kembali} />
                                </div>

                                <div>
                                    <Label htmlFor="lama_perjalanan">Lama Perjalanan (hari)</Label>
                                    <Input
                                        id="lama_perjalanan"
                                        type="number"
                                        value={data.lama_perjalanan}
                                        onChange={e => setData('lama_perjalanan', parseInt(e.target.value) || 0)}
                                        error={errors.lama_perjalanan}
                                    />
                                    <InputError message={errors.lama_perjalanan} />
                                </div>

                                <div>
                                    <Label htmlFor="jenis_angkutan">Jenis Angkutan</Label>
                                    <Input
                                        id="jenis_angkutan"
                                        value={data.jenis_angkutan}
                                        onChange={e => setData('jenis_angkutan', e.target.value)}
                                        error={errors.jenis_angkutan}
                                    />
                                    <InputError message={errors.jenis_angkutan} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Pejabat Penandatangan</h3>

                        <div>
                            <Label htmlFor="pejabat_penandatangan_id">Pejabat Penandatangan</Label>
                            <select
                                id="pejabat_penandatangan_id"
                                value={data.pejabat_penandatangan_id || ''}
                                onChange={e => setData('pejabat_penandatangan_id', e.target.value ? parseInt(e.target.value) : null)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">Pilih Pejabat</option>
                                {pegawais.map(pegawai => (
                                    <option key={pegawai.id} value={pegawai.id}>
                                        {pegawai.nama} - {pegawai.nip}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.pejabat_penandatangan_id} />
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Peserta Perjalanan</h3>

                            <Button
                                type="button"
                                onClick={addPeserta}
                                variant="outline"
                            >
                                + Tambah Peserta
                            </Button>
                        </div>

                        {data.peserta.length > 0 ? (
                            <div className="grid gap-4">
                                {data.peserta.map((peserta, index) => (
                                    <div key={index} className="rounded-lg border p-4 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium">Peserta #{index + 1}</h4>

                                            <Button
                                                type="button"
                                                onClick={() => removePeserta(index)}
                                                variant="destructive"
                                                size="sm"
                                            >
                                                Hapus
                                            </Button>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div>
                                                <Label htmlFor={`pegawai_id_${index}`}>Pegawai</Label>
                                                <select
                                                    id={`pegawai_id_${index}`}
                                                    value={peserta.pegawai_id}
                                                    onChange={e => updatePeserta(index, 'pegawai_id', parseInt(e.target.value))}
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                                >
                                                    <option value="0">Pilih Pegawai</option>
                                                    {pegawais.map(pegawai => (
                                                        <option key={pegawai.id} value={pegawai.id}>
                                                            {pegawai.nama} - {pegawai.nip}
                                                        </option>
                                                    ))}
                                                </select>
                                                <InputError message={errors[`peserta.${index}.pegawai_id`]} />
                                            </div>

                                            <div>
                                                <Label htmlFor={`peran_${index}`}>Peran</Label>
                                                <select
                                                    id={`peran_${index}`}
                                                    value={peserta.peran}
                                                    onChange={e => updatePeserta(index, 'peran', e.target.value)}
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                                >
                                                    <option value="peserta">Peserta</option>
                                                    <option value="ketua_rombongan">Ketua Rombongan</option>
                                                    <option value="pengurus_administrasi">Pengurus Administrasi</option>
                                                </select>
                                                <InputError message={errors[`peserta.${index}.peran`]} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground">Belum ada peserta perjalanan.</p>
                        )}
                    </div>

                    <Separator />

                    <div className="flex gap-4">
                        <Button
                            type="submit"
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <Spinner className="mr-2 h-4 w-4" />
                                    Menyimpan...
                                </>
                            ) : (
                                'Simpan Perubahan'
                            )}
                        </Button>

                        <Link
                            href={route('surat-perintah.show', suratPerintah.id)}
                            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                        >
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
```

**Step 2: Verifikasi file dibuat**

Run: `ls -la resources/js/pages/SuratPerintah/Edit.tsx`
Expected: File exists

**Step 3: Update SuratPerintahController untuk pass pegawais data ke edit**

Baca file controller: `app/Http/Controllers/SuratPerintahController.php`

**Step 4: Edit method edit() untuk include pegawais**

Run: Edit file `app/Http/Controllers/SuratPerintahController.php` pada baris 59-66

Ganti method `edit()` menjadi:

```php
public function edit(SuratPerintah $suratPerintah): Response
{
    $suratPerintah->load(['pejabatPenandatangan', 'pesertaPerjalanan.pegawai']);

    return Inertia::render('SuratPerintah/Edit', [
        'suratPerintah' => $suratPerintah,
        'pegawais' => \App\Models\Pegawai::all(['id', 'nama', 'nip']),
    ]);
}
```

**Step 5: Jalankan rebuild Vite**

Run: `npm run build`
Expected: Build completes without errors

**Step 6: Commit**

```bash
git add resources/js/pages/SuratPerintah/Edit.tsx app/Http/Controllers/SuratPerintahController.php
git commit -m "feat: add Edit page for Surat Perintah with pegawais data"
```

---

## Task 3: Perbaiki test yang gagal - Tambahkan route dashboard

**Files:**
- Modify: `routes/web.php`
- Modify: `tests/Feature/Auth/AuthenticationTest.php`
- Modify: `tests/Feature/Auth/EmailVerificationTest.php`
- Modify: `tests/Feature/Auth/RegistrationTest.php`

**Step 1: Tambahkan route dashboard**

Baca file: `routes/web.php`

Tambahkan baris berikut setelah baris pertama (sebelum resource routes):

```php
Route::get('/dashboard', function () {
    return redirect()->route('surat-perintah.index');
})->name('dashboard');
```

**Step 2: Tambahkan route home (untuk kompatibilitas)**

Tambahkan setelah route dashboard:

```php
Route::get('/home', function () {
    return redirect()->route('surat-perintah.index');
})->name('home');
```

**Step 3: Verifikasi route terdaftar**

Run: `php artisan route:list | grep -E "(dashboard|home)"`
Expected: Routes dashboard dan home terdaftar

**Step 4: Jalankan test auth**

Run: `php artisan test --compact tests/Feature/Auth/AuthenticationTest.php`
Expected: Tests pass

**Step 5: Jalankan test email verification**

Run: `php artisan test --compact tests/Feature/Auth/EmailVerificationTest.php`
Expected: Tests pass

**Step 6: Jalankan test registration**

Run: `php artisan test --compact tests/Feature/Auth/RegistrationTest.php`
Expected: Tests pass

**Step 7: Commit**

```bash
git add routes/web.php
git commit -m "fix: add dashboard and home routes for test compatibility"
```

---

## Task 4: Jalankan seluruh test suite

**Files:**
- Test: Semua test files

**Step 1: Jalankan seluruh test suite**

Run: `php artisan test --compact`
Expected: All tests pass

**Step 2: Cek hasil test**

Pastikan tidak ada test yang gagal. Jika ada, catat error yang terjadi.

**Step 3: Jika ada test gagal, investigasi**

Run test spesifik yang gagal dengan verbose:
`php artisan test --compact --filter=nama_test_yang_gagal`

---

## Task 5: Verifikasi fitur secara manual (opsional)

**Files:**
- N/A

**Step 1: Start development server**

Run: `composer run dev` (atau buka terminal terpisah dan jalankan `php artisan serve` + `npm run dev`)

**Step 2: Akses aplikasi**

Buka browser dan akses:
- `http://localhost:8000/surat-perintah` - Index page
- Klik salah satu surat perintah - Show page
- Klik tombol Edit - Edit page
- Coba submit form edit

**Step 3: Verifikasi semua fitur bekerja**

Pastikan:
- Show page menampilkan detail surat perintah dengan lengkap
- Edit page menampilkan form dengan data yang benar
- Submit edit berhasil dan redirect ke show page
- Tombol cetak berfungsi

---

## Task 6: Code formatting dan final check

**Files:**
- All modified files

**Step 1: Jalankan Pint untuk format PHP**

Run: `vendor/bin/pint --dirty`
Expected: Code formatted

**Step 2: Jalankan Prettier untuk format frontend**

Run: `npm run format`
Expected: Code formatted

**Step 3: Run final test**

Run: `php artisan test --compact`
Expected: All tests pass

**Step 4: Commit formatting changes**

```bash
git add .
git commit -m "style: apply code formatting"
```

---

## Task 7: Update type definitions (jika perlu)

**Files:**
- Check: `resources/js/pages/types/surat-perintah.ts`

**Step 1: Cek apakah type definitions sudah lengkap**

Baca file: `resources/js/pages/types/surat-perintah.ts`

Pastikan type definitions mencakup semua field yang dibutuhkan Show dan Edit page.

**Step 2: Jika ada field yang kurang, tambahkan**

Contoh update jika perlu:

```typescript
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
    jenis_angkutan: string;
    pejabat_penandatangan_id: number | null;
    status: string;
    created_at: string;
    updated_at: string;
}
```

**Step 3: Commit jika ada perubahan**

```bash
git add resources/js/pages/types/surat-perintah.ts
git commit -m "feat: update SuratPerintah type definitions"
```
