'use client';

import { useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, Check, Loader2, Download } from 'lucide-react';
import toast from 'react-hot-toast';

type ImportType = 'products' | 'categories' | 'customers';

interface ImportResult {
  success: boolean;
  imported: number;
  updated: number;
  errors: string[];
}

export default function ImportPage() {
  const [importType, setImportType] = useState<ImportType>('products');
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.xlsx')) {
        toast.error('Bitte wählen Sie eine CSV oder Excel-Datei');
        return;
      }
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Bitte wählen Sie eine Datei aus');
      return;
    }

    setImporting(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', importType);

      const res = await fetch('/api/admin/import', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Import fehlgeschlagen');
      }

      setResult(data);
      if (data.success) {
        toast.success(`${data.imported} Datensätze importiert, ${data.updated} aktualisiert`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Import fehlgeschlagen');
      setResult({
        success: false,
        imported: 0,
        updated: 0,
        errors: [error.message],
      });
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    let csvContent = '';
    let filename = '';

    if (importType === 'products') {
      csvContent = 'sku,ean,name,shortDescription,description,manufacturer,basePrice,taxRate,stockQuantity,categorySlug,isActive\n';
      csvContent += 'SKU-001,4012345678901,Beispielprodukt,Kurze Beschreibung,Lange Beschreibung,Hersteller,9.99,19,100,papier,true\n';
      filename = 'produkte-vorlage.csv';
    } else if (importType === 'categories') {
      csvContent = 'name,slug,description,parentSlug,sortOrder,isActive\n';
      csvContent += 'Papier,papier,Alle Papierprodukte,,1,true\n';
      csvContent += 'Kopierpapier,kopierpapier,Kopierpapier für Büro,papier,1,true\n';
      filename = 'kategorien-vorlage.csv';
    } else if (importType === 'customers') {
      csvContent = 'email,firstName,lastName,companyName,phone,billingStreet,billingCity,billingPostalCode\n';
      csvContent += 'max@beispiel.de,Max,Mustermann,Musterfirma GmbH,+49123456789,Musterstraße 1,Berlin,10115\n';
      filename = 'kunden-vorlage.csv';
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Datenimport</h1>
        <p className="text-gray-600">Importieren Sie Produkte, Kategorien oder Kunden aus CSV-Dateien</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Import-Typ auswählen</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setImportType('products')}
            className={`flex-1 p-4 border rounded-lg transition-colors ${
              importType === 'products'
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <FileSpreadsheet className="mx-auto mb-2" size={24} />
            <p className="font-medium">Produkte</p>
          </button>
          <button
            onClick={() => setImportType('categories')}
            className={`flex-1 p-4 border rounded-lg transition-colors ${
              importType === 'categories'
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <FileSpreadsheet className="mx-auto mb-2" size={24} />
            <p className="font-medium">Kategorien</p>
          </button>
          <button
            onClick={() => setImportType('customers')}
            className={`flex-1 p-4 border rounded-lg transition-colors ${
              importType === 'customers'
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <FileSpreadsheet className="mx-auto mb-2" size={24} />
            <p className="font-medium">Kunden</p>
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Datei hochladen</h2>
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
          >
            <Download size={16} />
            Vorlage herunterladen
          </button>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input
            type="file"
            id="file-input"
            accept=".csv,.xlsx"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="file-input" className="cursor-pointer">
            {file ? (
              <>
                <Check size={40} className="mx-auto mb-2 text-green-500" />
                <p className="font-medium text-green-700">{file.name}</p>
                <p className="text-sm text-green-600 mt-1">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </>
            ) : (
              <>
                <Upload size={40} className="mx-auto mb-2 text-gray-400" />
                <p className="font-medium text-gray-700">
                  Klicken Sie hier oder ziehen Sie eine Datei
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  CSV oder Excel-Dateien (.csv, .xlsx)
                </p>
              </>
            )}
          </label>
        </div>

        <button
          onClick={handleImport}
          disabled={!file || importing}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {importing ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Importiere...
            </>
          ) : (
            <>
              <Upload size={20} />
              Import starten
            </>
          )}
        </button>
      </div>

      {result && (
        <div
          className={`border rounded-lg p-6 ${
            result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
          }`}
        >
          <div className="flex items-start gap-3">
            {result.success ? (
              <Check className="text-green-500 flex-shrink-0" size={24} />
            ) : (
              <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
            )}
            <div>
              <h3 className={`font-semibold ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                {result.success ? 'Import erfolgreich' : 'Import fehlgeschlagen'}
              </h3>
              {result.success && (
                <p className="text-green-600 mt-1">
                  {result.imported} Datensätze importiert, {result.updated} aktualisiert
                </p>
              )}
              {result.errors.length > 0 && (
                <ul className="mt-2 text-sm text-red-600 list-disc list-inside">
                  {result.errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-amber-500 flex-shrink-0" size={20} />
          <div className="text-sm text-amber-800">
            <p className="font-medium">Hinweise zum Import:</p>
            <ul className="mt-1 list-disc list-inside space-y-1">
              <li>Die erste Zeile muss die Spaltenüberschriften enthalten</li>
              <li>Bei Produkten: SKU ist das eindeutige Identifikationsmerkmal</li>
              <li>Bestehende Datensätze werden aktualisiert (basierend auf SKU/Slug/Email)</li>
              <li>Leere Felder werden nicht überschrieben</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
