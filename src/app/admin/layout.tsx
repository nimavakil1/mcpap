'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Package, FolderTree, ShoppingCart, Users, Settings,
  FileText, Tags, MessageSquare, LogOut, Menu, X, Gift, Upload
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Produkte', href: '/admin/produkte', icon: Package },
  { name: 'Kategorien', href: '/admin/kategorien', icon: FolderTree },
  { name: 'Bestellungen', href: '/admin/bestellungen', icon: ShoppingCart },
  { name: 'Kunden', href: '/admin/kunden', icon: Users },
  { name: 'Gutscheine', href: '/admin/gutscheine', icon: Gift },
  { name: 'Import', href: '/admin/import', icon: Upload },
  { name: 'Nachrichten', href: '/admin/nachrichten', icon: MessageSquare },
  { name: 'Einstellungen', href: '/admin/einstellungen', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Allow login page to render without auth check
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isLoginPage) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [isLoginPage]);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      if (data.user?.isAdmin) {
        setIsAuthenticated(true);
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="loader"></div>
      </div>
    );
  }

  // For login page, just render children without the admin layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 w-64 h-full bg-[#1A1A1A] transform transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#333]">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#E31E24] rounded flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="text-white font-bold">Admin</span>
          </Link>
          <button
            className="lg:hidden text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded transition-colors ${
                  isActive
                    ? 'bg-red-600 text-white'
                    : 'text-gray-100 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full text-gray-100 hover:bg-gray-700 hover:text-white rounded transition-colors"
          >
            <LogOut size={20} />
            Abmelden
          </button>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 mt-2 text-gray-100 hover:bg-gray-700 hover:text-white rounded transition-colors"
          >
            Zum Shop
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="text-sm text-[#666]">
              McPaper Admin Panel
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
