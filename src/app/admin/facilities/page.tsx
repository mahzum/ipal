'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, MapPin, Eye, AlertCircle } from 'lucide-react';
import { WastewaterFacility } from '@/types';

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<WastewaterFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [facilityToDelete, setFacilityToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchFacilities();
  }, [currentPage, searchTerm]);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/facilities?page=${currentPage}&limit=10&search=${encodeURIComponent(searchTerm)}`
      );
      if (response.ok) {
        const data = await response.json();
        setFacilities(data.data);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching facilities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/facilities/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchFacilities();
        setShowDeleteModal(false);
        setFacilityToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting facility:', error);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    if (status.includes('Optimal')) {
      return 'bg-green-100 text-green-800';
    }
    return 'bg-red-100 text-red-800';
  };

  const getEffluentBadgeColor = (status: string) => {
    switch (status) {
      case 'Sudah dilakukan':
        return 'bg-green-100 text-green-800';
      case 'Dalam proses':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Data Pengelolaan Air Limbah
          </h2>
          <p className="text-regular text-body dark:text-bodydark">
            Kelola data fasilitas IPALD (Instalasi Pengolahan Air Limbah Domestik)
          </p>
        </div>
        <div className="flex flex-col gap-4 2xsm:flex-row 2xsm:gap-7">
          <Link
            href="/admin/facilities/create"
            className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Fasilitas
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari berdasarkan nama, kelurahan, atau lembaga pengelola..."
            className="w-full rounded-lg border-[1.5px] border-gray-300 bg-white py-3 px-5 pl-13 text-gray-900 placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <span className="absolute left-4 top-4">
            <Search className="h-4 w-4 text-body" />
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          </div>
        ) : (
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Nama Fasilitas
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Kelurahan/Desa
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Kapasitas
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Status Operasional
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Pengecekan Effluent
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Lembaga Pengelola
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {facilities.map((facility, key) => (
                <tr key={facility.id}>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {facility.nama}
                    </h5>
                    {facility.latitude && facility.longitude && (
                      <p className="text-sm flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1 text-meta-5" />
                        <span className="text-meta-5">{facility.latitude}, {facility.longitude}</span>
                      </p>
                    )}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {facility.kelurahan_desa}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      Desain: {facility.kapasitas_desain} SR
                    </p>
                    <p className="text-sm text-meta-3">
                      Terpasang: {facility.kapasitas_terpasang} SR
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p
                      className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                        facility.kondisi_status_operasional.includes('Optimal')
                          ? 'bg-success text-success'
                          : 'bg-danger text-danger'
                      }`}
                    >
                      {facility.kondisi_status_operasional}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p
                      className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                        facility.pengecekan_effluent === 'Sudah dilakukan'
                          ? 'bg-success text-success'
                          : facility.pengecekan_effluent === 'Dalam proses'
                          ? 'bg-warning text-warning'
                          : 'bg-danger text-danger'
                      }`}
                    >
                      {facility.pengecekan_effluent}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {facility.lembaga_pengelola}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/facilities/${facility.id}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/facilities/${facility.id}/edit`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => {
                          setFacilityToDelete(facility.id!);
                          setShowDeleteModal(true);
                        }}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Halaman <span className="font-medium">{currentPage}</span> dari{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Konfirmasi Hapus</h3>
                </div>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Apakah Anda yakin ingin menghapus fasilitas ini? Tindakan ini tidak dapat dibatalkan dan semua data terkait akan hilang permanen.
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setFacilityToDelete(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDelete(facilityToDelete!)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Hapus Fasilitas
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
