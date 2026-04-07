'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, UserCheck, UserX, AlertCircle } from 'lucide-react';
import { User } from '@/types';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/users?page=${currentPage}&limit=10&search=${encodeURIComponent(searchTerm)}`
      );
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchUsers();
        setShowDeleteModal(false);
        setUserToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const toggleUserStatus = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      
      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-danger text-danger';
      case 'operator':
        return 'bg-primary text-primary';
      default:
        return 'bg-secondary text-secondary';
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Manajemen User
          </h2>
          <p className="text-regular text-body dark:text-bodydark">
            Kelola akun pengguna sistem SI-PAL
          </p>
        </div>
        <div className="flex flex-col gap-4 2xsm:flex-row 2xsm:gap-7">
          <Link
            href="/admin/users/create"
            className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah User
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari berdasarkan username, email, atau nama lengkap..."
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
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    User Info
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Email
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Role
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Status
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Last Login
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white text-lg font-semibold">
                          {user.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h5 className="font-medium text-black dark:text-white">
                            {user.full_name}
                          </h5>
                          <p className="text-sm text-body">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {user.email}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p
                        className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${getRoleBadgeColor(user.role)}`}
                      >
                        {user.role.toUpperCase()}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <button
                        onClick={() => toggleUserStatus(user.id!, user.is_active)}
                        className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                          user.is_active
                            ? 'bg-success text-success'
                            : 'bg-danger text-danger'
                        }`}
                      >
                        {user.is_active ? (
                          <>
                            <UserCheck className="h-3 w-3 mr-1" />
                            Aktif
                          </>
                        ) : (
                          <>
                            <UserX className="h-3 w-3 mr-1" />
                            Nonaktif
                          </>
                        )}
                      </button>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {user.last_login 
                          ? new Date(user.last_login).toLocaleDateString('id-ID')
                          : 'Belum pernah login'
                        }
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/users/${user.id}/edit`}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setUserToDelete(user.id!);
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
                  <h3 className="text-lg font-semibold text-gray-900">Konfirmasi Hapus User</h3>
                </div>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan dan user tidak akan bisa mengakses sistem lagi.
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDelete(userToDelete!)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Hapus User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
