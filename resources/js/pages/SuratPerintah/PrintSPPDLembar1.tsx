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
