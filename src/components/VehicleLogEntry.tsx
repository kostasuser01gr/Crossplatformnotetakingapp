import { useState, useRef } from 'react';
import { X, Camera, Upload, Calendar, DollarSign, Fuel, User, FileText, Clock } from 'lucide-react';
import { Vehicle, VehicleLog, LogType } from './vehicle-data';
import { usePhotos, Photo } from './PhotoContext';
import { addWatermarkToImage } from './watermark-utils';

type Language = 'en' | 'el';

const translations = {
  en: {
    addLogEntry: 'Add Log Entry',
    logType: 'Log Type',
    cleaning: 'Cleaning',
    maintenance: 'Maintenance',
    inspection: 'Inspection',
    damage: 'Damage Report',
    fuel: 'Fuel',
    transfer: 'Transfer',
    other: 'Other',
    dateTime: 'Date & Time',
    notes: 'Notes',
    notesPlaceholder: 'Enter detailed notes about this activity...',
    mileage: 'Current Mileage',
    km: 'km',
    addPhotos: 'Add Photos',
    uploadPhotos: 'Upload Photos',
    additionalDetails: 'Additional Details',
    cost: 'Cost (€)',
    transferFrom: 'Transfer From',
    transferTo: 'Transfer To',
    fuelLevel: 'Fuel Level (%)',
    maintenanceType: 'Maintenance Type',
    damageDescription: 'Damage Description',
    save: 'Save Log Entry',
    cancel: 'Cancel',
    user: 'Logged by',
    required: 'Required',
  },
  el: {
    addLogEntry: 'Προσθήκη Καταχώρησης',
    logType: 'Τύπος',
    cleaning: 'Καθαρισμός',
    maintenance: 'Συντήρηση',
    inspection: 'Επιθεώρηση',
    damage: 'Αναφορά Ζημιάς',
    fuel: 'Καύσιμα',
    transfer: 'Μεταφορά',
    other: 'Άλλο',
    dateTime: 'Ημερομηνία & Ώρα',
    notes: 'Σημειώσεις',
    notesPlaceholder: 'Εισάγετε λεπτομερείς σημειώσεις για αυτή τη δραστηριότητα...',
    mileage: 'Τρέχοντα Χιλιόμετρα',
    km: 'χλμ',
    addPhotos: 'Προσθήκη Φωτογραφιών',
    uploadPhotos: 'Μεταφόρτωση',
    additionalDetails: 'Επιπλέον Λεπτομέρειες',
    cost: 'Κόστος (€)',
    transferFrom: 'Μεταφορά Από',
    transferTo: 'Μεταφορά Προς',
    fuelLevel: 'Επίπεδο Καυσίμου (%)',
    maintenanceType: 'Τύπος Συντήρησης',
    damageDescription: 'Περιγραφή Ζημιάς',
    save: 'Αποθήκευση',
    cancel: 'Ακύρωση',
    user: 'Καταχωρήθηκε από',
    required: 'Υποχρεωτικό',
  }
};

interface Props {
  vehicle: Vehicle;
  language: Language;
  useColors: boolean;
  initialLogType?: LogType | null;
  onClose: () => void;
  onSave: (log: Omit<VehicleLog, 'id'>) => void;
}

export function VehicleLogEntry({ vehicle, language, useColors, initialLogType, onClose, onSave }: Props) {
  const t = translations[language];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addPhotos } = usePhotos();
  
  const [logType, setLogType] = useState<LogType>(initialLogType || 'other');
  const [dateTime, setDateTime] = useState(new Date().toISOString().slice(0, 16));
  const [notes, setNotes] = useState('');
  const [mileage, setMileage] = useState(vehicle.mileage.toString());
  const [photos, setPhotos] = useState<string[]>([]);
  const [isProcessingPhotos, setIsProcessingPhotos] = useState(false);
  
  // Additional fields
  const [cost, setCost] = useState('');
  const [fuelLevel, setFuelLevel] = useState('100');
  const [maintenanceType, setMaintenanceType] = useState('');
  const [damageDescription, setDamageDescription] = useState('');
  const [transferFrom, setTransferFrom] = useState('');
  const [transferTo, setTransferTo] = useState('');

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingPhotos(true);

    try {
      const timestamp = new Date(dateTime).toISOString();
      const watermarkedPhotos: string[] = [];

      for (const file of Array.from(files)) {
        try {
          const watermarkedUrl = await addWatermarkToImage(file, timestamp, vehicle.plate);
          watermarkedPhotos.push(watermarkedUrl);
        } catch (error) {
          console.error('Error adding watermark:', error);
          // Fallback to original image if watermarking fails
          watermarkedPhotos.push(URL.createObjectURL(file));
        }
      }

      setPhotos([...photos, ...watermarkedPhotos]);
    } catch (error) {
      console.error('Error processing photos:', error);
    } finally {
      setIsProcessingPhotos(false);
    }
  };

  const handleSave = () => {
    if (!notes.trim()) {
      alert(language === 'en' ? 'Please enter notes' : 'Παρακαλώ εισάγετε σημειώσεις');
      return;
    }

    const metadata: VehicleLog['metadata'] = {};

    // Add relevant metadata based on log type
    if ((logType === 'maintenance' || logType === 'cleaning') && cost) {
      metadata.cost = parseFloat(cost);
    }

    if (logType === 'maintenance' && maintenanceType) {
      metadata.maintenanceType = maintenanceType;
    }

    if (logType === 'fuel') {
      metadata.fuelLevel = parseInt(fuelLevel);
      metadata.cost = cost ? parseFloat(cost) : undefined;
    }

    if (logType === 'damage' && damageDescription) {
      metadata.damageDescription = damageDescription;
    }

    if (logType === 'transfer') {
      metadata.transferFrom = transferFrom;
      metadata.transferTo = transferTo;
    }

    const timestamp = new Date(dateTime).toISOString();

    const newLog: Omit<VehicleLog, 'id'> = {
      type: logType,
      timestamp,
      user: 'Current User',
      notes,
      mileage: parseInt(mileage) || undefined,
      photos: photos.length > 0 ? photos : undefined,
      metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
    };

    // Add photos to global photo gallery
    if (photos.length > 0) {
      const photoObjects: Photo[] = photos.map((url, index) => ({
        id: `${vehicle.id}-${Date.now()}-${index}`,
        url,
        vehicleId: vehicle.id,
        vehiclePlate: vehicle.plate,
        timestamp,
        logType,
        notes,
        mileage: parseInt(mileage) || undefined,
        company: vehicle.company,
      }));
      addPhotos(photoObjects);
    }

    onSave(newLog);
  };

  const logTypes: { value: LogType; label: string }[] = [
    { value: 'cleaning', label: t.cleaning },
    { value: 'maintenance', label: t.maintenance },
    { value: 'inspection', label: t.inspection },
    { value: 'damage', label: t.damage },
    { value: 'fuel', label: t.fuel },
    { value: 'transfer', label: t.transfer },
    { value: 'other', label: t.other },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white max-w-3xl w-full my-8" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="border-b border-gray-300 p-4 flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h2>{t.addLogEntry}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {vehicle.plate} - {vehicle.make} {vehicle.model}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 border border-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Log Type */}
          <div>
            <label className="block mb-2">{t.logType} <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {logTypes.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setLogType(value)}
                  className={`px-3 py-2 border text-sm transition-colors ${
                    logType === value
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                {t.dateTime}
              </label>
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label className="block mb-2">{t.mileage}</label>
              <div className="relative">
                <input
                  type="number"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {t.km}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              {t.notes} <span className="text-red-500">*</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder={t.notesPlaceholder}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
            />
          </div>

          {/* Photos */}
          <div>
            <label className="block mb-2">
              <Camera className="w-4 h-4 inline mr-1" />
              {t.addPhotos}
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessingPhotos}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessingPhotos ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  {t.uploadPhotos}
                </>
              )}
            </button>
            
            {photos.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {photos.map((photo, index) => (
                  <div key={index} className="relative aspect-square border border-gray-300">
                    <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                      className="absolute top-1 right-1 p-1 bg-white border border-gray-300 hover:bg-gray-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Details based on log type */}
          {(logType === 'maintenance' || logType === 'fuel' || logType === 'damage' || logType === 'transfer' || logType === 'cleaning') && (
            <div className="border-t border-gray-300 pt-6">
              <h3 className="mb-4">{t.additionalDetails}</h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Maintenance specific */}
                {logType === 'maintenance' && (
                  <>
                    <div>
                      <label className="block mb-2">{t.maintenanceType}</label>
                      <input
                        type="text"
                        value={maintenanceType}
                        onChange={(e) => setMaintenanceType(e.target.value)}
                        placeholder="Oil change, tire rotation, etc."
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">
                        <DollarSign className="w-4 h-4 inline mr-1" />
                        {t.cost}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
                      />
                    </div>
                  </>
                )}

                {/* Cleaning cost */}
                {logType === 'cleaning' && (
                  <div>
                    <label className="block mb-2">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      {t.cost}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
                    />
                  </div>
                )}

                {/* Fuel specific */}
                {logType === 'fuel' && (
                  <>
                    <div>
                      <label className="block mb-2">
                        <Fuel className="w-4 h-4 inline mr-1" />
                        {t.fuelLevel}
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={fuelLevel}
                        onChange={(e) => setFuelLevel(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">
                        <DollarSign className="w-4 h-4 inline mr-1" />
                        {t.cost}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
                      />
                    </div>
                  </>
                )}

                {/* Return specific */}
                {logType === 'return' && (
                  <div>
                    <label className="block mb-2">
                      <Fuel className="w-4 h-4 inline mr-1" />
                      {t.fuelLevel}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={fuelLevel}
                      onChange={(e) => setFuelLevel(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
                    />
                  </div>
                )}

                {/* Damage specific */}
                {logType === 'damage' && (
                  <div className="sm:col-span-2">
                    <label className="block mb-2">{t.damageDescription}</label>
                    <textarea
                      value={damageDescription}
                      onChange={(e) => setDamageDescription(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-300 p-4 flex gap-3 justify-end sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
          >
            {t.save}
          </button>
        </div>
      </div>
    </div>
  );
}
