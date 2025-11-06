import { useState, useMemo } from 'react';
import { ArrowLeft, Plus, Calendar, Clock, User, Wrench, Sparkles, Car, AlertCircle, DollarSign, Fuel, Image as ImageIcon, FileText, TrendingUp, Activity } from 'lucide-react';
import { Vehicle, VehicleLog, LogType } from './vehicle-data';
import { useVehicles } from './VehicleContext';
import { VehicleLogEntry } from './VehicleLogEntry';

type Language = 'en' | 'el';

const translations = {
  en: {
    backToDashboard: 'Back to Dashboard',
    addLog: 'Add Log Entry',
    quickActions: 'Quick Actions',
    cleaning: 'Cleaning',
    maintenance: 'Maintenance',
    inspection: 'Inspection',
    fuel: 'Refuel',
    transfer: 'Transfer',
    other: 'Other',
    vehicleInfo: 'Vehicle Information',
    plate: 'License Plate',
    vin: 'VIN',
    make: 'Make',
    model: 'Model',
    year: 'Year',
    color: 'Color',
    mileage: 'Current Mileage',
    status: 'Status',
    location: 'Location',
    km: 'km',
    history: 'Activity History',
    allLogs: 'All Logs',
    today: 'Today',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    filterBy: 'Filter by type',
    noLogs: 'No activity logs yet',
    damage: 'Damage',
    available: 'Available',
    outOfService: 'Out of Service',
    showingLogs: 'Showing',
    of: 'of',
    logs: 'logs',
    notes: 'Notes',
    user: 'User',
    date: 'Date',
    type: 'Type',
    details: 'Details',
    customer: 'Customer',
    days: 'days',
    cost: 'Cost',
    fuelLevel: 'Fuel Level',
  },
  el: {
    backToDashboard: 'Πίσω στον Πίνακα',
    addLog: 'Προσθήκη Καταχώρησης',
    quickActions: 'Γρήγορες Ενέργειες',
    cleaning: 'Καθαρισμός',
    maintenance: 'Συντήρηση',
    inspection: 'Επιθεώρηση',
    fuel: 'Ανεφοδιασμός',
    transfer: 'Μεταφορά',
    other: 'Άλλο',
    vehicleInfo: 'Πληροφορίες Οχήματος',
    plate: 'Πινακίδα',
    vin: 'VIN',
    make: 'Κατασκευαστής',
    model: 'Μοντέλο',
    year: 'Έτος',
    color: 'Χρώμα',
    mileage: 'Τρέχοντα Χιλιόμετρα',
    status: 'Κατάσταση',
    location: 'Τοποθεσία',
    km: 'χλμ',
    history: 'Ιστορικό Δραστηριοτήτων',
    allLogs: 'Όλες',
    today: 'Σήμερα',
    thisWeek: 'Αυτή την Εβδομάδα',
    thisMonth: 'Αυτόν τον Μήνα',
    filterBy: 'Φίλτρο τύπου',
    noLogs: 'Δεν υπάρχουν καταχωρήσεις',
    damage: 'Ζημιά',
    available: 'Διαθέσιμο',
    outOfService: 'Εκτός Λειτουργίας',
    showingLogs: 'Εμφάνιση',
    of: 'από',
    logs: 'καταχωρήσεις',
    notes: 'Σημειώσεις',
    user: 'Χρήστης',
    date: 'Ημερομηνία',
    type: 'Τύπος',
    details: 'Λεπτομέρειες',
    customer: 'Πελάτης',
    days: 'ημέρες',
    cost: 'Κόστος',
    fuelLevel: 'Επίπεδο Καυσίμου',
  }
};

interface Props {
  vehicleId: string;
  language: Language;
  useColors: boolean;
  onBack: () => void;
}

export function VehicleDetail({ vehicleId, language, useColors, onBack }: Props) {
  const t = translations[language];
  const { getVehicleById, addLogToVehicle } = useVehicles();
  const vehicle = getVehicleById(vehicleId);
  const [showLogEntry, setShowLogEntry] = useState(false);
  const [selectedLogType, setSelectedLogType] = useState<LogType | null>(null);
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [typeFilter, setTypeFilter] = useState<LogType | 'all'>('all');

  if (!vehicle) {
    return (
      <div className="p-8 text-center">
        <p>Vehicle not found</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 border border-gray-300 hover:bg-gray-100">
          {t.backToDashboard}
        </button>
      </div>
    );
  }

  const handleQuickAction = (type: LogType) => {
    setSelectedLogType(type);
    setShowLogEntry(true);
  };

  // Filter logs
  const filteredLogs = useMemo(() => {
    let logs = vehicle.logs;

    // Time filter
    const now = new Date();
    if (timeFilter === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      logs = logs.filter(log => new Date(log.timestamp) >= today);
    } else if (timeFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      logs = logs.filter(log => new Date(log.timestamp) >= weekAgo);
    } else if (timeFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      logs = logs.filter(log => new Date(log.timestamp) >= monthAgo);
    }

    // Type filter
    if (typeFilter !== 'all') {
      logs = logs.filter(log => log.type === typeFilter);
    }

    return logs;
  }, [vehicle.logs, timeFilter, typeFilter]);

  const logTypeConfig = {
    cleaning: { icon: Sparkles, label: t.cleaning, color: useColors ? 'bg-purple-100 border-purple-500 text-purple-700' : 'bg-gray-100 border-gray-500' },
    maintenance: { icon: Wrench, label: t.maintenance, color: useColors ? 'bg-orange-100 border-orange-500 text-orange-700' : 'bg-gray-200 border-gray-600' },
    inspection: { icon: FileText, label: t.inspection, color: useColors ? 'bg-yellow-100 border-yellow-500 text-yellow-700' : 'bg-gray-200 border-gray-600' },
    damage: { icon: AlertCircle, label: t.damage, color: useColors ? 'bg-red-100 border-red-500 text-red-700' : 'bg-gray-300 border-gray-700' },
    fuel: { icon: Fuel, label: t.fuel, color: useColors ? 'bg-cyan-100 border-cyan-500 text-cyan-700' : 'bg-gray-100 border-gray-500' },
    transfer: { icon: ArrowLeft, label: t.transfer, color: useColors ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-100 border-gray-600' },
    other: { icon: Activity, label: t.other, color: 'bg-gray-100 border-gray-500' },
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.backToDashboard}
        </button>

        <button
          onClick={() => {
            setSelectedLogType(null);
            setShowLogEntry(true);
          }}
          className="flex items-center gap-2 px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t.addLog}
        </button>
      </div>

      {/* Vehicle Info Card */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Main Info */}
        <div className="md:col-span-2 border border-gray-300 p-6">
          <h2 className="mb-4">{t.vehicleInfo}</h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">{t.plate}</p>
                <div className="inline-block px-4 py-2 bg-black text-white font-mono tracking-wider text-lg">
                  {vehicle.plate}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">{t.make}</p>
                  <p>{vehicle.make}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t.model}</p>
                  <p>{vehicle.model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t.year}</p>
                  <p>{vehicle.year}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">{t.vin}</p>
                <p className="font-mono text-sm">{vehicle.vin}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t.color}</p>
                <p>{vehicle.color}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t.mileage}</p>
                <p className="text-lg">{vehicle.mileage.toLocaleString()} {t.km}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t.location}</p>
                <p>{vehicle.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border border-gray-300 p-6">
          <h3 className="mb-4">{t.quickActions}</h3>
          
          <div className="grid grid-cols-2 gap-2">
            {(['cleaning', 'maintenance', 'inspection', 'fuel', 'transfer', 'damage'] as LogType[]).map(type => {
              const config = logTypeConfig[type];
              const Icon = config.icon;
              
              return (
                <button
                  key={type}
                  onClick={() => handleQuickAction(type)}
                  className="flex flex-col items-center gap-2 p-3 border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs text-center">{config.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Activity History */}
      <div className="border border-gray-300">
        <div className="p-4 bg-gray-50 border-b border-gray-300">
          <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
            <h2>{t.history}</h2>
            
            <div className="flex flex-wrap gap-2">
              {/* Time Filter */}
              <div className="flex gap-1 border border-gray-300 bg-white">
                {(['all', 'today', 'week', 'month'] as const).map(filter => (
                  <button
                    key={filter}
                    onClick={() => setTimeFilter(filter)}
                    className={`px-3 py-1 text-sm transition-colors ${
                      timeFilter === filter ? 'bg-black text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    {filter === 'all' ? t.allLogs : filter === 'today' ? t.today : filter === 'week' ? t.thisWeek : t.thisMonth}
                  </button>
                ))}
              </div>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as LogType | 'all')}
                className="px-3 py-1 text-sm border border-gray-300 bg-white focus:outline-none focus:border-gray-500"
              >
                <option value="all">{t.filterBy}: {t.allLogs}</option>
                {Object.entries(logTypeConfig).map(([type, config]) => (
                  <option key={type} value={type}>{config.label}</option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-sm text-gray-600 mt-2">
            {t.showingLogs} {filteredLogs.length} {t.of} {vehicle.logs.length} {t.logs}
          </p>
        </div>

        {/* Logs List */}
        <div className="divide-y divide-gray-300">
          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              {t.noLogs}
            </div>
          ) : (
            filteredLogs.map(log => {
              const config = logTypeConfig[log.type];
              const Icon = config.icon;
              
              return (
                <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 border ${config.color} flex items-center justify-center`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div>
                          <span className={`inline-block px-2 py-1 text-xs border ${config.color} mb-1`}>
                            {config.label}
                          </span>
                          <p className="text-sm text-gray-600">
                            {new Date(log.timestamp).toLocaleString(language, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        
                        {log.mileage && (
                          <div className="text-sm text-gray-600">
                            <TrendingUp className="w-4 h-4 inline mr-1" />
                            {log.mileage.toLocaleString()} {t.km}
                          </div>
                        )}
                      </div>

                      <p className="mb-2">{log.notes}</p>

                      {/* Metadata */}
                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                          {log.metadata.location && (
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {log.metadata.location}
                            </span>
                          )}
                          {log.metadata.transferFrom && log.metadata.transferTo && (
                            <span className="flex items-center gap-1">
                              <ArrowLeft className="w-3 h-3" />
                              {log.metadata.transferFrom} → {log.metadata.transferTo}
                            </span>
                          )}
                          {log.metadata.cost && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              €{log.metadata.cost}
                            </span>
                          )}
                          {log.metadata.fuelLevel && (
                            <span className="flex items-center gap-1">
                              <Fuel className="w-3 h-3" />
                              {log.metadata.fuelLevel}%
                            </span>
                          )}
                          {log.metadata.maintenanceType && (
                            <span className="flex items-center gap-1">
                              <Wrench className="w-3 h-3" />
                              {log.metadata.maintenanceType}
                            </span>
                          )}
                        </div>
                      )}

                      <p className="text-xs text-gray-500 mt-2">
                        <User className="w-3 h-3 inline mr-1" />
                        {log.user}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Log Entry Modal */}
      {showLogEntry && (
        <VehicleLogEntry
          vehicle={vehicle}
          language={language}
          useColors={useColors}
          initialLogType={selectedLogType}
          onClose={() => {
            setShowLogEntry(false);
            setSelectedLogType(null);
          }}
          onSave={(log) => {
            addLogToVehicle(vehicleId, log);
            setShowLogEntry(false);
            setSelectedLogType(null);
          }}
        />
      )}
    </div>
  );
}
