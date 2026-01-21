# Product Requirement Document (PRD) - Aplikasi SPPD

## 1. Pendahuluan

### 1.1. Latar Belakang
Saat ini, proses pembuatan Surat Perintah Perjalanan Dinas (SPPD) di lingkungan kerja (contoh: Pengadilan Agama Penajam) masih dilakukan secara manual menggunakan Microsoft Excel. Proses ini memiliki beberapa kelemahan:
- Rentan kesalahan input (human error).
- Duplikasi data pegawai yang berulang.
- Kesulitan dalam pencarian arsip SPPD lama.
- Format yang tidak konsisten jika file master Excel berubah.

### 1.2. Tujuan
Mengembangkan aplikasi berbasis web untuk mendigitalkan, mengotomatisasi, dan mempusatkan pengelolaan data SPPD guna meningkatkan efisiensi, akurasi, dan kemudahan administrasi.

### 1.3. Ruang Lingkup
- Manajemen Data Pegawai (Master Data).
- Pembuatan dan Pengelolaan Surat Perintah Tugas (SPT) dan SPPD.
- Pencetakan Dokumen (Surat Tugas, SPPD Lembar 1 & 2) sesuai format resmi.
- Pelaporan (List perjalanan dinas).

---

## 2. Arsitektur Sistem

### 2.1. Tech Stack
- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: React (TypeScript) dengan Inertia.js v2
- **Database**: SQLite (Development) / MySQL/PostgreSQL (Production)
- **Styling**: Tailwind CSS
- **Authentication**: Laravel Fortify
- **State Management**: React Hooks / Inertia Form Helpers

### 2.2. Struktur Database (Schema Design)

#### a. Tabel `pegawais`
Menyimpan data master pegawai.
| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | BigInteger (PK) | |
| `nip` | String | Unique, Nomor Induk Pegawai |
| `nama` | String | Nama lengkap dengan gelar |
| `jabatan` | String | Jabatan saat ini |
| `unit_kerja` | String | Unit kerja pegawai |
| `golongan` | String | Contoh: "IV/a" |
| `pangkat` | String | Mapping otomatis dari golongan (opsional) |
| `tmt` | Date | Terhitung Mulai Tanggal |

#### b. Tabel `surat_perintahs`
Menyimpan header transaksi perjalanan dinas.
| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | BigInteger (PK) | |
| `nomor_surat` | String | Nomor surat resmi |
| `maksud` | Text | Tujuan/maksud perjalanan |
| `dasar` | Text | Dasar hukum/surat penunjukan |
| `tempat_berangkat` | String | Default: Kantor saat ini |
| `tempat_tujuan` | String | Kota/Lokasi tujuan |
| `tanggal_berangkat` | Date | |
| `tanggal_kembali` | Date | |
| `lama_perjalanan` | Integer | Durasi (hari) |
| `jenis_angkatan` | Enum | Darat, Laut, Udara, Kendaraan Dinas |
| `pejabat_penandatangan_id` | FK | Relasi ke tabel pegawai (yang ttd) |
| `status` | Enum | Draft, Final |

#### c. Tabel `peserta_perjalanans`
Detail pegawai yang berangkat dalam satu surat perintah.
| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | BigInteger (PK) | |
| `surat_perintah_id` | FK | Relasi ke Surat Perintah |
| `pegawai_id` | FK | Relasi ke Pegawai |
| `peran` | Enum | 'Ketua Tim', 'Anggota' |

---

## 3. Fitur Utama (Functional Requirements)

### 3.1. Modul Pegawai
- **Import Data**: Sistem harus dapat membaca file JSON (`data_pegawai.json`) untuk inisialisasi data.
- **Manajemen**: Admin dapat menambah, mengedit, dan menghapus data pegawai.

### 3.2. Modul Transaksi SPPD
- **Input Wizard**: Form bertahap untuk membuat SPPD baru:
  1. Input Detail Surat (Nomor, Maksud, Dasar).
  2. Input Waktu & Tempat (Tgl Berangkat/Kembali, Tujuan, Kendaraan).
  3. Pilih Peserta (Multiple select pegawai).
  4. Pilih Penandatangan.
- **Validasi**: Tanggal kembali tidak boleh sebelum tanggal berangkat.

### 3.3. Modul Output & Cetak
Sistem harus menghasilkan tampilan "Print Friendly" (CSS Print Media) untuk:
- **Surat Tugas**: Format surat resmi dengan kop surat.
- **SPPD Lembar 1**: Halaman muka SPPD (Identitas, Tujuan, dll).
- **SPPD Lembar 2**: Halaman belakang (Validasi kedatangan/kepulangan).

---

## 4. Desain Antarmuka (UI/UX)

### 4.1. Komponen Kunci
- **Dashboard**: Ringkasan jumlah perjalanan bulan ini.
- **EmployeeSelector**: Dropdown dengan pencarian (Searchable Select) untuk memilih NIP/Nama.
- **DateRangePicker**: Input tanggal mulai dan selesai yang otomatis menghitung durasi hari.

### 4.2. Accessibility & Responsiveness
- Aplikasi diutamakan untuk penggunaan Desktop (Admin), namun tetap responsif di Mobile untuk melihat status.

---

## 5. Rencana Implementasi

### Phase 1: Foundation
1. Setup Project Laravel 12 + Inertia React.
2. Setup Database Migration (`pegawais`, `surat_perintahs`, dll).
3. Buat Seeder untuk import `data_pegawai.json`.

### Phase 2: Core Features
1. CRUD Master Pegawai.
2. Form Transaksi SPPD (Create & Update).
3. Logic perhitungan durasi tanggal.

### Phase 3: Reporting & Output
1. Layout Cetak Surat Tugas.
2. Layout Cetak SPPD.
3. Finalisasi & Testing.
