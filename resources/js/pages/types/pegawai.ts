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
