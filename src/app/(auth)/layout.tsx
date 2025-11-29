import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Demo Banner */}
      <div className="demo-banner">
        DEMO - Testumgebung | Dies ist keine echte Shop-Website
      </div>

      {/* Header */}
      <header className="bg-white border-b border-[#E0E0E0]">
        <div className="container py-4">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="w-10 h-10 bg-[#E31E24] rounded flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-2xl font-bold text-[#1A1A1A]">
              Mc<span className="text-[#E31E24]">Paper</span>
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-md mx-auto">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E0E0E0] py-6 mt-auto">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-[#666]">
            <Link href="/impressum" className="hover:text-[#E31E24]">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-[#E31E24]">
              Datenschutz
            </Link>
            <Link href="/agb" className="hover:text-[#E31E24]">
              AGB
            </Link>
            <Link href="/kontakt" className="hover:text-[#E31E24]">
              Kontakt
            </Link>
          </div>
          <p className="text-center text-sm text-[#999] mt-4">
            &copy; {new Date().getFullYear()} McPaper AG (Demo)
          </p>
        </div>
      </footer>
    </div>
  );
}
