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
