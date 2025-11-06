import { useState } from 'react';
import { Palette, Globe, Bell, Shield, Download, Upload, Smartphone, Wifi, Database } from 'lucide-react';

type Language = 'en' | 'el';

const translations = {
  en: {
    title: 'Settings & Preferences',
    appearance: 'Appearance',
    useColors: 'Enable Colors & Highlights',
    colorDescription: 'Add visual colors to status indicators and highlights',
    language: 'Language',
    languageDescription: 'Choose your preferred language',
    english: 'English',
    greek: 'Greek (Ελληνικά)',
    notifications: 'Notifications',
    enableNotifications: 'Enable Notifications',
    notificationDescription: 'Receive alerts for new inspections, messages, and calendar events',
    dataManagement: 'Data Management',
    exportData: 'Export Data',
    exportDescription: 'Download all your data as JSON',
    importData: 'Import Data',
    importDescription: 'Upload previously exported data',
    clearData: 'Clear All Data',
    clearDescription: 'Remove all local data (cannot be undone)',
    connectivity: 'Connectivity',
    nfcStatus: 'NFC Status',
    nfcEnabled: 'NFC Enabled',
    nfcDisabled: 'NFC Disabled',
    offlineMode: 'Offline Mode',
    offlineDescription: 'Work without internet connection',
    cloudSync: 'Cloud Sync',
    cloudDescription: 'Sync data across devices (requires Supabase)',
    security: 'Security',
    requireAuth: 'Require Authentication',
    authDescription: 'Secure app with password or biometric',
    dataEncryption: 'Data Encryption',
    encryptionDescription: 'Encrypt local data storage',
    about: 'About',
    version: 'Version 1.0.0',
    platform: 'Web Application',
    devices: 'Optimized for all devices and platforms',
  },
  el: {
    title: 'Ρυθμίσεις & Προτιμήσεις',
    appearance: 'Εμφάνιση',
    useColors: 'Ενεργοποίηση Χρωμάτων',
    colorDescription: 'Προσθήκη χρωμάτων σε δείκτες κατάστασης',
    language: 'Γλώσσα',
    languageDescription: 'Επιλέξτε την προτιμώμενη γλώσσα',
    english: 'Αγγλικά (English)',
    greek: 'Ελληνικά',
    notifications: 'Ειδοποιήσεις',
    enableNotifications: 'Ενεργοποίηση Ειδοποιήσεων',
    notificationDescription: 'Λήψη ειδοποιήσεων για επιθεωρήσεις, μηνύματα και γεγονότα',
    dataManagement: 'Διαχείριση Δεδομένων',
    exportData: 'Εξαγωγή Δεδομένων',
    exportDescription: 'Λήψη όλων των δεδομένων σας ως JSON',
    importData: 'Εισαγωγή Δεδομένων',
    importDescription: 'Μεταφόρτωση προηγούμενων δεδομένων',
    clearData: 'Διαγραφή Όλων',
    clearDescription: 'Αφαίρεση όλων των τοπικών δεδομένων (μόνιμο)',
    connectivity: 'Συνδεσιμότητα',
    nfcStatus: 'Κατάσταση NFC',
    nfcEnabled: 'NFC Ενεργό',
    nfcDisabled: 'NFC Ανενεργό',
    offlineMode: 'Λειτουργία Εκτός Σύνδεσης',
    offlineDescription: 'Εργασία χωρίς σύνδεση στο διαδίκτυο',
    cloudSync: 'Συγχρονισμός Cloud',
    cloudDescription: 'Συγχρονισμός δεδομένων μεταξύ συσκευών (απαιτεί Supabase)',
    security: 'Ασφάλεια',
    requireAuth: 'Απαίτηση Ταυτοποίησης',
    authDescription: 'Ασφάλεια εφαρμογής με κωδικό ή βιομετρικά',
    dataEncryption: 'Κρυπτογράφηση Δεδομένων',
    encryptionDescription: 'Κρυπτογράφηση τοπικής αποθήκευσης',
    about: 'Σχετικά',
    version: 'Έκδοση 1.0.0',
    platform: 'Διαδικτυακή Εφαρμογή',
    devices: 'Βελτιστοποιημένο για όλες τις συσκευές',
  }
};

interface Props {
  language: Language;
  useColors: boolean;
  onToggleColors: () => void;
}

export function SettingsPanel({ language, useColors, onToggleColors }: Props) {
  const t = translations[language];
  const [notifications, setNotifications] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [cloudSync, setCloudSync] = useState(false);
  const [requireAuth, setRequireAuth] = useState(false);
  const [dataEncryption, setDataEncryption] = useState(false);
  const [nfcAvailable] = useState('NDEFReader' in window);

  const handleExportData = () => {
    const data = {
      settings: {
        language,
        useColors,
        notifications,
        offlineMode,
        cloudSync,
        requireAuth,
        dataEncryption
      },
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `car-rental-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (confirm(language === 'en' 
      ? 'Are you sure you want to clear all data? This cannot be undone.' 
      : 'Είστε σίγουροι ότι θέλετε να διαγράψετε όλα τα δεδομένα; Αυτό δεν μπορεί να αναιρεθεί.')) {
      localStorage.clear();
      alert(language === 'en' ? 'All data cleared' : 'Όλα τα δεδομένα διαγράφηκαν');
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <h2>{t.title}</h2>

      {/* Appearance */}
      <div className="border border-gray-300 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5" />
          <h3>{t.appearance}</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p>{t.useColors}</p>
              <p className="text-sm text-gray-600 mt-1">{t.colorDescription}</p>
            </div>
            <button
              onClick={onToggleColors}
              className={`relative w-12 h-6 border-2 transition-colors ${
                useColors 
                  ? 'bg-black border-black' 
                  : 'bg-gray-200 border-gray-300'
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 bg-white transition-transform ${
                  useColors ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Language */}
      <div className="border border-gray-300 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5" />
          <h3>{t.language}</h3>
        </div>

        <p className="text-sm text-gray-600 mb-3">{t.languageDescription}</p>

        <div className="flex gap-2">
          <button className="flex-1 px-4 py-3 border border-gray-300 bg-white hover:bg-gray-50 transition-colors text-left">
            <p>{t.english}</p>
            <p className="text-sm text-gray-600">English</p>
          </button>
          
          <button className="flex-1 px-4 py-3 border border-gray-300 bg-white hover:bg-gray-50 transition-colors text-left">
            <p>{t.greek}</p>
            <p className="text-sm text-gray-600">Ελληνικά</p>
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="border border-gray-300 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5" />
          <h3>{t.notifications}</h3>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p>{t.enableNotifications}</p>
            <p className="text-sm text-gray-600 mt-1">{t.notificationDescription}</p>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`relative w-12 h-6 border-2 transition-colors ${
              notifications 
                ? 'bg-black border-black' 
                : 'bg-gray-200 border-gray-300'
            }`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 bg-white transition-transform ${
                notifications ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="border border-gray-300 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5" />
          <h3>{t.dataManagement}</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-gray-300 bg-gray-50">
            <div className="flex-1">
              <p>{t.exportData}</p>
              <p className="text-sm text-gray-600 mt-1">{t.exportDescription}</p>
            </div>
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-100 transition-colors ml-4"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          <div className="flex items-center justify-between p-3 border border-gray-300 bg-gray-50">
            <div className="flex-1">
              <p>{t.importData}</p>
              <p className="text-sm text-gray-600 mt-1">{t.importDescription}</p>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-100 transition-colors ml-4"
            >
              <Upload className="w-4 h-4" />
              Import
            </button>
          </div>

          <div className="flex items-center justify-between p-3 border border-gray-300 bg-gray-50">
            <div className="flex-1">
              <p>{t.clearData}</p>
              <p className="text-sm text-gray-600 mt-1">{t.clearDescription}</p>
            </div>
            <button
              onClick={handleClearData}
              className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-100 transition-colors ml-4"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Connectivity */}
      <div className="border border-gray-300 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Wifi className="w-5 h-5" />
          <h3>{t.connectivity}</h3>
        </div>

        <div className="space-y-4">
          <div className="p-3 border border-gray-300 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                <p>{t.nfcStatus}</p>
              </div>
              <span className={`px-3 py-1 text-sm border ${
                nfcAvailable 
                  ? useColors ? 'bg-green-100 border-green-500 text-green-800' : 'bg-gray-200 border-gray-500'
                  : 'bg-gray-100 border-gray-400 text-gray-600'
              }`}>
                {nfcAvailable ? t.nfcEnabled : t.nfcDisabled}
              </span>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p>{t.offlineMode}</p>
              <p className="text-sm text-gray-600 mt-1">{t.offlineDescription}</p>
            </div>
            <button
              onClick={() => setOfflineMode(!offlineMode)}
              className={`relative w-12 h-6 border-2 transition-colors ${
                offlineMode 
                  ? 'bg-black border-black' 
                  : 'bg-gray-200 border-gray-300'
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 bg-white transition-transform ${
                  offlineMode ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p>{t.cloudSync}</p>
              <p className="text-sm text-gray-600 mt-1">{t.cloudDescription}</p>
            </div>
            <button
              onClick={() => setCloudSync(!cloudSync)}
              className={`relative w-12 h-6 border-2 transition-colors ${
                cloudSync 
                  ? 'bg-black border-black' 
                  : 'bg-gray-200 border-gray-300'
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 bg-white transition-transform ${
                  cloudSync ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="border border-gray-300 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5" />
          <h3>{t.security}</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p>{t.requireAuth}</p>
              <p className="text-sm text-gray-600 mt-1">{t.authDescription}</p>
            </div>
            <button
              onClick={() => setRequireAuth(!requireAuth)}
              className={`relative w-12 h-6 border-2 transition-colors ${
                requireAuth 
                  ? 'bg-black border-black' 
                  : 'bg-gray-200 border-gray-300'
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 bg-white transition-transform ${
                  requireAuth ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p>{t.dataEncryption}</p>
              <p className="text-sm text-gray-600 mt-1">{t.encryptionDescription}</p>
            </div>
            <button
              onClick={() => setDataEncryption(!dataEncryption)}
              className={`relative w-12 h-6 border-2 transition-colors ${
                dataEncryption 
                  ? 'bg-black border-black' 
                  : 'bg-gray-200 border-gray-300'
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 bg-white transition-transform ${
                  dataEncryption ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="border border-gray-300 p-6">
        <h3 className="mb-4">{t.about}</h3>
        
        <div className="space-y-2 text-gray-600">
          <p>{t.version}</p>
          <p>{t.platform}</p>
          <p>{t.devices}</p>
        </div>
      </div>
    </div>
  );
}
