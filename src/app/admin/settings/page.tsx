'use client';

import { useState, useEffect } from 'react';
import { Save, Database, Globe, Shield, Bell, Palette } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'SI-PAL',
    siteDescription: 'Sistem Informasi Pengelolaan Air Limbah',
    adminEmail: 'admin@sipal.com',
    timezone: 'Asia/Jakarta',
    language: 'id',
    theme: 'light',
    enableNotifications: true,
    enablePublicAccess: true,
    maxFileSize: '10',
    backupFrequency: 'daily',
    maintenanceMode: false
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Pengaturan Sistem
        </h2>
        <p className="text-regular text-body dark:text-bodydark">
          Konfigurasi dan pengaturan sistem SI-PAL
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* General Settings */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-primary" />
              <h3 className="font-medium text-black dark:text-white">
                Pengaturan Umum
              </h3>
            </div>
          </div>
          <div className="p-7">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Nama Sistem
                </label>
                <input
                  type="text"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-[1.5px] border-gray-300 bg-white py-3 px-5 text-gray-900 placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Email Admin
                </label>
                <input
                  type="email"
                  name="adminEmail"
                  value={settings.adminEmail}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-[1.5px] border-gray-300 bg-white py-3 px-5 text-gray-900 placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Deskripsi Sistem
                </label>
                <textarea
                  name="siteDescription"
                  rows={3}
                  value={settings.siteDescription}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-[1.5px] border-gray-300 bg-white py-3 px-5 text-gray-900 placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Database Settings */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-primary" />
              <h3 className="font-medium text-black dark:text-white">
                Pengaturan Database
              </h3>
            </div>
          </div>
          <div className="p-7">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Frekuensi Backup
                </label>
                <select
                  name="backupFrequency"
                  value={settings.backupFrequency}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-[1.5px] border-gray-300 bg-white py-3 px-5 text-gray-900 placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="hourly">Setiap Jam</option>
                  <option value="daily">Harian</option>
                  <option value="weekly">Mingguan</option>
                  <option value="monthly">Bulanan</option>
                </select>
              </div>
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Max File Size (MB)
                </label>
                <input
                  type="number"
                  name="maxFileSize"
                  value={settings.maxFileSize}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-[1.5px] border-gray-300 bg-white py-3 px-5 text-gray-900 placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="font-medium text-black dark:text-white">
                Pengaturan Keamanan
              </h3>
            </div>
          </div>
          <div className="p-7">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-black dark:text-white">
                    Akses Public
                  </label>
                  <p className="text-sm text-body">Izinkan akses publik ke data fasilitas</p>
                </div>
                <label className="flex cursor-pointer select-none items-center">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="enablePublicAccess"
                      checked={settings.enablePublicAccess}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`box block h-8 w-14 rounded-full ${settings.enablePublicAccess ? 'bg-primary' : 'bg-dark'}`}></div>
                    <div className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${settings.enablePublicAccess ? 'translate-x-full' : ''}`}></div>
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-black dark:text-white">
                    Mode Maintenance
                  </label>
                  <p className="text-sm text-body">Aktifkan mode maintenance untuk sistem</p>
                </div>
                <label className="flex cursor-pointer select-none items-center">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="maintenanceMode"
                      checked={settings.maintenanceMode}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`box block h-8 w-14 rounded-full ${settings.maintenanceMode ? 'bg-danger' : 'bg-dark'}`}></div>
                    <div className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${settings.maintenanceMode ? 'translate-x-full' : ''}`}></div>
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-black dark:text-white">
                    Notifikasi Email
                  </label>
                  <p className="text-sm text-body">Aktifkan notifikasi email untuk admin</p>
                </div>
                <label className="flex cursor-pointer select-none items-center">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="enableNotifications"
                      checked={settings.enableNotifications}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`box block h-8 w-14 rounded-full ${settings.enableNotifications ? 'bg-primary' : 'bg-dark'}`}></div>
                    <div className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${settings.enableNotifications ? 'translate-x-full' : ''}`}></div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
            <div className="flex items-center gap-3">
              <Palette className="h-5 w-5 text-primary" />
              <h3 className="font-medium text-black dark:text-white">
                Pengaturan Tampilan
              </h3>
            </div>
          </div>
          <div className="p-7">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Tema
                </label>
                <select
                  name="theme"
                  value={settings.theme}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-[1.5px] border-gray-300 bg-white py-3 px-5 text-gray-900 placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="light">Light Mode</option>
                  <option value="dark">Dark Mode</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Bahasa
                </label>
                <select
                  name="language"
                  value={settings.language}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-[1.5px] border-gray-300 bg-white py-3 px-5 text-gray-900 placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="id">Bahasa Indonesia</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Informasi Sistem
            </h3>
          </div>
          <div className="p-7">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-black dark:text-white">Versi SI-PAL:</span>
                  <span className="text-sm text-meta-3">v1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-black dark:text-white">Next.js Version:</span>
                  <span className="text-sm text-body">14.2.5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-black dark:text-white">Database:</span>
                  <span className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                    MySQL Connected
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-black dark:text-white">Last Backup:</span>
                  <span className="text-sm text-body">{new Date().toLocaleDateString('id-ID')}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-black dark:text-white">Server Status:</span>
                  <span className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                    Online
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-black dark:text-white">Uptime:</span>
                  <span className="text-sm text-body">24h 15m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-black dark:text-white">Environment:</span>
                  <span className="text-sm text-warning">Development</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-black dark:text-white">Node.js:</span>
                  <span className="text-sm text-body">v18.20.8</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>

        {/* Success Message */}
        {saved && (
          <div className="rounded-md bg-success bg-opacity-10 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm font-medium text-success">
                  Pengaturan berhasil disimpan!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
