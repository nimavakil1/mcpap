'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';

const SUBJECTS = [
  { value: 'general', label: 'Allgemeine Anfrage' },
  { value: 'order', label: 'Frage zu einer Bestellung' },
  { value: 'product', label: 'Produktanfrage' },
  { value: 'returns', label: 'Retoure / Reklamation' },
  { value: 'business', label: 'Geschäftskunden-Anfrage' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'other', label: 'Sonstiges' },
];

export default function KontaktPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    orderNumber: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Fehler beim Senden');
      }

      toast.success('Ihre Nachricht wurde erfolgreich gesendet!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'general',
        orderNumber: '',
        message: '',
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Fehler beim Senden');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-6">
      <nav className="breadcrumb mb-6">
        <Link href="/">Startseite</Link>
        <ChevronRight size={16} className="breadcrumb-separator" />
        <span className="text-[#1A1A1A] font-medium">Kontakt</span>
      </nav>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Kontakt</h1>

        <div className="bg-[#FF6B00]/10 border border-[#FF6B00] rounded-lg p-4 mb-8">
          <p className="text-[#FF6B00] font-medium">
            ⚠️ DEMO - Dies ist eine Testumgebung und keine echte Shop-Website.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">So erreichen Sie uns</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone size={20} className="text-[#E31E24] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Telefon</p>
                    <p className="text-[#666]">+49 (0) 30 123456-0</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail size={20} className="text-[#E31E24] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">E-Mail</p>
                    <p className="text-[#666]">info@mcpaper-demo.de</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-[#E31E24] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Adresse</p>
                    <p className="text-[#666]">
                      McPaper AG (Demo)<br />
                      Musterstraße 123<br />
                      10115 Berlin
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock size={20} className="text-[#E31E24] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Erreichbarkeit</p>
                    <p className="text-[#666]">
                      Mo-Fr: 8:00 - 18:00 Uhr<br />
                      Sa: 9:00 - 14:00 Uhr
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Hint */}
            <div className="bg-[#F5F5F5] rounded-lg p-6">
              <h3 className="font-bold mb-2">Häufige Fragen?</h3>
              <p className="text-sm text-[#666] mb-3">
                Viele Antworten finden Sie bereits in unseren FAQ oder auf unseren Informationsseiten:
              </p>
              <ul className="text-sm space-y-2">
                <li>
                  <Link href="/versand" className="text-[#E31E24] hover:underline">
                    → Versand & Lieferung
                  </Link>
                </li>
                <li>
                  <Link href="/zahlungsarten" className="text-[#E31E24] hover:underline">
                    → Zahlungsarten
                  </Link>
                </li>
                <li>
                  <Link href="/widerrufsrecht" className="text-[#E31E24] hover:underline">
                    → Widerrufsrecht
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Kontaktformular</h2>
              <p className="text-[#666] mb-6">
                Füllen Sie das Formular aus und wir melden uns schnellstmöglich bei Ihnen.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Ihr Name"
                  />
                  <Input
                    label="E-Mail"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="ihre@email.de"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Telefon (optional)"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+49 123 456789"
                  />
                  <Select
                    label="Betreff"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    options={SUBJECTS}
                  />
                </div>

                {(formData.subject === 'order' || formData.subject === 'returns') && (
                  <Input
                    label="Bestellnummer"
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                    placeholder="z.B. MP-ABC123"
                  />
                )}

                <Textarea
                  label="Nachricht"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={6}
                  placeholder="Wie können wir Ihnen helfen?"
                />

                <p className="text-xs text-[#666]">
                  Mit dem Absenden des Formulars erklären Sie sich mit der Verarbeitung Ihrer Daten
                  gemäß unserer{' '}
                  <Link href="/datenschutz" className="text-[#E31E24] hover:underline">
                    Datenschutzerklärung
                  </Link>{' '}
                  einverstanden.
                </p>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  className="w-full md:w-auto"
                >
                  <Send size={18} className="mr-2" />
                  Nachricht senden
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
