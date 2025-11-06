import { useState, useRef } from 'react';
import { Upload, X, FileSpreadsheet, AlertCircle, CheckCircle, Download, ArrowRight } from 'lucide-react';
import { Company, ExcelMapping } from './vehicle-data';

type Language = 'en' | 'el';

const translations = {
  en: {
    title: 'Import Fleet Data',
    selectCompany: 'Select Company',
    europcar: 'Europcar',
    goldcar: 'Goldcar',
    uploadFile: 'Upload Excel File',
    dragDrop: 'Drag and drop your Excel file here',
    or: 'or',
    browse: 'Browse Files',
    supportedFormats: 'Supported formats: .xlsx, .xls, .csv',
    analyzing: 'Analyzing file...',
    mapColumns: 'Map Excel Columns to System Fields',
    excelColumn: 'Excel Column',
    systemField: 'System Field',
    preview: 'Preview',
    required: 'Required',
    optional: 'Optional',
    plate: 'License Plate',
    vin: 'VIN',
    make: 'Make',
    model: 'Model',
    year: 'Year',
    color: 'Color',
    mileage: 'Mileage',
    location: 'Location',
    status: 'Status',
    selectColumn: 'Select column...',
    skip: 'Skip this field',
    import: 'Import Vehicles',
    cancel: 'Cancel',
    success: 'Successfully imported',
    vehicles: 'vehicles',
    error: 'Error importing file',
    downloading: 'Downloading template...',
    downloadTemplate: 'Download Template',
    templateDescription: 'Download a pre-formatted Excel template for easy data entry',
    instructions: 'Instructions',
    step1: '1. Download the Excel template',
    step2: '2. Fill in your vehicle data',
    step3: '3. Upload the completed file',
    step4: '4. Map columns if needed',
    step5: '5. Review and import',
  },
  el: {
    title: 'Εισαγωγή Δεδομένων Στόλου',
    selectCompany: 'Επιλογή Εταιρείας',
    europcar: 'Europcar',
    goldcar: 'Goldcar',
    uploadFile: 'Μεταφόρτωση Excel',
    dragDrop: 'Σύρετε και αποθέστε το αρχείο Excel εδώ',
    or: 'ή',
    browse: 'Αναζήτηση Αρχείων',
    supportedFormats: 'Υποστηριζόμενες μορφές: .xlsx, .xls, .csv',
    analyzing: 'Ανάλυση αρχείου...',
    mapColumns: 'Αντιστοίχιση Στηλών Excel',
    excelColumn: 'Στήλη Excel',
    systemField: 'Πεδίο Συστήματος',
    preview: 'Προεπισκόπηση',
    required: 'Υποχρεωτικό',
    optional: 'Προαιρετικό',
    plate: 'Πινακίδα',
    vin: 'VIN',
    make: 'Κατασκευαστής',
    model: 'Μοντέλο',
    year: 'Έτος',
    color: 'Χρώμα',
    mileage: 'Χιλιόμετρα',
    location: 'Τοποθεσία',
    status: 'Κατάσταση',
    selectColumn: 'Επιλέξτε στήλη...',
    skip: 'Παράλειψη πεδίου',
    import: 'Εισαγωγή Οχημάτων',
    cancel: 'Ακύρωση',
    success: 'Επιτυχής εισαγωγή',
    vehicles: 'οχημάτων',
    error: 'Σφάλμα εισαγωγής αρχείου',
    downloading: 'Λήψη προτύπου...',
    downloadTemplate: 'Λήψη Προτύπου',
    templateDescription: 'Λήψη προδιαμορφωμένου προτύπου Excel για εύκολη καταχώρηση',
    instructions: 'Οδηγίες',
    step1: '1. Λήψη προτύπου Excel',
    step2: '2. Συμπληρώστε τα δεδομένα',
    step3: '3. Μεταφορτώστε το αρχείο',
    step4: '4. Αντιστοιχίστε στήλες',
    step5: '5. Έλεγχος και εισαγωγή',
  }
};

interface Props {
  language: Language;
  onClose: () => void;
  onImport: (vehicles: any[], company: Company) => void;
}

interface ParsedData {
  headers: string[];
  rows: string[][];
}

export function ExcelImport({ language, onClose, onImport }: Props) {
  const t = translations[language];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company>('europcar');
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [mapping, setMapping] = useState<ExcelMapping>({});
  const [dragOver, setDragOver] = useState(false);

  const systemFields = [
    { key: 'plate', label: t.plate, required: true },
    { key: 'vin', label: t.vin, required: true },
    { key: 'make', label: t.make, required: true },
    { key: 'model', label: t.model, required: true },
    { key: 'year', label: t.year, required: false },
    { key: 'color', label: t.color, required: false },
    { key: 'mileage', label: t.mileage, required: false },
    { key: 'location', label: t.location, required: false },
    { key: 'status', label: t.status, required: false },
  ];

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setAnalyzing(true);

    // Simulate file parsing (in real app, use a library like xlsx or papaparse)
    setTimeout(() => {
      // Mock parsed data
      const mockHeaders = ['License Plate', 'VIN Number', 'Make', 'Model', 'Year', 'Color', 'Mileage (km)', 'Location', 'Status'];
      const mockRows = [
        ['ABC-1234', 'VIN2020TOY00001', 'Toyota', 'Corolla', '2020', 'White', '45000', 'Main Office', 'Available'],
        ['XYZ-5678', 'VIN2021BMW00002', 'BMW', '3 Series', '2021', 'Black', '32000', 'Airport', 'Available'],
        ['DEF-9012', 'VIN2019MER00003', 'Mercedes', 'C-Class', '2019', 'Silver', '67000', 'Downtown', 'Maintenance'],
      ];

      setParsedData({ headers: mockHeaders, rows: mockRows });
      
      // Auto-map common column names
      const autoMapping: ExcelMapping = {};
      mockHeaders.forEach((header, index) => {
        const lowerHeader = header.toLowerCase();
        if (lowerHeader.includes('plate') || lowerHeader.includes('license')) {
          autoMapping.plate = header;
        } else if (lowerHeader.includes('vin')) {
          autoMapping.vin = header;
        } else if (lowerHeader === 'make' || lowerHeader === 'manufacturer') {
          autoMapping.make = header;
        } else if (lowerHeader === 'model') {
          autoMapping.model = header;
        } else if (lowerHeader === 'year') {
          autoMapping.year = header;
        } else if (lowerHeader === 'color' || lowerHeader === 'colour') {
          autoMapping.color = header;
        } else if (lowerHeader.includes('mileage') || lowerHeader.includes('km')) {
          autoMapping.mileage = header;
        } else if (lowerHeader === 'location') {
          autoMapping.location = header;
        } else if (lowerHeader === 'status') {
          autoMapping.status = header;
        }
      });
      
      setMapping(autoMapping);
      setAnalyzing(false);
    }, 1500);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls') || droppedFile.name.endsWith('.csv'))) {
      handleFileSelect(droppedFile);
    }
  };

  const handleImport = () => {
    if (!parsedData) return;

    // Validate required mappings
    const requiredFields = systemFields.filter(f => f.required).map(f => f.key);
    const missingFields = requiredFields.filter(key => !mapping[key as keyof ExcelMapping]);
    
    if (missingFields.length > 0) {
      alert(`${t.error}: Missing required fields - ${missingFields.join(', ')}`);
      return;
    }

    // Transform data based on mapping
    const vehicles = parsedData.rows.map((row, index) => {
      const vehicle: any = {
        id: `import-${Date.now()}-${index}`,
        company: selectedCompany,
      };

      Object.entries(mapping).forEach(([systemKey, excelColumn]) => {
        if (excelColumn) {
          const columnIndex = parsedData.headers.indexOf(excelColumn);
          if (columnIndex !== -1) {
            vehicle[systemKey] = row[columnIndex];
          }
        }
      });

      // Set defaults
      vehicle.logs = [];
      vehicle.images = [];
      vehicle.notes = '';
      vehicle.status = vehicle.status || 'available';
      vehicle.mileage = parseInt(vehicle.mileage) || 0;
      vehicle.year = parseInt(vehicle.year) || new Date().getFullYear();

      return vehicle;
    });

    onImport(vehicles, selectedCompany);
    onClose();
  };

  const downloadTemplate = () => {
    // Create CSV template
    const headers = ['License Plate', 'VIN', 'Make', 'Model', 'Year', 'Color', 'Mileage', 'Location', 'Status'];
    const exampleRow = ['ABC-1234', 'VIN2020TOY00001234', 'Toyota', 'Corolla', '2020', 'White', '45000', 'Main Office', 'available'];
    
    const csv = [headers.join(','), exampleRow.join(',')].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedCompany}_vehicle_import_template.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white max-w-5xl w-full my-8" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="border-b border-gray-300 p-6 flex justify-between items-center">
          <h2>{t.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 border border-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Instructions */}
          <div className="bg-gray-50 border border-gray-300 p-4">
            <h3 className="mb-3">{t.instructions}</h3>
            <div className="space-y-1 text-sm">
              <p>{t.step1}</p>
              <p>{t.step2}</p>
              <p>{t.step3}</p>
              <p>{t.step4}</p>
              <p>{t.step5}</p>
            </div>
          </div>

          {/* Company Selection */}
          <div>
            <label className="block mb-3">{t.selectCompany}</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedCompany('europcar')}
                className={`p-4 border-2 transition-all ${
                  selectedCompany === 'europcar'
                    ? 'border-black bg-gray-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-lg mb-1">🚗 {t.europcar}</div>
                <div className="text-xs text-gray-600">Europcar Fleet</div>
              </button>
              
              <button
                onClick={() => setSelectedCompany('goldcar')}
                className={`p-4 border-2 transition-all ${
                  selectedCompany === 'goldcar'
                    ? 'border-black bg-gray-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-lg mb-1">🚙 {t.goldcar}</div>
                <div className="text-xs text-gray-600">Goldcar Fleet</div>
              </button>
            </div>
          </div>

          {/* Template Download */}
          <div className="border border-gray-300 p-4 bg-gray-50">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="mb-2">{t.downloadTemplate}</h3>
                <p className="text-sm text-gray-600">{t.templateDescription}</p>
              </div>
              <button
                onClick={downloadTemplate}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                {t.downloadTemplate}
              </button>
            </div>
          </div>

          {/* File Upload */}
          {!parsedData && (
            <div>
              <label className="block mb-3">{t.uploadFile}</label>
              
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed p-12 text-center transition-colors ${
                  dragOver ? 'border-black bg-gray-50' : 'border-gray-300'
                }`}
              >
                <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                
                {analyzing ? (
                  <div>
                    <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin mb-3" />
                    <p>{t.analyzing}</p>
                  </div>
                ) : (
                  <>
                    <p className="mb-2">{t.dragDrop}</p>
                    <p className="text-sm text-gray-600 mb-4">{t.or}</p>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                      className="hidden"
                    />
                    
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
                    >
                      <Upload className="w-4 h-4 inline mr-2" />
                      {t.browse}
                    </button>
                    
                    <p className="text-xs text-gray-500 mt-4">{t.supportedFormats}</p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Column Mapping */}
          {parsedData && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="mb-1">{t.mapColumns}</h3>
                  <p className="text-sm text-gray-600">
                    {file?.name} - {parsedData.rows.length} {t.vehicles}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setParsedData(null);
                    setMapping({});
                  }}
                  className="text-sm px-3 py-1 border border-gray-300 hover:bg-gray-100"
                >
                  Change File
                </button>
              </div>

              <div className="border border-gray-300">
                <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 border-b border-gray-300">
                  <div className="col-span-4">{t.systemField}</div>
                  <div className="col-span-4">{t.excelColumn}</div>
                  <div className="col-span-4">{t.preview}</div>
                </div>

                {systemFields.map(field => {
                  const selectedColumn = mapping[field.key as keyof ExcelMapping];
                  const columnIndex = selectedColumn ? parsedData.headers.indexOf(selectedColumn) : -1;
                  const previewValue = columnIndex !== -1 ? parsedData.rows[0]?.[columnIndex] : '';

                  return (
                    <div key={field.key} className="grid grid-cols-12 gap-4 p-3 border-b border-gray-300 last:border-b-0 items-center">
                      <div className="col-span-4">
                        <div className="flex items-center gap-2">
                          <span>{field.label}</span>
                          {field.required && (
                            <span className="text-xs px-2 py-0.5 bg-black text-white">
                              {t.required}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="col-span-4">
                        <select
                          value={selectedColumn || ''}
                          onChange={(e) => setMapping({ ...mapping, [field.key]: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
                        >
                          <option value="">{t.skip}</option>
                          {parsedData.headers.map(header => (
                            <option key={header} value={header}>{header}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-4">
                        <div className="px-3 py-2 bg-gray-50 border border-gray-300 text-sm truncate font-mono">
                          {previewValue || '—'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-300 p-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            {t.cancel}
          </button>
          
          {parsedData && (
            <button
              onClick={handleImport}
              className="flex items-center gap-2 px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
            >
              {t.import} ({parsedData.rows.length})
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
