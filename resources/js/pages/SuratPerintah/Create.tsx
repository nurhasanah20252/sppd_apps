// resources/js/Pages/SuratPerintah/Create.tsx
import { useState, useEffect } from 'react';
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

  // Fetch pegawais on mount - FIXED: Using useEffect instead of useState
  useEffect(() => {
    fetch('/api/pegawais')
      .then(res => res.json())
      .then(data => setPegawais(data));
  }, []);

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
                  value={data.searchTerm || ''}
                  onChange={(e) => setData('searchTerm', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Daftar pegawai yang bisa dipilih */}
              {data.searchTerm && (
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg max-h-48 overflow-y-auto">
                  {pegawais
                    .filter(pg =>
                      pg.nama.toLowerCase().includes((data.searchTerm || '').toLowerCase()) ||
                      pg.nip.includes(data.searchTerm || '')
                    )
                    .filter(pg => !data.peserta.find(p => p.pegawai_id === pg.id))
                    .slice(0, 10)
                    .map((pg) => (
                      <div
                        key={pg.id}
                        onClick={() => addPeserta(pg.id)}
                        className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-0"
                      >
                        <p className="font-medium text-gray-900 dark:text-white">{pg.nama}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{pg.nip}</p>
                      </div>
                    ))}
                  {pegawais.filter(pg =>
                    pg.nama.toLowerCase().includes((data.searchTerm || '').toLowerCase()) ||
                    pg.nip.includes(data.searchTerm || '')
                  ).filter(pg => !data.peserta.find(p => p.pegawai_id === pg.id)).length === 0 && (
                    <p className="p-3 text-sm text-gray-500 dark:text-gray-400 text-center">Tidak ada pegawai ditemukan</p>
                  )}
                </div>
              )}

              {/* Quick add buttons jika belum ada pencarian */}
              {!data.searchTerm && pegawais.slice(0, 5).map((pg) => {
                const isSelected = data.peserta.find(p => p.pegawai_id === pg.id);
                return (
                  <button
                    key={pg.id}
                    type="button"
                    onClick={() => !isSelected && addPeserta(pg.id)}
                    disabled={!!isSelected}
                    className="w-full text-left p-3 mb-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <p className="font-medium text-gray-900 dark:text-white">{pg.nama}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{pg.nip}</p>
                  </button>
                );
              })}

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
