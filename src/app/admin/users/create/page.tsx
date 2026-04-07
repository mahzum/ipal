'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, User } from 'lucide-react';

export default function CreateUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    role: 'operator',
    is_active: true
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validation
    const newErrors: {[key: string]: string} = {};
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          role: formData.role,
          is_active: formData.is_active
        }),
      });

      if (response.ok) {
        router.push('/admin/users');
      } else {
        const data = await response.json();
        alert(data.message || 'Gagal menyimpan data user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Terjadi kesalahan saat menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/users"
          className="inline-flex items-center text-sm text-body hover:text-primary mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Kembali ke Manajemen User
        </Link>
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Tambah User Baru
        </h2>
        <p className="text-regular text-body dark:text-bodydark">
          Buat akun user baru untuk sistem SI-PAL
        </p>
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-primary" />
            <h3 className="font-medium text-black dark:text-white">
              Informasi User
            </h3>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-7">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Username */}
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Username *
              </label>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleInputChange}
                className="mt-2 block w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg shadow-sm text-black font-semibold placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Masukkan username"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-2 block w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg shadow-sm text-black font-semibold placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Masukkan email"
              />
            </div>

            {/* Full Name */}
            <div className="sm:col-span-2">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Nama Lengkap *
              </label>
              <input
                type="text"
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleInputChange}
                className="mt-2 block w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg shadow-sm text-black font-semibold placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Password *
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="mt-2 block w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg shadow-sm text-black font-semibold placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Masukkan password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-danger">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Konfirmasi Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="mt-2 block w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg shadow-sm text-black font-semibold placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Konfirmasi password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-danger">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Role *
              </label>
              <select
                name="role"
                required
                value={formData.role}
                onChange={handleInputChange}
                className="mt-2 block w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg shadow-sm text-black font-semibold placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="operator">Operator</option>
                <option value="admin">Administrator</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Status
              </label>
              <label className="flex cursor-pointer select-none items-center">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className={`box block h-8 w-14 rounded-full ${formData.is_active ? 'bg-primary' : 'bg-dark'}`}></div>
                  <div className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${formData.is_active ? 'translate-x-full' : ''}`}></div>
                </div>
                <span className="ml-3 text-sm font-medium text-black dark:text-white">
                  {formData.is_active ? 'Aktif' : 'Nonaktif'}
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-stroke dark:border-strokedark mt-6">
            <Link
              href="/admin/users"
              className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Menyimpan...' : 'Simpan User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
