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
