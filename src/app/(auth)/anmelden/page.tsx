'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email) {
      newErrors.email = 'E-Mail-Adresse ist erforderlich';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ungültige E-Mail-Adresse';
    }

    if (!formData.password) {
      newErrors.password = 'Passwort ist erforderlich';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Anmeldung fehlgeschlagen');
      }

      toast.success('Erfolgreich angemeldet!');
      router.push('/');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Anmeldung fehlgeschlagen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h1 className="text-xl font-bold text-center">Anmelden</h1>
        <p className="text-sm text-[#666] text-center mt-1">
          Melden Sie sich mit Ihrem Kundenkonto an
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card-body space-y-4">
        <Input
          label="E-Mail-Adresse"
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          placeholder="ihre@email.de"
          autoComplete="email"
          required
        />

        <div>
          <label className="label">
            Passwort <span className="text-[#E31E24]">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`input pr-12 ${errors.password ? 'input-error' : ''}`}
              placeholder="Ihr Passwort"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#333]"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        <div className="flex justify-end">
          <Link
            href="/passwort-vergessen"
            className="text-sm text-[#E31E24] hover:text-[#C41A1F]"
          >
            Passwort vergessen?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isLoading}
          leftIcon={<LogIn size={18} />}
        >
          Anmelden
        </Button>

        <div className="text-center text-sm text-[#666]">
          Noch kein Konto?{' '}
          <Link href="/registrieren" className="text-[#E31E24] hover:text-[#C41A1F] font-medium">
            Jetzt registrieren
          </Link>
        </div>
      </form>
    </div>
  );
}
