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
