import Link from 'next/link';
import { redirect } from 'next/navigation';
import { User, Package, Heart, ShoppingBag, Settings, LogOut, ChevronRight, BadgePercent } from 'lucide-react';
import { getSession } from '@/lib/auth';

interface AccountLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: '/konto', label: 'Übersicht', icon: User },
  { href: '/konto/bestellungen', label: 'Bestellungen', icon: Package },
  { href: '/konto/favoriten', label: 'Favoriten', icon: Heart },
  { href: '/konto/gespeicherte-warenkoerbe', label: 'Gespeicherte Warenkörbe', icon: ShoppingBag },
  { href: '/konto/einstellungen', label: 'Einstellungen', icon: Settings },
];

export default async function AccountLayout({ children }: AccountLayoutProps) {
  const session = await getSession();

  if (!session || session.isAdmin) {
    redirect('/anmelden?redirect=/konto');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="container py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-red-600 transition-colors">
              Startseite
            </Link>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-gray-900 font-medium">Mein Konto</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Mein Konto
          </h1>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden sticky top-24">
              {/* User Info */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-3">
                  {session.email?.charAt(0).toUpperCase()}
                </div>
                <p className="text-sm text-gray-500">Angemeldet als</p>
                <p className="font-semibold text-gray-900 truncate">{session.email}</p>
                {session.discountPercentage > 0 && (
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-100 rounded-full">
                      <BadgePercent size={14} className="text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        {session.discountPercentage}% Rabatt
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <nav className="p-3">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all group"
                    >
                      <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                        <Icon size={18} className="group-hover:text-red-600 transition-colors" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}

                <div className="h-px bg-gray-100 my-2" />

                <form action="/api/auth/logout" method="POST">
                  <button
                    type="submit"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all group"
                  >
                    <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                      <LogOut size={18} />
                    </div>
                    <span className="font-medium">Abmelden</span>
                  </button>
                </form>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  );
}
