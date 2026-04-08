'use client';

import { useEffect, useState } from 'react';
import { Database, MapPin, CheckCircle, AlertCircle, Plus, BarChart3, RefreshCw } from 'lucide-react';
import { LoadingState, EmptyState } from '@/components/LoadingState';
import ErrorBoundary from '@/components/ErrorBoundary';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch dashboard data');
      }
      
      setStats(data.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError(error instanceof Error ? error.message : 'Failed to load dashboard data');
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
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
            <p className="text-gray-600">Memuat data dashboard...</p>
          </div>
          <LoadingState message="Memuat statistik dashboard..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
          </div>
          <EmptyState
            title="Gagal Memuat Data"
            description={error}
            icon={
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            }
            action={
              <button
                onClick={fetchDashboardStats}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Coba Lagi
              </button>
            }
          />
        </div>
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
            <div key={index} className="rounded-sm border border-slate-200 bg-white py-6 px-7.5 shadow-default">
              <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-slate-100">
                <Icon className={`h-6 w-6 ${card.textColor}`} />
              </div>

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <h4 className="text-title-md font-bold text-gray-900">
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
        <div className="rounded-sm border border-slate-200 bg-white shadow-default">
          <div className="border-b border-slate-200 py-4 px-7">
            <h3 className="font-medium text-gray-900">
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

        <div className="rounded-sm border border-slate-200 bg-white shadow-default">
          <div className="border-b border-slate-200 py-4 px-7">
            <h3 className="font-medium text-gray-900">
              Informasi Sistem
            </h3>
          </div>
          <div className="p-7">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Versi Sistem:</span>
                <span className="text-sm text-gray-600">v1.0.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Database:</span>
                <span className="inline-flex rounded-full bg-green-100 bg-opacity-10 py-1 px-3 text-sm font-medium text-green-700">
                  Terhubung
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Last Update:</span>
                <span className="text-sm text-gray-600">{new Date().toLocaleDateString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
