'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { WastewaterFacility } from '@/types';

export default function CreateFacilityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<WastewaterFacility>>({
    nama: '',
    kelurahan_desa: '',
    kapasitas_desain: 0,
    kapasitas_terpasang: 0,
    tahun_dibangun_rehabilitasi: undefined,
    kondisi_status_operasional: 'Bangunan Baik, Optimal',
    lembaga_pengelola: '',
    pengecekan_effluent: 'Belum dilakukan',
    latitude: undefined,
    longitude: undefined,
    alamat_lengkap: '',
    keterangan: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/facilities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/facilities');
      } else {
        alert('Gagal menyimpan data fasilitas');
      }
    } catch (error) {
      console.error('Error creating facility:', error);
      alert('Terjadi kesalahan saat menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? undefined : value
    }));
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/facilities"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Kembali ke Daftar Fasilitas
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Tambah Fasilitas IPALD Baru</h1>
        <p className="mt-2 text-sm text-gray-700">
          Masukkan informasi lengkap fasilitas IPALD yang akan ditambahkan
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Nama Fasilitas */}
            <div className="sm:col-span-2">
              <label htmlFor="nama" className="block text-sm font-bold text-black">
                Nama Fasilitas *
              </label>
              <input
                type="text"
                name="nama"
                id="nama"
                required
                value={formData.nama}
                onChange={handleInputChange}
                className="mt-2 block w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg shadow-sm text-black font-semibold placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Contoh: IPALD Rusunawa Tobuuha"
              />
            </div>

            {/* Kelurahan/Desa */}
            <div>
              <label htmlFor="kelurahan_desa" className="block text-sm font-bold text-black mb-2">
                Kelurahan/Desa *
              </label>
              <input
                type="text"
                name="kelurahan_desa"
                id="kelurahan_desa"
                required
                value={formData.kelurahan_desa}
                onChange={handleInputChange}
                className="mt-2 block w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg shadow-sm text-black font-semibold placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Contoh: Kelurahan Tobuha"
              />
            </div>

            {/* Lembaga Pengelola */}
            <div>
              <label htmlFor="lembaga_pengelola" className="block text-sm font-bold text-black mb-2">
                Lembaga Pengelola *
              </label>
              <input
                type="text"
                name="lembaga_pengelola"
                id="lembaga_pengelola"
                required
                value={formData.lembaga_pengelola}
                onChange={handleInputChange}
                className="mt-2 block w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg shadow-sm text-black font-semibold placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Contoh: BLUD"
              />
            </div>

            {/* Kapasitas Desain */}
            <div>
              <label htmlFor="kapasitas_desain" className="block text-sm font-bold text-black mb-2">
                Kapasitas Desain (SR) *
              </label>
              <input
                type="number"
                name="kapasitas_desain"
                id="kapasitas_desain"
                required
                min="0"
                value={formData.kapasitas_desain}
                onChange={handleInputChange}
                className="mt-2 block w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg shadow-sm text-black font-semibold placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Kapasitas Terpasang */}
            <div>
              <label htmlFor="kapasitas_terpasang" className="block text-sm font-bold text-black mb-2">
                Kapasitas Terpasang (SR) *
              </label>
              <input
                type="number"
                name="kapasitas_terpasang"
                id="kapasitas_terpasang"
                required
                min="0"
                value={formData.kapasitas_terpasang}
                onChange={handleInputChange}
                className="mt-2 block w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg shadow-sm text-black font-semibold placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Tahun Dibangun/Rehabilitasi */}
            <div>
              <label htmlFor="tahun_dibangun_rehabilitasi" className="block text-sm font-bold text-black mb-2">
                Tahun Dibangun/Rehabilitasi
              </label>
              <input
                type="number"
                name="tahun_dibangun_rehabilitasi"
                id="tahun_dibangun_rehabilitasi"
                min="1900"
                max={new Date().getFullYear()}
                value={formData.tahun_dibangun_rehabilitasi || ''}
                onChange={handleInputChange}
                className="mt-2 block w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg shadow-sm text-black font-semibold placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Kondisi dan Status Operasional */}
            <div>
              <label htmlFor="kondisi_status_operasional" className="block text-sm font-bold text-black mb-2">
                Kondisi dan Status Operasional *
              </label>
              <select
                name="kondisi_status_operasional"
                id="kondisi_status_operasional"
                required
                value={formData.kondisi_status_operasional}
                onChange={handleInputChange}
                className="mt-2 block w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg shadow-sm text-black font-semibold placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="Bangunan Baik, Optimal">Bangunan Baik, Optimal</option>
                <option value="Bangunan Baik, Tidak Optimal">Bangunan Baik, Tidak Optimal</option>
                <option value="Bangunan Rusak, Optimal">Bangunan Rusak, Optimal</option>
                <option value="Bangunan Rusak, Tidak Optimal">Bangunan Rusak, Tidak Optimal</option>
              </select>
            </div>

            {/* Pengecekan Effluent */}
            <div>
              <label htmlFor="pengecekan_effluent" className="block text-sm font-bold text-black mb-2">
                Status Pengecekan Effluent *
              </label>
              <select
                name="pengecekan_effluent"
                id="pengecekan_effluent"
                required
                value={formData.pengecekan_effluent}
                onChange={handleInputChange}
                className="mt-2 block w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg shadow-sm text-black font-semibold placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="Belum dilakukan">Belum dilakukan</option>
                <option value="Dalam proses">Dalam proses</option>
                <option value="Sudah dilakukan">Sudah dilakukan</option>
              </select>
            </div>

            {/* Latitude */}
            <div>
              <label htmlFor="latitude" className="block text-sm font-bold text-black mb-2">
                Latitude
              </label>
              <input
                type="number"
                name="latitude"
                id="latitude"
                step="any"
                value={formData.latitude || ''}
                onChange={handleInputChange}
                className="mt-2 block w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg shadow-sm text-black font-semibold placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Contoh: -3.9778"
              />
            </div>

            {/* Longitude */}
            <div>
              <label htmlFor="longitude" className="block text-sm font-bold text-black mb-2">
                Longitude
              </label>
              <input
                type="number"
                name="longitude"
                id="longitude"
                step="any"
                value={formData.longitude || ''}
                onChange={handleInputChange}
                className="mt-2 block w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg shadow-sm text-black font-semibold placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Contoh: 122.5194"
              />
            </div>

            {/* Alamat Lengkap */}
            <div className="sm:col-span-2">
              <label htmlFor="alamat_lengkap" className="block text-sm font-bold text-black mb-2">
                Alamat Lengkap
              </label>
              <textarea
                name="alamat_lengkap"
                id="alamat_lengkap"
                rows={3}
                value={formData.alamat_lengkap || ''}
                onChange={handleInputChange}
                className="mt-2 block w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg shadow-sm text-black font-semibold placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Masukkan alamat lengkap fasilitas"
              />
            </div>

            {/* Keterangan */}
            <div className="sm:col-span-2">
              <label htmlFor="keterangan" className="block text-sm font-bold text-black mb-2">
                Keterangan
              </label>
              <textarea
                name="keterangan"
                id="keterangan"
                rows={3}
                value={formData.keterangan || ''}
                onChange={handleInputChange}
                className="mt-2 block w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg shadow-sm text-black font-semibold placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Keterangan tambahan (opsional)"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Link
              href="/admin/facilities"
              className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Menyimpan...
                </>
              ) : (
                'Simpan Fasilitas'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
