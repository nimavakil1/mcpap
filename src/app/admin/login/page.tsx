'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Anmeldung fehlgeschlagen');
      }

      toast.success('Erfolgreich angemeldet');
      router.push('/admin');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Anmeldung fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#E31E24] rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-3xl">M</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-gray-400 mt-2">McPaper Backoffice</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 shadow-xl">
          <div className="mb-4">
            <label className="label">E-Mail-Adresse</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="label">Passwort</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? (
              <span className="loader w-5 h-5"></span>
            ) : (
              <>
                <LogIn size={18} />
                Anmelden
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
