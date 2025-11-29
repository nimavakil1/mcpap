'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Checkbox from '@/components/ui/Checkbox';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    companyName: '',
    phone: '',
    billingStreet: '',
    billingCity: '',
    billingPostalCode: '',
    isVerifiedBusiness: false,
    acceptTerms: false,
    acceptPrivacy: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Vorname ist erforderlich';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Nachname ist erforderlich';
    }

    if (!formData.email) {
      newErrors.email = 'E-Mail-Adresse ist erforderlich';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ungültige E-Mail-Adresse';
    }

    if (!formData.password) {
      newErrors.password = 'Passwort ist erforderlich';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Passwort muss mindestens 8 Zeichen lang sein';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwörter stimmen nicht überein';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Bitte akzeptieren Sie die AGB';
    }

    if (!formData.acceptPrivacy) {
      newErrors.acceptPrivacy = 'Bitte akzeptieren Sie die Datenschutzerklärung';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          companyName: formData.companyName || undefined,
          phone: formData.phone || undefined,
          billingStreet: formData.billingStreet || undefined,
          billingCity: formData.billingCity || undefined,
          billingPostalCode: formData.billingPostalCode || undefined,
          isVerifiedBusiness: formData.isVerifiedBusiness,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registrierung fehlgeschlagen');
      }

      toast.success('Erfolgreich registriert!');
      router.push('/');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registrierung fehlgeschlagen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h1 className="text-xl font-bold text-center">Registrieren</h1>
        <p className="text-sm text-[#666] text-center mt-1">
          Erstellen Sie Ihr Geschäftskonto bei McPaper
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card-body space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Vorname"
            name="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            error={errors.firstName}
            placeholder="Max"
            required
          />

          <Input
            label="Nachname"
            name="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            error={errors.lastName}
            placeholder="Mustermann"
            required
          />
        </div>

        <Input
          label="Firmenname"
          name="companyName"
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          placeholder="Musterfirma GmbH"
          helperText="Optional, aber empfohlen für Geschäftskunden"
        />

        <Input
          label="E-Mail-Adresse"
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          placeholder="ihre@firma.de"
          autoComplete="email"
          required
        />

        <Input
          label="Telefonnummer"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+49 30 12345678"
        />

        <div className="border-t border-[#E0E0E0] pt-4 mt-4">
          <h3 className="font-semibold mb-3">Rechnungsadresse</h3>
          <div className="space-y-4">
            <Input
              label="Straße und Hausnummer"
              name="billingStreet"
              value={formData.billingStreet}
              onChange={(e) => setFormData({ ...formData, billingStreet: e.target.value })}
              placeholder="Musterstraße 123"
            />

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="PLZ"
                name="billingPostalCode"
                value={formData.billingPostalCode}
                onChange={(e) => setFormData({ ...formData, billingPostalCode: e.target.value })}
                placeholder="10115"
                maxLength={5}
              />

              <div className="col-span-2">
                <Input
                  label="Stadt"
                  name="billingCity"
                  value={formData.billingCity}
                  onChange={(e) => setFormData({ ...formData, billingCity: e.target.value })}
                  placeholder="Berlin"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E0E0E0] pt-4 mt-4">
          <h3 className="font-semibold mb-3">Passwort</h3>
          <div className="space-y-4">
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
                  placeholder="Mindestens 8 Zeichen"
                  autoComplete="new-password"
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

            <Input
              label="Passwort bestätigen"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
              placeholder="Passwort wiederholen"
              autoComplete="new-password"
              required
            />
          </div>
        </div>

        <div className="border-t border-[#E0E0E0] pt-4 mt-4 space-y-3">
          <Checkbox
            name="isVerifiedBusiness"
            checked={formData.isVerifiedBusiness}
            onChange={(e) =>
              setFormData({ ...formData, isVerifiedBusiness: e.target.checked })
            }
            label="Ich bin ein gewerblicher Kunde und möchte auf Rechnung kaufen können"
          />

          <Checkbox
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
            label={
              <>
                Ich akzeptiere die{' '}
                <Link href="/agb" className="text-[#E31E24] hover:underline" target="_blank">
                  AGB
                </Link>{' '}
                *
              </>
            }
            error={errors.acceptTerms}
          />

          <Checkbox
            name="acceptPrivacy"
            checked={formData.acceptPrivacy}
            onChange={(e) => setFormData({ ...formData, acceptPrivacy: e.target.checked })}
            label={
              <>
                Ich akzeptiere die{' '}
                <Link
                  href="/datenschutz"
                  className="text-[#E31E24] hover:underline"
                  target="_blank"
                >
                  Datenschutzerklärung
                </Link>{' '}
                *
              </>
            }
            error={errors.acceptPrivacy}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isLoading}
          leftIcon={<UserPlus size={18} />}
        >
          Konto erstellen
        </Button>

        <div className="text-center text-sm text-[#666]">
          Bereits ein Konto?{' '}
          <Link href="/anmelden" className="text-[#E31E24] hover:text-[#C41A1F] font-medium">
            Jetzt anmelden
          </Link>
        </div>
      </form>
    </div>
  );
}
