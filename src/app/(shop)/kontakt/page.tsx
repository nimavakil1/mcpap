'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Mail, Phone, MapPin, Clock, Send, MessageSquare, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

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
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link href="/" className="text-gray-500 hover:text-red-600 transition-colors">
            Startseite
          </Link>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-gray-900 font-medium">Kontakt</span>
        </nav>

        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={32} className="text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Kontakt</h1>
            <p className="text-gray-500">Wir sind für Sie da - schreiben Sie uns!</p>
          </div>

          {/* Demo Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8">
            <p className="text-amber-700 font-medium text-center">
              DEMO - Dies ist eine Testumgebung und keine echte Shop-Website.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all">
                <h2 className="font-bold text-gray-900 mb-6">So erreichen Sie uns</h2>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone size={18} className="text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Telefon</p>
                      <a href="tel:+4930123456780" className="text-gray-600 hover:text-red-600 transition-colors">
                        +49 (0) 30 123456-0
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail size={18} className="text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">E-Mail</p>
                      <a href="mailto:info@mcpaper-demo.de" className="text-gray-600 hover:text-red-600 transition-colors">
                        info@mcpaper-demo.de
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin size={18} className="text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Adresse</p>
                      <p className="text-gray-600">
                        McPaper AG (Demo)<br />
                        Musterstraße 123<br />
                        10115 Berlin
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock size={18} className="text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Erreichbarkeit</p>
                      <p className="text-gray-600">
                        Mo-Fr: 8:00 - 18:00 Uhr<br />
                        Sa: 9:00 - 14:00 Uhr
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Hint */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all">
                <h3 className="font-bold text-gray-900 mb-3">Häufige Fragen?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Viele Antworten finden Sie bereits in unseren FAQ oder auf unseren Informationsseiten:
                </p>
                <ul className="space-y-2">
                  {[
                    { href: '/versand', label: 'Versand & Lieferung' },
                    { href: '/zahlungsarten', label: 'Zahlungsarten' },
                    { href: '/widerrufsrecht', label: 'Widerrufsrecht' },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                      >
                        <ArrowRight size={14} />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all">
                <h2 className="font-bold text-gray-900 mb-2">Kontaktformular</h2>
                <p className="text-gray-600 mb-6">
                  Füllen Sie das Formular aus und wir melden uns schnellstmöglich bei Ihnen.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="Ihr Name"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-Mail <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        placeholder="ihre@email.de"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefon (optional)
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+49 123 456789"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Betreff
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all"
                      >
                        {SUBJECTS.map((subject) => (
                          <option key={subject.value} value={subject.value}>
                            {subject.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {(formData.subject === 'order' || formData.subject === 'returns') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bestellnummer
                      </label>
                      <input
                        type="text"
                        value={formData.orderNumber}
                        onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                        placeholder="z.B. MP-ABC123"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nachricht <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={6}
                      placeholder="Wie können wir Ihnen helfen?"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all resize-none"
                    />
                  </div>

                  <p className="text-xs text-gray-500">
                    Mit dem Absenden des Formulars erklären Sie sich mit der Verarbeitung Ihrer Daten
                    gemäß unserer{' '}
                    <Link href="/datenschutz" className="text-red-600 hover:underline">
                      Datenschutzerklärung
                    </Link>{' '}
                    einverstanden.
                  </p>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Wird gesendet...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Nachricht senden
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
