'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, List, Search, Filter, Droplets } from 'lucide-react';
import { WastewaterFacility } from '@/types';

export default function Home() {
  const [facilities, setFacilities] = useState<WastewaterFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchFacilities();
  }, [searchTerm, filterStatus]);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/facilities?search=${encodeURIComponent(searchTerm)}&limit=50`);
      if (response.ok) {
        const data = await response.json();
        let filteredData = data.data;
        
        if (filterStatus) {
          filteredData = data.data.filter((facility: WastewaterFacility) => 
            facility.kondisi_status_operasional === filterStatus
          );
        }
        
        setFacilities(filteredData);
      }
    } catch (error) {
      console.error('Error fetching facilities:', error);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Droplets className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">SI-PAL</h1>
                <p className="text-sm text-gray-600">Sistem Informasi Pengelolaan Air Limbah</p>
              </div>
            </div>
            <nav className="flex space-x-4">
              <Link
                href="/"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-blue-600 bg-blue-50"
              >
                <List className="h-4 w-4 mr-2" />
                List View
              </Link>
              <Link
                href="/map"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Map View
              </Link>
              <Link
                href="/login"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Login Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Data Pengelolaan Air Limbah
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Informasi lengkap fasilitas IPALD (Instalasi Pengolahan Air Limbah Domestik) 
            di wilayah Kota Kendari dan sekitarnya
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari fasilitas..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="md:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <select
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-900"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">Semua Status</option>
                  <option value="Bangunan Baik, Optimal">Bangunan Baik, Optimal</option>
                  <option value="Bangunan Baik, Tidak Optimal">Bangunan Baik, Tidak Optimal</option>
                  <option value="Bangunan Rusak, Optimal">Bangunan Rusak, Optimal</option>
                  <option value="Bangunan Rusak, Tidak Optimal">Bangunan Rusak, Tidak Optimal</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Droplets className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Fasilitas</p>
                <p className="text-2xl font-bold text-gray-900">{facilities.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Status Optimal</p>
                <p className="text-2xl font-bold text-gray-900">
                  {facilities.filter(f => f.kondisi_status_operasional.includes('Optimal')).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Filter className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Perlu Pengecekan</p>
                <p className="text-2xl font-bold text-gray-900">
                  {facilities.filter(f => f.pengecekan_effluent === 'Belum dilakukan').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <List className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Kapasitas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {facilities.reduce((sum, f) => sum + f.kapasitas_desain, 0)} SR
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Facilities List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Daftar Fasilitas IPALD</h3>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      Nama Fasilitas
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      Lokasi
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      Kapasitas
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      Pengelola
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {facilities.map((facility) => (
                    <tr key={facility.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{facility.nama}</div>
                        {facility.tahun_dibangun_rehabilitasi && (
                          <div className="text-xs text-gray-500">
                            Tahun: {facility.tahun_dibangun_rehabilitasi}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{facility.kelurahan_desa}</div>
                        {facility.alamat_lengkap && (
                          <div className="text-xs text-gray-500 truncate max-w-xs">
                            {facility.alamat_lengkap}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {facility.kapasitas_desain} SR
                        </div>
                        <div className="text-xs text-gray-500">
                          Terpasang: {facility.kapasitas_terpasang} SR
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(facility.kondisi_status_operasional)}`}>
                          {facility.kondisi_status_operasional}
                        </span>
                        <div className="mt-1">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getEffluentColor(facility.pengecekan_effluent)}`}>
                            {facility.pengecekan_effluent}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{facility.lembaga_pengelola}</div>
                      </td>
                    </tr>
                  ))}
                  
                  {facilities.length === 0 && !loading && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <Droplets className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Tidak ada data fasilitas yang ditemukan</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              2024 Sistem Informasi Pengelolaan Air Limbah (SI-PAL)
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Data berdasarkan SSK Kota Kendari dan BPPW Provinsi Sulawesi Tenggara, 2024
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
