'use client';

import { useState, useRef } from 'react';
import { Upload, Trash2, Play, Loader2, AlertCircle, Check, FileSpreadsheet, Image, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

interface ImportStatus {
  totalRows: number;
  processed: number;
  failed: number;
  progress: number;
  errors: string[];
  completed: boolean;
  running: boolean;
}

export default function BulkImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);
  const [status, setStatus] = useState<ImportStatus>({
    totalRows: 0,
    processed: 0,
    failed: 0,
    progress: 0,
    errors: [],
    completed: false,
    running: false,
  });
  const [options, setOptions] = useState({
    generateDescriptions: true,
    fetchImages: true,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
        toast.error('Bitte wählen Sie eine Excel-Datei (.xlsx oder .xls)');
        return;
      }
      setFile(selectedFile);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Bitte wählen Sie eine Datei aus');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/bulk-import', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload fehlgeschlagen');
      }

      setUploadResult(data);
      setStatus(prev => ({ ...prev, totalRows: data.totalRows }));
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error.message || 'Upload fehlgeschlagen');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('ACHTUNG: Alle Produkte, Bilder und Kategorien werden unwiderruflich gelöscht. Fortfahren?')) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch('/api/admin/bulk-import', {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Löschen fehlgeschlagen');
      }

      toast.success(data.message);
      setUploadResult(null);
      setStatus({
        totalRows: 0,
        processed: 0,
        failed: 0,
        progress: 0,
        errors: [],
        completed: false,
        running: false,
      });
    } catch (error: any) {
      toast.error(error.message || 'Löschen fehlgeschlagen');
    } finally {
      setDeleting(false);
    }
  };

  const processNextBatch = async (offset: number) => {
    if (abortRef.current) {
      setStatus(prev => ({ ...prev, running: false }));
      toast.error('Import abgebrochen');
      return;
    }

    try {
      const res = await fetch('/api/admin/bulk-import/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offset,
          generateDescriptions: options.generateDescriptions,
          fetchImages: options.fetchImages,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Verarbeitung fehlgeschlagen');
      }

      setStatus(prev => ({
        ...prev,
        processed: prev.processed + data.processed,
        failed: prev.failed + data.failed,
        progress: data.progress,
        errors: [...prev.errors, ...data.errors].slice(-10),
        completed: data.completed,
      }));

      if (!data.completed && data.nextOffset !== null) {
        // Continue with next batch
        setTimeout(() => processNextBatch(data.nextOffset), 500);
      } else {
        setStatus(prev => ({ ...prev, running: false, completed: true }));
        toast.success('Import abgeschlossen!');
      }
    } catch (error: any) {
      setStatus(prev => ({ ...prev, running: false }));
      toast.error(error.message || 'Verarbeitung fehlgeschlagen');
    }
  };

  const handleStartImport = () => {
    if (!uploadResult) {
      toast.error('Bitte laden Sie zuerst eine Datei hoch');
      return;
    }

    abortRef.current = false;
    setStatus({
      totalRows: uploadResult.totalRows,
      processed: 0,
      failed: 0,
      progress: 0,
      errors: [],
      completed: false,
      running: true,
    });

    processNextBatch(0);
  };

  const handleAbort = () => {
    abortRef.current = true;
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Massen-Import</h1>
        <p className="text-gray-600">Importieren Sie Produkte aus einer Excel-Datei</p>
      </div>

      {/* Step 1: Clear existing data */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">1</div>
          <h2 className="text-lg font-semibold">Bestehende Daten löschen (optional)</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Löschen Sie alle bestehenden Produkte, Bilder und Kategorien bevor Sie neue importieren.
        </p>
        <button
          onClick={handleDeleteAll}
          disabled={deleting || status.running}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          {deleting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Trash2 size={18} />
          )}
          Alle Produkte & Kategorien löschen
        </button>
      </div>

      {/* Step 2: Upload file */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">2</div>
          <h2 className="text-lg font-semibold">Excel-Datei hochladen</h2>
        </div>

        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />
          {file ? (
            <>
              <FileSpreadsheet size={40} className="mx-auto mb-2 text-green-500" />
              <p className="font-medium text-green-700">{file.name}</p>
              <p className="text-sm text-green-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </>
          ) : (
            <>
              <Upload size={40} className="mx-auto mb-2 text-gray-400" />
              <p className="font-medium text-gray-700">Klicken Sie hier um eine Datei auszuwählen</p>
              <p className="text-sm text-gray-500">Excel-Dateien (.xlsx, .xls)</p>
            </>
          )}
        </div>

        {file && !uploadResult && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Upload size={18} />
            )}
            Datei analysieren
          </button>
        )}

        {uploadResult && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-700">
              <Check size={20} />
              <span className="font-medium">{uploadResult.totalRows} Produkte gefunden</span>
            </div>
          </div>
        )}
      </div>

      {/* Step 3: Options */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">3</div>
          <h2 className="text-lg font-semibold">Import-Optionen</h2>
        </div>

        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options.generateDescriptions}
              onChange={(e) => setOptions(prev => ({ ...prev, generateDescriptions: e.target.checked }))}
              className="mt-1 w-4 h-4 text-blue-600 rounded"
              disabled={status.running}
            />
            <div>
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-purple-500" />
                <span className="font-medium">Beschreibungen mit GPT-4 generieren</span>
              </div>
              <p className="text-sm text-gray-500">
                Erzeugt professionelle, SEO-optimierte Produktbeschreibungen (~$0.01-0.02 pro Produkt)
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options.fetchImages}
              onChange={(e) => setOptions(prev => ({ ...prev, fetchImages: e.target.checked }))}
              className="mt-1 w-4 h-4 text-blue-600 rounded"
              disabled={status.running}
            />
            <div>
              <div className="flex items-center gap-2">
                <Image size={18} className="text-green-500" />
                <span className="font-medium">Produktbilder automatisch suchen</span>
              </div>
              <p className="text-sm text-gray-500">
                Sucht Bilder per EAN über DuckDuckGo (kostenlos, aber langsamer)
              </p>
            </div>
          </label>
        </div>

        {options.generateDescriptions && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2 text-amber-800 text-sm">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <div>
                <strong>Hinweis:</strong> Stellen Sie sicher, dass OPENAI_API_KEY in der .env Datei konfiguriert ist.
                Geschätzte Kosten für {uploadResult?.totalRows || '30.000'} Produkte: ~$300-600 (GPT-4)
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step 4: Start Import */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold">4</div>
          <h2 className="text-lg font-semibold">Import starten</h2>
        </div>

        {status.running ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Fortschritt</span>
              <span className="font-medium">{status.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-green-500 h-4 rounded-full transition-all duration-300"
                style={{ width: `${status.progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{status.processed} erfolgreich / {status.failed} fehlgeschlagen</span>
              <span>{status.totalRows} gesamt</span>
            </div>

            <button
              onClick={handleAbort}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Abbrechen
            </button>
          </div>
        ) : status.completed ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-700">
              <Check size={20} />
              <span className="font-medium">
                Import abgeschlossen! {status.processed} Produkte erfolgreich importiert.
              </span>
            </div>
            {status.failed > 0 && (
              <p className="mt-2 text-sm text-orange-600">
                {status.failed} Produkte konnten nicht importiert werden.
              </p>
            )}
          </div>
        ) : (
          <button
            onClick={handleStartImport}
            disabled={!uploadResult}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play size={18} />
            Import starten ({uploadResult?.totalRows || 0} Produkte)
          </button>
        )}

        {status.errors.length > 0 && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="font-medium text-red-700 mb-2">Letzte Fehler:</p>
            <ul className="text-sm text-red-600 space-y-1">
              {status.errors.map((error, idx) => (
                <li key={idx}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold mb-3">Erwartete Spalten in der Excel-Datei:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>Product Number</strong> → SKU (Pflichtfeld)</li>
          <li>• <strong>Product Barcode</strong> → EAN</li>
          <li>• <strong>Product Title4</strong> → Produktname (Pflichtfeld)</li>
          <li>• <strong>Product Brand Name</strong> → Hersteller</li>
          <li>• <strong>Product Group Name</strong> → Kategorie</li>
          <li>• <strong>Stock Count</strong> → Lagerbestand</li>
          <li>• <strong>MOQ</strong> → Mindestbestellmenge</li>
          <li>• <strong>Retail Price</strong> → Preis</li>
          <li>• <strong>VAT Rate Percentage</strong> → MwSt.</li>
        </ul>
      </div>
    </div>
  );
}
