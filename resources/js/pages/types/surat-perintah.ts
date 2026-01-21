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
