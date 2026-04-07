'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2, MapPin, Calendar, Users, Droplets, AlertCircle } from 'lucide-react';
import { WastewaterFacility } from '@/types';

export default function FacilityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [facility, setFacility] = useState<WastewaterFacility | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
        setFacility(data.data);
      } else {
        console.error('Failed to fetch facility');
      }
    } catch (error) {
      console.error('Error fetching facility:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/facilities/${params.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        router.push('/admin/facilities');
      } else {
        console.error('Failed to delete facility');
      }
    } catch (error) {
      console.error('Error deleting facility:', error);
    }
  };

  const getStatusColor = (status: string) => {
    if (status.includes('Optimal')) {
      return 'text-green-800 bg-green-100 border-green-200';
    }
    return 'text-red-800 bg-red-100 border-red-200';
  };

  const getEffluentColor = (status: string) => {
    switch (status) {
      case 'Sudah dilakukan':
        return 'text-green-800 bg-green-100 border-green-200';
      case 'Dalam proses':
        return 'text-yellow-800 bg-yellow-100 border-yellow-200';
      default:
        return 'text-red-800 bg-red-100 border-red-200';
    }
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/facilities"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{facility.nama}</h1>
              <p className="text-sm text-gray-600">Detail Fasilitas IPALD</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href={`/admin/facilities/${facility.id}/edit`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Dasar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Fasilitas</label>
                <p className="text-sm font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg">{facility.nama}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kelurahan/Desa</label>
                <p className="text-sm font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg">{facility.kelurahan_desa}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lembaga Pengelola</label>
                <p className="text-sm font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg">{facility.lembaga_pengelola}</p>
              </div>
              {facility.tahun_dibangun_rehabilitasi && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Dibangun/Rehabilitasi</label>
                  <p className="text-sm font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg">{facility.tahun_dibangun_rehabilitasi}</p>
                </div>
              )}
            </div>
            
            {facility.alamat_lengkap && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                <p className="text-sm font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg">{facility.alamat_lengkap}</p>
              </div>
            )}

            {facility.keterangan && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                <p className="text-sm font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg">{facility.keterangan}</p>
              </div>
            )}
          </div>

          {/* Technical Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Teknis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kapasitas Desain</label>
                <p className="text-sm font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg">{facility.kapasitas_desain} SR</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kapasitas Terpasang</label>
                <p className="text-sm font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg">{facility.kapasitas_terpasang} SR</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kondisi & Status Operasional</label>
                <span className={`inline-flex px-3 py-2 text-xs font-bold rounded-full border ${getStatusColor(facility.kondisi_status_operasional)}`}>
                  {facility.kondisi_status_operasional}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pengecekan Effluent</label>
                <span className={`inline-flex px-3 py-2 text-xs font-bold rounded-full border ${getEffluentColor(facility.pengecekan_effluent)}`}>
                  {facility.pengecekan_effluent}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Location Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Lokasi
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                <p className="text-sm font-semibold text-gray-900 bg-gray-50 p-2 rounded">{facility.latitude}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                <p className="text-sm font-semibold text-gray-900 bg-gray-50 p-2 rounded">{facility.longitude}</p>
              </div>
              <Link
                href={`/map?facility=${facility.id}`}
                className="inline-flex items-center w-full justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Lihat di Peta
              </Link>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Droplets className="h-5 w-5 mr-2" />
              Statistik
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Efisiensi Kapasitas</span>
                <span className="text-sm font-bold text-gray-900">
                  {facility.kapasitas_desain > 0 ? Math.round((facility.kapasitas_terpasang / facility.kapasitas_desain) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Status Operasional</span>
                <span className={`text-xs font-bold px-2 py-1 rounded ${facility.kondisi_status_operasional.includes('Optimal') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {facility.kondisi_status_operasional.includes('Optimal') ? 'Optimal' : 'Tidak Optimal'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Pengecekan Effluent</span>
                <span className={`text-xs font-bold px-2 py-1 rounded ${facility.pengecekan_effluent === 'Sudah dilakukan' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {facility.pengecekan_effluent === 'Sudah dilakukan' ? 'Selesai' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Metadata Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Metadata
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dibuat</label>
                <p className="text-sm font-semibold text-gray-900">{new Date(facility.created_at).toLocaleDateString('id-ID')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Terakhir Diupdate</label>
                <p className="text-sm font-semibold text-gray-900">{new Date(facility.updated_at).toLocaleDateString('id-ID')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Konfirmasi Hapus</h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus fasilitas <strong>{facility.nama}</strong>? 
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
