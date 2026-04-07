'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { MapPin, List, Search, Filter, Droplets, Info } from 'lucide-react';
import { WastewaterFacility } from '@/types';

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Memuat peta...</p>
      </div>
    </div>
  )
});

export default function MapPage() {
  const [facilities, setFacilities] = useState<WastewaterFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedFacility, setSelectedFacility] = useState<WastewaterFacility | null>(null);

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
        
        // Only include facilities with coordinates for map view
        const facilitiesWithCoords = filteredData.filter((facility: WastewaterFacility) => 
          facility.latitude && facility.longitude
        );
        
        setFacilities(facilitiesWithCoords);
      }
    } catch (error) {
      console.error('Error fetching facilities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    if (status.includes('Optimal')) {
      return 'text-green-600 bg-green-50';
    }
    return 'text-red-600 bg-red-50';
  };

  const getEffluentColor = (status: string) => {
    switch (status) {
      case 'Sudah dilakukan':
        return 'text-green-600 bg-green-50';
      case 'Dalam proses':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-red-600 bg-red-50';
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
                <h1 className="text-2xl font-bold text-black">SI-PAL</h1>
                <p className="text-sm font-semibold text-black">Sistem Informasi Pengelolaan Air Limbah</p>
              </div>
            </div>
            <nav className="flex space-x-4">
              <Link
                href="/"
                className="flex items-center px-3 py-2 rounded-md text-sm font-bold text-black hover:text-black hover:bg-gray-100"
              >
                <List className="h-4 w-4 mr-2" />
                List View
              </Link>
              <Link
                href="/map"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-blue-600 bg-blue-50"
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
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-black mb-4">
            Peta Lokasi Fasilitas IPALD
          </h2>
          <p className="text-xl font-semibold text-black max-w-3xl mx-auto">
            Visualisasi geografis fasilitas IPALD (Instalasi Pengolahan Air Limbah Domestik) 
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
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-400 rounded-lg text-black font-semibold placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="md:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <select
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-black font-semibold shadow-sm"
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-black">Peta Lokasi Fasilitas</h3>
                <p className="text-sm font-semibold text-black mt-1">
                  Klik pada marker untuk melihat detail fasilitas
                </p>
              </div>
              <div className="h-96 lg:h-[600px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                      <p className="text-gray-600">Memuat data fasilitas...</p>
                    </div>
                  </div>
                ) : (
                  <MapComponent 
                    facilities={facilities} 
                    onMarkerClick={setSelectedFacility}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Facility Details Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Detail Fasilitas</h3>
              </div>
              
              {selectedFacility ? (
                <div className="p-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">
                    {selectedFacility.nama}
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Lokasi:</span>
                      <p className="text-sm text-gray-900">{selectedFacility.kelurahan_desa}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-600">Kapasitas Desain:</span>
                      <p className="text-sm text-gray-900">{selectedFacility.kapasitas_desain} SR</p>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-600">Kapasitas Terpasang:</span>
                      <p className="text-sm text-gray-900">{selectedFacility.kapasitas_terpasang} SR</p>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-600">Lembaga Pengelola:</span>
                      <p className="text-sm text-gray-900">{selectedFacility.lembaga_pengelola}</p>
                    </div>
                    
                    {selectedFacility.tahun_dibangun_rehabilitasi && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Tahun Dibangun/Rehabilitasi:</span>
                        <p className="text-sm text-gray-900">{selectedFacility.tahun_dibangun_rehabilitasi}</p>
                      </div>
                    )}
                    
                    <div>
                      <span className="text-sm font-medium text-gray-600">Koordinat:</span>
                      <p className="text-sm text-gray-900">
                        {selectedFacility.latitude}, {selectedFacility.longitude}
                      </p>
                    </div>
                    
                    {selectedFacility.alamat_lengkap && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Alamat Lengkap:</span>
                        <p className="text-sm text-gray-900">{selectedFacility.alamat_lengkap}</p>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-gray-600">Status Operasional:</span>
                          <div className="mt-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedFacility.kondisi_status_operasional)}`}>
                              {selectedFacility.kondisi_status_operasional}
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-sm font-medium text-gray-600">Pengecekan Effluent:</span>
                          <div className="mt-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEffluentColor(selectedFacility.pengecekan_effluent)}`}>
                              {selectedFacility.pengecekan_effluent}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {selectedFacility.keterangan && (
                      <div className="pt-4 border-t border-gray-200">
                        <span className="text-sm font-medium text-gray-600">Keterangan:</span>
                        <p className="text-sm text-gray-900 mt-1">{selectedFacility.keterangan}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center">
                  <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Klik pada marker di peta untuk melihat detail fasilitas
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Statistik Fasilitas dengan Koordinat</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{facilities.length}</p>
              <p className="text-sm text-gray-600">Total Fasilitas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {facilities.filter(f => f.kondisi_status_operasional.includes('Optimal')).length}
              </p>
              <p className="text-sm text-gray-600">Status Optimal</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {facilities.filter(f => f.pengecekan_effluent === 'Belum dilakukan').length}
              </p>
              <p className="text-sm text-gray-600">Perlu Pengecekan</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {facilities.reduce((sum, f) => sum + f.kapasitas_desain, 0)} SR
              </p>
              <p className="text-sm text-gray-600">Total Kapasitas</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              © 2024 Sistem Informasi Pengelolaan Air Limbah (SI-PAL)
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
