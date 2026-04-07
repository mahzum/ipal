'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { WastewaterFacility } from '@/types';

export default function EditFacilityPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [facility, setFacility] = useState<WastewaterFacility | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    kelurahan_desa: '',
    kapasitas_desain: 0,
    kapasitas_terpasang: 0,
    tahun_dibangun_rehabilitasi: '',
    kondisi_status_operasional: '',
    lembaga_pengelola: '',
    pengecekan_effluent: '',
    latitude: '',
    longitude: '',
    alamat_lengkap: '',
    keterangan: ''
  });

  useEffect(() => {
    if (params.id) {
      fetchFacility();
    }
  }, [params.id]);

  const fetchFacility = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/facilities/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        const facilityData = data.data;
        setFacility(facilityData);
        setFormData({
          nama: facilityData.nama || '',
          kelurahan_desa: facilityData.kelurahan_desa || '',
          kapasitas_desain: facilityData.kapasitas_desain || 0,
          kapasitas_terpasang: facilityData.kapasitas_terpasang || 0,
          tahun_dibangun_rehabilitasi: facilityData.tahun_dibangun_rehabilitasi || '',
          kondisi_status_operasional: facilityData.kondisi_status_operasional || '',
          lembaga_pengelola: facilityData.lembaga_pengelola || '',
          pengecekan_effluent: facilityData.pengecekan_effluent || '',
          latitude: facilityData.latitude || '',
          longitude: facilityData.longitude || '',
          alamat_lengkap: facilityData.alamat_lengkap || '',
          keterangan: facilityData.keterangan || ''
        });
      } else {
        console.error('Failed to fetch facility');
      }
    } catch (error) {
      console.error('Error fetching facility:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/facilities/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push(`/admin/facilities/${params.id}`);
      } else {
        console.error('Failed to update facility');
      }
    } catch (error) {
      console.error('Error updating facility:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'kapasitas_desain' || name === 'kapasitas_terpasang' ? 
        parseInt(value) || 0 : value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Fasilitas Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-4">Fasilitas dengan ID tersebut tidak ada dalam database.</p>
          <Link
            href="/admin/facilities"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar Fasilitas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <Link
            href={`/admin/facilities/${params.id}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Fasilitas</h1>
            <p className="text-sm text-gray-600">Edit informasi fasilitas IPALD</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Dasar</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="nama" className="block text-sm font-bold text-black mb-2">
                  Nama Fasilitas *
                </label>
                <input
                  type="text"
                  id="nama"
                  name="nama"
                  required
                  value={formData.nama}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg text-black font-semibold placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  placeholder="Masukkan nama fasilitas"
                />
              </div>

              <div>
                <label htmlFor="kelurahan_desa" className="block text-sm font-bold text-black mb-2">
                  Kelurahan/Desa *
                </label>
                <input
                  type="text"
                  id="kelurahan_desa"
                  name="kelurahan_desa"
                  required
                  value={formData.kelurahan_desa}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg text-black font-semibold placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  placeholder="Masukkan kelurahan/desa"
                />
              </div>

              <div>
                <label htmlFor="lembaga_pengelola" className="block text-sm font-bold text-black mb-2">
                  Lembaga Pengelola *
                </label>
                <select
                  id="lembaga_pengelola"
                  name="lembaga_pengelola"
                  required
                  value={formData.lembaga_pengelola}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg text-black font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                >
                  <option value="">Pilih Lembaga Pengelola</option>
                  <option value="UPTD">UPTD</option>
                  <option value="KSM">KSM</option>
                  <option value="Swasta">Swasta</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label htmlFor="tahun_dibangun_rehabilitasi" className="block text-sm font-bold text-black mb-2">
                  Tahun Dibangun/Rehabilitasi
                </label>
                <input
                  type="number"
                  id="tahun_dibangun_rehabilitasi"
                  name="tahun_dibangun_rehabilitasi"
                  value={formData.tahun_dibangun_rehabilitasi}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg text-black font-semibold placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  placeholder="Contoh: 2020"
                  min="1990"
                  max="2030"
                />
              </div>

              <div>
                <label htmlFor="alamat_lengkap" className="block text-sm font-bold text-black mb-2">
                  Alamat Lengkap
                </label>
                <textarea
                  id="alamat_lengkap"
                  name="alamat_lengkap"
                  rows={3}
                  value={formData.alamat_lengkap}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg text-black font-semibold placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  placeholder="Masukkan alamat lengkap fasilitas"
                />
              </div>
            </div>
          </div>

          {/* Technical Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Teknis</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="kapasitas_desain" className="block text-sm font-bold text-black mb-2">
                    Kapasitas Desain (SR) *
                  </label>
                  <input
                    type="number"
                    id="kapasitas_desain"
                    name="kapasitas_desain"
                    required
                    value={formData.kapasitas_desain}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg text-black font-semibold placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label htmlFor="kapasitas_terpasang" className="block text-sm font-bold text-black mb-2">
                    Kapasitas Terpasang (SR) *
                  </label>
                  <input
                    type="number"
                    id="kapasitas_terpasang"
                    name="kapasitas_terpasang"
                    required
                    value={formData.kapasitas_terpasang}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg text-black font-semibold placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="kondisi_status_operasional" className="block text-sm font-bold text-black mb-2">
                  Kondisi & Status Operasional *
                </label>
                <select
                  id="kondisi_status_operasional"
                  name="kondisi_status_operasional"
                  required
                  value={formData.kondisi_status_operasional}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg text-black font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                >
                  <option value="">Pilih Status</option>
                  <option value="Bangunan Baik, Optimal">Bangunan Baik, Optimal</option>
                  <option value="Bangunan Baik, Tidak Optimal">Bangunan Baik, Tidak Optimal</option>
                  <option value="Bangunan Rusak, Optimal">Bangunan Rusak, Optimal</option>
                  <option value="Bangunan Rusak, Tidak Optimal">Bangunan Rusak, Tidak Optimal</option>
                </select>
              </div>

              <div>
                <label htmlFor="pengecekan_effluent" className="block text-sm font-bold text-black mb-2">
                  Pengecekan Effluent *
                </label>
                <select
                  id="pengecekan_effluent"
                  name="pengecekan_effluent"
                  required
                  value={formData.pengecekan_effluent}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg text-black font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                >
                  <option value="">Pilih Status Pengecekan</option>
                  <option value="Sudah dilakukan">Sudah dilakukan</option>
                  <option value="Dalam proses">Dalam proses</option>
                  <option value="Belum dilakukan">Belum dilakukan</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="latitude" className="block text-sm font-bold text-black mb-2">
                    Latitude
                  </label>
                  <input
                    type="text"
                    id="latitude"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg text-black font-semibold placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    placeholder="Contoh: -5.1234"
                  />
                </div>

                <div>
                  <label htmlFor="longitude" className="block text-sm font-bold text-black mb-2">
                    Longitude
                  </label>
                  <input
                    type="text"
                    id="longitude"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg text-black font-semibold placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    placeholder="Contoh: 122.5678"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="keterangan" className="block text-sm font-bold text-black mb-2">
                  Keterangan
                </label>
                <textarea
                  id="keterangan"
                  name="keterangan"
                  rows={3}
                  value={formData.keterangan}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg text-black font-semibold placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  placeholder="Keterangan tambahan (opsional)"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end space-x-3">
          <Link
            href={`/admin/facilities/${params.id}`}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
