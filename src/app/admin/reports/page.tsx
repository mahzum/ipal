'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Download, Calendar, MapPin, TrendingUp, TrendingDown } from 'lucide-react';
import { WastewaterFacility } from '@/types';

interface ReportStats {
  totalFacilities: number;
  optimalFacilities: number;
  needsChecking: number;
  totalCapacity: number;
  capacityUtilization: number;
  byRegion: { [key: string]: number };
  byInstitution: { [key: string]: number };
  byStatus: { [key: string]: number };
}

export default function ReportsPage() {
  const [facilities, setFacilities] = useState<WastewaterFacility[]>([]);
  const [stats, setStats] = useState<ReportStats>({
    totalFacilities: 0,
    optimalFacilities: 0,
    needsChecking: 0,
    totalCapacity: 0,
    capacityUtilization: 0,
    byRegion: {},
    byInstitution: {},
    byStatus: {}
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/facilities?limit=1000');
      if (response.ok) {
        const data = await response.json();
        const facilities = data.data;
        setFacilities(facilities);
        generateStats(facilities);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateStats = (facilities: WastewaterFacility[]) => {
    const totalFacilities = facilities.length;
    const optimalFacilities = facilities.filter(f => f.kondisi_status_operasional.includes('Optimal')).length;
    const needsChecking = facilities.filter(f => f.pengecekan_effluent === 'Belum dilakukan').length;
    const totalCapacity = facilities.reduce((sum, f) => sum + f.kapasitas_desain, 0);
    const totalInstalled = facilities.reduce((sum, f) => sum + f.kapasitas_terpasang, 0);
    const capacityUtilization = totalCapacity > 0 ? (totalInstalled / totalCapacity) * 100 : 0;

    // Group by region
    const byRegion = facilities.reduce((acc, f) => {
      acc[f.kelurahan_desa] = (acc[f.kelurahan_desa] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    // Group by institution
    const byInstitution = facilities.reduce((acc, f) => {
      acc[f.lembaga_pengelola] = (acc[f.lembaga_pengelola] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    // Group by status
    const byStatus = facilities.reduce((acc, f) => {
      acc[f.kondisi_status_operasional] = (acc[f.kondisi_status_operasional] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    setStats({
      totalFacilities,
      optimalFacilities,
      needsChecking,
      totalCapacity,
      capacityUtilization,
      byRegion,
      byInstitution,
      byStatus
    });
  };

  const exportReport = () => {
    const csvContent = [
      ['Nama', 'Kelurahan/Desa', 'Kapasitas Desain', 'Kapasitas Terpasang', 'Status Operasional', 'Pengecekan Effluent', 'Lembaga Pengelola', 'Latitude', 'Longitude'],
      ...facilities.map(f => [
        f.nama,
        f.kelurahan_desa,
        f.kapasitas_desain,
        f.kapasitas_terpasang,
        f.kondisi_status_operasional,
        f.pengecekan_effluent,
        f.lembaga_pengelola,
        f.latitude || '',
        f.longitude || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-si-pal-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Laporan & Analisis
          </h2>
          <p className="text-regular text-body dark:text-bodydark">
            Laporan dan analisis data pengelolaan air limbah
          </p>
        </div>
        <div className="flex flex-col gap-4 2xsm:flex-row 2xsm:gap-7">
          <button
            onClick={exportReport}
            className="inline-flex items-center justify-center rounded-md bg-success py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-8">
        <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {stats.totalFacilities}
              </h4>
              <span className="text-sm font-medium">Total Fasilitas</span>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <TrendingUp className="h-6 w-6 text-success" />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {stats.optimalFacilities}
              </h4>
              <span className="text-sm font-medium">Status Optimal</span>
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-meta-3">
              {((stats.optimalFacilities / stats.totalFacilities) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <TrendingDown className="h-6 w-6 text-warning" />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {stats.needsChecking}
              </h4>
              <span className="text-sm font-medium">Perlu Pengecekan</span>
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-meta-7">
              {((stats.needsChecking / stats.totalFacilities) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <MapPin className="h-6 w-6 text-secondary" />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {stats.capacityUtilization.toFixed(1)}%
              </h4>
              <span className="text-sm font-medium">Utilisasi Kapasitas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2 2xl:gap-7.5">
        {/* By Region */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Distribusi per Kelurahan/Desa
            </h3>
          </div>
          <div className="p-7">
            <div className="space-y-4">
              {Object.entries(stats.byRegion).map(([region, count]) => (
                <div key={region} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-black dark:text-white">{region}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(count / stats.totalFacilities) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-primary">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* By Institution */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Distribusi per Lembaga Pengelola
            </h3>
          </div>
          <div className="p-7">
            <div className="space-y-4">
              {Object.entries(stats.byInstitution).map(([institution, count]) => (
                <div key={institution} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-black dark:text-white">{institution}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-success rounded-full"
                        style={{ width: `${(count / stats.totalFacilities) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-success">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-2">
          <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Overview Status Operasional
            </h3>
          </div>
          <div className="p-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(stats.byStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between p-4 bg-gray-1 rounded-md dark:bg-meta-4">
                  <div>
                    <h4 className="text-lg font-semibold text-black dark:text-white">{count}</h4>
                    <p className="text-sm text-body">{status}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                    status.includes('Optimal') ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'
                  }`}>
                    {status.includes('Optimal') ? (
                      <TrendingUp className={`h-6 w-6 ${status.includes('Optimal') ? 'text-success' : 'text-danger'}`} />
                    ) : (
                      <TrendingDown className={`h-6 w-6 ${status.includes('Optimal') ? 'text-success' : 'text-danger'}`} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Report Table */}
      <div className="mt-8 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Laporan Detail Fasilitas
          </h3>
        </div>
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Nama Fasilitas
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Lokasi
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Kapasitas (SR)
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Utilisasi (%)
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Status
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Pengelola
                </th>
              </tr>
            </thead>
            <tbody>
              {facilities.map((facility) => {
                const utilization = facility.kapasitas_desain > 0 
                  ? (facility.kapasitas_terpasang / facility.kapasitas_desain) * 100 
                  : 0;
                
                return (
                  <tr key={facility.id}>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {facility.nama}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {facility.kelurahan_desa}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {facility.kapasitas_desain} / {facility.kapasitas_terpasang}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              utilization >= 80 ? 'bg-success' : utilization >= 50 ? 'bg-warning' : 'bg-danger'
                            }`}
                            style={{ width: `${Math.min(utilization, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{utilization.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p
                        className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                          facility.kondisi_status_operasional.includes('Optimal')
                            ? 'bg-success text-success'
                            : 'bg-danger text-danger'
                        }`}
                      >
                        {facility.kondisi_status_operasional.includes('Optimal') ? 'Optimal' : 'Tidak Optimal'}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {facility.lembaga_pengelola}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
