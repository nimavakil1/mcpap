'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  taxId: string;
}

interface AddressData {
  company: string;
  firstName: string;
  lastName: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  country: string;
}

const COUNTRIES = [
  { value: 'DE', label: 'Deutschland' },
  { value: 'AT', label: 'Österreich' },
  { value: 'CH', label: 'Schweiz' },
];

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    taxId: '',
  });

  const [address, setAddress] = useState<AddressData>({
    company: '',
    firstName: '',
    lastName: '',
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
    country: 'DE',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUserData({
              firstName: data.user.firstName || '',
              lastName: data.user.lastName || '',
              email: data.user.email || '',
              phone: data.user.phone || '',
              company: data.user.company || '',
              taxId: data.user.taxId || '',
            });
            if (data.user.defaultShippingAddress) {
              setAddress(data.user.defaultShippingAddress);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Fehler beim Speichern');
      }

      toast.success('Profil erfolgreich aktualisiert');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Fehler beim Speichern');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAddress(true);
    try {
      const response = await fetch('/api/user/address', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(address),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Fehler beim Speichern');
      }

      toast.success('Adresse erfolgreich aktualisiert');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Fehler beim Speichern');
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Passwörter stimmen nicht überein');
      return;
    }

    if (passwords.newPassword.length < 8) {
      toast.error('Passwort muss mindestens 8 Zeichen lang sein');
      return;
    }

    setIsSavingPassword(true);
    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Fehler beim Ändern des Passworts');
      }

      toast.success('Passwort erfolgreich geändert');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Fehler beim Ändern');
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={32} className="animate-spin text-[#E31E24]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Einstellungen</h1>

      {/* Profile Section */}
      <form onSubmit={handleSaveProfile} className="bg-white border border-[#E0E0E0] rounded-lg p-6">
        <h2 className="text-lg font-bold mb-4">Persönliche Daten</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Vorname"
            value={userData.firstName}
            onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
            required
          />
          <Input
            label="Nachname"
            value={userData.lastName}
            onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
            required
          />
          <Input
            label="E-Mail"
            type="email"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            required
          />
          <Input
            label="Telefon"
            type="tel"
            value={userData.phone}
            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
          />
          <Input
            label="Firma"
            value={userData.company}
            onChange={(e) => setUserData({ ...userData, company: e.target.value })}
          />
          <Input
            label="USt-IdNr."
            value={userData.taxId}
            onChange={(e) => setUserData({ ...userData, taxId: e.target.value })}
            placeholder="DE123456789"
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button type="submit" variant="primary" isLoading={isSavingProfile}>
            <Save size={16} className="mr-2" />
            Speichern
          </Button>
        </div>
      </form>

      {/* Address Section */}
      <form onSubmit={handleSaveAddress} className="bg-white border border-[#E0E0E0] rounded-lg p-6">
        <h2 className="text-lg font-bold mb-4">Standardadresse</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Firma (optional)"
              value={address.company}
              onChange={(e) => setAddress({ ...address, company: e.target.value })}
            />
          </div>
          <Input
            label="Vorname"
            value={address.firstName}
            onChange={(e) => setAddress({ ...address, firstName: e.target.value })}
          />
          <Input
            label="Nachname"
            value={address.lastName}
            onChange={(e) => setAddress({ ...address, lastName: e.target.value })}
          />
          <div className="md:col-span-2 grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Input
                label="Straße"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
              />
            </div>
            <Input
              label="Nr."
              value={address.houseNumber}
              onChange={(e) => setAddress({ ...address, houseNumber: e.target.value })}
            />
          </div>
          <Input
            label="PLZ"
            value={address.postalCode}
            onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
          />
          <Input
            label="Stadt"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
          />
          <Select
            label="Land"
            value={address.country}
            onChange={(e) => setAddress({ ...address, country: e.target.value })}
            options={COUNTRIES}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button type="submit" variant="primary" isLoading={isSavingAddress}>
            <Save size={16} className="mr-2" />
            Adresse speichern
          </Button>
        </div>
      </form>

      {/* Password Section */}
      <form onSubmit={handleChangePassword} className="bg-white border border-[#E0E0E0] rounded-lg p-6">
        <h2 className="text-lg font-bold mb-4">Passwort ändern</h2>
        <div className="grid md:grid-cols-2 gap-4 max-w-md">
          <div className="md:col-span-2">
            <Input
              label="Aktuelles Passwort"
              type="password"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              required
            />
          </div>
          <Input
            label="Neues Passwort"
            type="password"
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            required
          />
          <Input
            label="Passwort bestätigen"
            type="password"
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
            required
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button type="submit" variant="primary" isLoading={isSavingPassword}>
            Passwort ändern
          </Button>
        </div>
      </form>
    </div>
  );
}
