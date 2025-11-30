import Link from 'next/link';
import { redirect } from 'next/navigation';
import { User, Package, Heart, ShoppingBag, Settings, LogOut, ChevronRight } from 'lucide-react';
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
    <div className="container py-6">
      <nav className="breadcrumb mb-6">
        <Link href="/">Startseite</Link>
        <ChevronRight size={16} className="breadcrumb-separator" />
        <span className="text-[#1A1A1A] font-medium">Mein Konto</span>
      </nav>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-white border border-[#E0E0E0] rounded-lg p-4 sticky top-24">
            <div className="pb-4 mb-4 border-b border-[#E0E0E0]">
              <p className="text-sm text-[#666]">Angemeldet als</p>
              <p className="font-medium truncate">{session.email}</p>
              {session.customerGroupName && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-[#E31E24]/10 text-[#E31E24] text-xs rounded">
                  {session.customerGroupName}
                </span>
              )}
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#666] hover:bg-[#F5F5F5] hover:text-[#1A1A1A] transition-colors"
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[#DC3545] hover:bg-[#DC3545]/10 transition-colors"
                >
                  <LogOut size={18} />
                  Abmelden
                </button>
              </form>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">{children}</main>
      </div>
    </div>
  );
}
