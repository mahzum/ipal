'use client';

import { useEffect, useState } from 'react';
import { Database, MapPin, CheckCircle, AlertCircle, Plus, BarChart3 } from 'lucide-react';

interface DashboardStats {
  totalFacilities: number;
  activeFacilities: number;
  facilitiesNeedingCheck: number;
  totalCapacity: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalFacilities: 0,
    activeFacilities: 0,
    facilitiesNeedingCheck: 0,
    totalCapacity: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Fasilitas IPALD',
      value: stats.totalFacilities,
      icon: Database,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Fasilitas Aktif',
      value: stats.activeFacilities,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Perlu Pengecekan',
      value: stats.facilitiesNeedingCheck,
      icon: AlertCircle,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Total Kapasitas (SR)',
      value: stats.totalCapacity,
      icon: MapPin,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Dashboard
        </h2>
        <p className="text-regular text-body dark:text-bodydark">
          Selamat datang di Sistem Informasi Pengelolaan Air Limbah (SI-PAL)
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                <Icon className={`h-6 w-6 ${card.textColor}`} />
              </div>

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <h4 className="text-title-md font-bold text-black dark:text-white">
                    {card.value.toLocaleString()}
                  </h4>
                  <span className="text-sm font-medium">{card.title}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2 2xl:gap-7.5">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Aksi Cepat
            </h3>
          </div>
          <div className="p-7">
            <div className="space-y-3">
              <a
                href="/admin/facilities/create"
                className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 py-3 px-6 text-center font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Fasilitas IPALD Baru
              </a>
              <a
                href="/admin/facilities"
                className="inline-flex w-full items-center justify-center rounded-lg border border-blue-600 py-3 px-6 text-center font-medium text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Database className="h-4 w-4 mr-2" />
                Kelola Data Fasilitas
              </a>
              <a
                href="/admin/reports"
                className="inline-flex w-full items-center justify-center rounded-lg bg-green-600 py-3 px-6 text-center font-medium text-white hover:bg-green-700 transition-colors shadow-sm"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Lihat Laporan
              </a>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Informasi Sistem
            </h3>
          </div>
          <div className="p-7">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-black dark:text-white">Versi Sistem:</span>
                <span className="text-sm text-meta-3">v1.0.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-black dark:text-white">Database:</span>
                <span className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                  Terhubung
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-black dark:text-white">Last Update:</span>
                <span className="text-sm text-black dark:text-white">{new Date().toLocaleDateString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
