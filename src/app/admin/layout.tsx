'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Menu, 
  X, 
  Home, 
  Database, 
  Users, 
  Settings, 
  LogOut,
  BarChart3,
  Droplets
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const menuItems = [
    { href: '/admin', icon: Home, label: 'Dashboard' },
    { href: '/admin/facilities', icon: Database, label: 'Data Pengelolaan Air Limbah' },
    { href: '/admin/users', icon: Users, label: 'Manajemen User' },
    { href: '/admin/reports', icon: BarChart3, label: 'Laporan' },
    { href: '/admin/settings', icon: Settings, label: 'Pengaturan' },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <Droplets className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">SI-PAL</h1>
              <p className="text-xs text-gray-400">Admin Dashboard</p>
            </div>
          </Link>
          
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="block lg:hidden"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Sidebar Menu */}
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
            <div>
              <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">MENU</h3>
              <ul className="mb-6 flex flex-col gap-1.5">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          isActive ? 'bg-graydark dark:bg-meta-4' : ''
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">OTHERS</h3>
              <ul className="mb-6 flex flex-col gap-1.5">
                <li>
                  <button 
                    onClick={handleLogout}
                    className="group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 w-full text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </aside>

      {/* Content Area */}
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
          <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
            <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
              >
                <Menu className="h-5.5 w-5.5" />
              </button>
            </div>

            <div className="hidden sm:block">
              <h1 className="text-title-md2 font-semibold text-black dark:text-white">
                Sistem Informasi Pengelolaan Air Limbah
              </h1>
            </div>

            <div className="flex items-center gap-3 2xsm:gap-7">
              {/* User Area */}
              <div className="relative">
                <div className="flex items-center gap-4">
                  <span className="hidden text-right lg:block">
                    <span className="block text-sm font-medium text-black dark:text-white">
                      {user?.full_name || user?.username || 'Admin User'}
                    </span>
                    <span className="block text-xs">{user?.role || 'Administrator'}</span>
                  </span>

                  <span className="h-12 w-12 rounded-full">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white text-lg font-semibold">
                      {(user?.full_name || user?.username || 'A').charAt(0).toUpperCase()}
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-99999 bg-black/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
