'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    role: '',
    is_active: true
  });

  useEffect(() => {
    if (params.id) {
      fetchUser();
    }
  }, [params.id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        const userData = data.data;
        setUser(userData);
        setFormData({
          username: userData.username || '',
          email: userData.email || '',
          password: '', // Don't populate password for security
          full_name: userData.full_name || '',
          role: userData.role || '',
          is_active: userData.is_active || false
        });
      } else {
        console.error('Failed to fetch user');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Only include password in the request if it's not empty
      const updateData: any = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }

      const response = await fetch(`/api/users/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        router.push('/admin/users');
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">User Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-4">User dengan ID tersebut tidak ada dalam database.</p>
          <Link
            href="/admin/users"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar User
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
            href="/admin/users"
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
            <p className="text-sm text-gray-600">Edit informasi user sistem</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Informasi User</h2>
          
          <div className="space-y-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-bold text-black mb-2">
                Username *
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg text-black font-semibold placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                placeholder="Masukkan username"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-black mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg text-black font-semibold placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                placeholder="Masukkan email"
              />
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-bold text-black mb-2">
                Nama Lengkap *
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg text-black font-semibold placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-black mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg text-black font-semibold placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm pr-10"
                  placeholder="Kosongkan jika tidak ingin mengubah password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Kosongkan field ini jika tidak ingin mengubah password
              </p>
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-bold text-black mb-2">
                Role *
              </label>
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-black font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              >
                <option value="">Pilih Role</option>
                <option value="admin">Admin</option>
                <option value="operator">Operator</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Status
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                  User Aktif
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                User yang tidak aktif tidak dapat login ke sistem
              </p>
            </div>

            {/* User Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Informasi User</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Dibuat:</span>
                  <span className="ml-2 text-gray-900">
                    {new Date(user.created_at).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Terakhir Update:</span>
                  <span className="ml-2 text-gray-900">
                    {new Date(user.updated_at).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Last Login:</span>
                  <span className="ml-2 text-gray-900">
                    {user.last_login ? new Date(user.last_login).toLocaleDateString('id-ID') : 'Belum pernah login'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">User ID:</span>
                  <span className="ml-2 text-gray-900">#{user.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end space-x-3">
          <Link
            href="/admin/users"
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
