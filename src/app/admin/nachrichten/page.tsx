'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, Mail, Check, Trash2, Loader2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactSubmission | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/admin/messages');
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      toast.error('Fehler beim Laden der Nachrichten');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/admin/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      });
      setMessages(messages.map(m => m.id === id ? { ...m, isRead: true } : m));
    } catch (error) {
      toast.error('Fehler beim Aktualisieren');
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Nachricht wirklich löschen?')) return;

    try {
      await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
      setMessages(messages.filter(m => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
      toast.success('Nachricht gelöscht');
    } catch (error) {
      toast.error('Fehler beim Löschen');
    }
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Nachrichten</h1>
          <p className="text-gray-600">
            {messages.length} Nachrichten, {unreadCount} ungelesen
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="col-span-1 bg-white border border-gray-200 rounded-lg overflow-hidden">
          {messages.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <MessageSquare size={40} className="mx-auto mb-2 opacity-50" />
              Keine Nachrichten vorhanden
            </div>
          ) : (
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (!message.isRead) markAsRead(message.id);
                  }}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedMessage?.id === message.id ? 'bg-red-50' : ''
                  } ${!message.isRead ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {!message.isRead && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                        )}
                        <p className="font-medium truncate">{message.name}</p>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{message.subject}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(message.createdAt).toLocaleDateString('de-DE')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="col-span-2 bg-white border border-gray-200 rounded-lg p-6">
          {selectedMessage ? (
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{selectedMessage.subject}</h2>
                  <p className="text-gray-600">{selectedMessage.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                    title="Löschen"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <span className="text-gray-500">E-Mail:</span>
                  <a href={`mailto:${selectedMessage.email}`} className="ml-2 text-red-600 hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <span className="text-gray-500">Telefon:</span>
                    <a href={`tel:${selectedMessage.phone}`} className="ml-2">
                      {selectedMessage.phone}
                    </a>
                  </div>
                )}
                {selectedMessage.company && (
                  <div>
                    <span className="text-gray-500">Firma:</span>
                    <span className="ml-2">{selectedMessage.company}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Datum:</span>
                  <span className="ml-2">
                    {new Date(selectedMessage.createdAt).toLocaleString('de-DE')}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Nachricht:</h3>
                <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Mail size={18} />
                  Antworten
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Eye size={40} className="mb-2 opacity-50" />
              <p>Wählen Sie eine Nachricht aus</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
