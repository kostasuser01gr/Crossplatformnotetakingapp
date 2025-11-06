import { useState, useMemo } from 'react';
import { Search, Plus, Filter, Car, AlertCircle, CheckCircle, Clock, Wrench, Sparkles, FileText, Upload, Building2 } from 'lucide-react';
import { Vehicle, VehicleLog, Company } from './vehicle-data';
import { useVehicles } from './VehicleContext';
import { ExcelImport } from './ExcelImport';

type Language = 'en' | 'el';
type FilterStatus = 'all' | 'available' | 'maintenance' | 'cleaning' | 'out-of-service';
type FilterCompany = 'all' | 'europcar' | 'goldcar';

const translations = {
  en: {
    title: 'Vehicle Fleet Dashboard',
    search: 'Search by plate, model, or VIN...',
    addVehicle: 'Add Vehicle',
    importExcel: 'Import Excel',
    filter: 'Filter',
    all: 'All',
    available: 'Available',
    maintenance: 'Maintenance',
    cleaning: 'Cleaning',
    outOfService: 'Out of Service',
    vehicles: 'vehicles',
    lastActivity: 'Last Activity',
    noVehicles: 'No vehicles found',
    quickActions: 'Quick Actions',
    viewDetails: 'View Details',
    status: 'Status',
    plate: 'Plate',
    model: 'Model',
    year: 'Year',
    mileage: 'Mileage',
    km: 'km',
    company: 'Company',
    europcar: 'Europcar',
    goldcar: 'Goldcar',
    allCompanies: 'All Companies',
  },
  el: {
    title: 'Πίνακας Στόλου Οχημάτων',
    search: 'Αναζήτηση με πινακίδα, μοντέλο ή VIN...',
    addVehicle: 'Προσθήκη',
    importExcel: 'Εισαγωγή Excel',
    filter: 'Φίλτρο',
    all: 'Όλα',
    available: 'Διαθέσιμα',
    maintenance: 'Συντήρηση',
    cleaning: 'Καθαρισμός',
    outOfService: 'Εκτός Λειτουργίας',
    vehicles: 'οχήματα',
    lastActivity: 'Τελευταία Δραστηριότητα',
    noVehicles: 'Δεν βρέθηκαν οχήματα',
    quickActions: 'Γρήγορες Ενέργειες',
    viewDetails: 'Λεπτομέρειες',
    status: 'Κατάσταση',
    plate: 'Πινακίδα',
    model: 'Μοντέλο',
    year: 'Έτος',
    mileage: 'Χιλιόμετρα',
    km: 'χλμ',
    company: 'Εταιρεία',
    europcar: 'Europcar',
    goldcar: 'Goldcar',
    allCompanies: 'Όλες οι Εταιρείες',
  }
};

interface Props {
  language: Language;
  useColors: boolean;
  onVehicleSelect: (vehicleId: string) => void;
}

export function VehicleDashboard({ language, useColors, onVehicleSelect }: Props) {
  const t = translations[language];
  const { vehicles, setVehicles } = useVehicles();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterCompany, setFilterCompany] = useState<FilterCompany>('all');
  const [showImport, setShowImport] = useState(false);

  // Fast filtering with useMemo
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle => {
      // Status filter
      if (filterStatus !== 'all' && vehicle.status !== filterStatus) {
        return false;
      }

      // Company filter
      if (filterCompany !== 'all' && vehicle.company !== filterCompany) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          vehicle.plate.toLowerCase().includes(query) ||
          vehicle.model.toLowerCase().includes(query) ||
          vehicle.make.toLowerCase().includes(query) ||
          vehicle.vin.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [vehicles, searchQuery, filterStatus, filterCompany]);

  const handleImportVehicles = (importedVehicles: any[], company: Company) => {
    setVehicles([...importedVehicles, ...vehicles]);
  };

  const statusConfig = {
    available: {
      label: t.available,
      icon: CheckCircle,
      bgColor: useColors ? 'bg-green-50' : 'bg-gray-50',
      borderColor: useColors ? 'border-green-500' : 'border-gray-500',
      textColor: useColors ? 'text-green-700' : 'text-gray-700',
      iconColor: useColors ? 'text-green-600' : 'text-gray-600',
    },
    maintenance: {
      label: t.maintenance,
      icon: Wrench,
      bgColor: useColors ? 'bg-orange-50' : 'bg-gray-200',
      borderColor: useColors ? 'border-orange-500' : 'border-gray-700',
      textColor: useColors ? 'text-orange-700' : 'text-gray-700',
      iconColor: useColors ? 'text-orange-600' : 'text-gray-600',
    },
    cleaning: {
      label: t.cleaning,
      icon: Sparkles,
      bgColor: useColors ? 'bg-purple-50' : 'bg-gray-100',
      borderColor: useColors ? 'border-purple-500' : 'border-gray-600',
      textColor: useColors ? 'text-purple-700' : 'text-gray-700',
      iconColor: useColors ? 'text-purple-600' : 'text-gray-600',
    },
    'out-of-service': {
      label: t.outOfService,
      icon: AlertCircle,
      bgColor: useColors ? 'bg-red-50' : 'bg-gray-300',
      borderColor: useColors ? 'border-red-500' : 'border-gray-800',
      textColor: useColors ? 'text-red-700' : 'text-gray-700',
      iconColor: useColors ? 'text-red-600' : 'text-gray-600',
    },
  };

  const statusCounts = {
    all: vehicles.length,
    available: vehicles.filter(v => v.status === 'available').length,
    maintenance: vehicles.filter(v => v.status === 'maintenance').length,
    cleaning: vehicles.filter(v => v.status === 'cleaning').length,
    'out-of-service': vehicles.filter(v => v.status === 'out-of-service').length,
  };

  const companyCounts = {
    all: vehicles.length,
    europcar: vehicles.filter(v => v.company === 'europcar').length,
    goldcar: vehicles.filter(v => v.company === 'goldcar').length,
  };

  return (
    <div className="space-y-4">
      {/* Company Filter */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setFilterCompany('all')}
          className={`p-3 border-2 transition-all ${
            filterCompany === 'all'
              ? 'border-black bg-gray-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm">{t.allCompanies}</span>
            <Building2 className="w-4 h-4" />
          </div>
          <div className="text-xl">{companyCounts.all}</div>
        </button>

        <button
          onClick={() => setFilterCompany('europcar')}
          className={`p-3 border-2 transition-all ${
            filterCompany === 'europcar'
              ? 'border-black bg-gray-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm">🚗 {t.europcar}</span>
          </div>
          <div className="text-xl">{companyCounts.europcar}</div>
        </button>

        <button
          onClick={() => setFilterCompany('goldcar')}
          className={`p-3 border-2 transition-all ${
            filterCompany === 'goldcar'
              ? 'border-black bg-gray-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm">🚙 {t.goldcar}</span>
          </div>
          <div className="text-xl">{companyCounts.goldcar}</div>
        </button>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <button
          onClick={() => setFilterStatus('all')}
          className={`p-4 border-2 transition-all ${
            filterStatus === 'all' 
              ? 'border-black bg-gray-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm">{t.all}</span>
            <Car className="w-4 h-4" />
          </div>
          <div className="text-2xl">{statusCounts.all}</div>
          <div className="text-xs text-gray-600">{t.vehicles}</div>
        </button>

        {(['available', 'maintenance', 'cleaning', 'out-of-service'] as const).map(status => {
          const config = statusConfig[status];
          const Icon = config.icon;
          
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`p-4 border-2 transition-all ${
                filterStatus === status 
                  ? `${config.borderColor} ${config.bgColor}` 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">{config.label}</span>
                <Icon className={`w-4 h-4 ${config.iconColor}`} />
              </div>
              <div className="text-2xl">{statusCounts[status]}</div>
              <div className="text-xs text-gray-600">{t.vehicles}</div>
            </button>
          );
        })}
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.search}
            className="w-full pl-11 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500"
          />
        </div>
        
        <button 
          onClick={() => setShowImport(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 hover:bg-gray-50 transition-colors whitespace-nowrap"
        >
          <Upload className="w-5 h-5" />
          {t.importExcel}
        </button>

        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors whitespace-nowrap">
          <Plus className="w-5 h-5" />
          {t.addVehicle}
        </button>
      </div>

      {/* Vehicle Grid */}
      {filteredVehicles.length === 0 ? (
        <div className="border border-gray-300 border-dashed p-12 text-center">
          <Car className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-gray-500">{t.noVehicles}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredVehicles.map(vehicle => {
            const config = statusConfig[vehicle.status];
            const Icon = config.icon;
            const lastLog = vehicle.logs[0];
            
            return (
              <div
                key={vehicle.id}
                onClick={() => onVehicleSelect(vehicle.id)}
                className="border-2 border-gray-300 hover:border-black transition-all cursor-pointer bg-white"
              >
                {/* Vehicle Image Placeholder */}
                <div className="aspect-video bg-gray-100 border-b border-gray-300 flex items-center justify-center">
                  <Car className="w-12 h-12 text-gray-400" />
                </div>

                {/* Vehicle Info */}
                <div className="p-4">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs border ${config.borderColor} ${config.bgColor} ${config.textColor}`}>
                        <Icon className="w-3 h-3" />
                        {config.label}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 border border-gray-300">
                        {vehicle.company === 'europcar' ? '🚗 EC' : '🚙 GC'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{vehicle.year}</span>
                  </div>

                  {/* Plate */}
                  <div className="mb-2">
                    <div className="inline-block px-3 py-1 bg-black text-white font-mono tracking-wider">
                      {vehicle.plate}
                    </div>
                  </div>

                  {/* Make & Model */}
                  <h3 className="mb-1">{vehicle.make} {vehicle.model}</h3>
                  
                  {/* Mileage */}
                  <p className="text-sm text-gray-600 mb-3">
                    {vehicle.mileage.toLocaleString()} {t.km}
                  </p>

                  {/* Last Activity */}
                  {lastLog && (
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-start gap-2">
                        <Clock className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-500">{t.lastActivity}</p>
                          <p className="text-sm truncate">{lastLog.type}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(lastLog.timestamp).toLocaleDateString(language)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick View Button */}
                <div className="px-4 pb-4">
                  <button className="w-full px-3 py-2 border border-gray-300 hover:bg-gray-50 transition-colors text-sm">
                    {t.viewDetails} →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Excel Import Modal */}
      {showImport && (
        <ExcelImport
          language={language}
          onClose={() => setShowImport(false)}
          onImport={handleImportVehicles}
        />
      )}
    </div>
  );
}
