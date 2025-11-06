import { useState, useMemo } from 'react';
import { Grid, List, Search, Filter, Download, Trash2, X, FolderOpen, Building2, Car } from 'lucide-react';
import { usePhotos, Photo } from './PhotoContext';

type Language = 'en' | 'el';
type ViewMode = 'grid' | 'list';
type FilterCompany = 'all' | 'europcar' | 'goldcar';

const translations = {
  en: {
    title: 'Photo Gallery',
    subtitle: 'All vehicle photos synchronized from log entries',
    search: 'Search by plate, log type, or notes...',
    filter: 'Filter',
    grid: 'Grid View',
    list: 'List View',
    noPhotos: 'No photos uploaded yet',
    plate: 'License Plate',
    date: 'Date',
    logType: 'Log Type',
    notes: 'Notes',
    actions: 'Actions',
    delete: 'Delete',
    download: 'Download',
    viewDetails: 'View Details',
    mileage: 'Mileage',
    km: 'km',
    allCompanies: 'All Companies',
    europcar: 'Europcar',
    goldcar: 'Goldcar',
    total: 'Total Photos',
    cleaning: 'Cleaning',
    maintenance: 'Maintenance',
    inspection: 'Inspection',
    damage: 'Damage',
    fuel: 'Fuel',
    transfer: 'Transfer',
    other: 'Other',
  },
  el: {
    title: 'Συλλογή Φωτογραφιών',
    subtitle: 'Όλες οι φωτογραφίες οχημάτων συγχρονισμένες από καταχωρήσεις',
    search: 'Αναζήτηση με πινακίδα, τύπο ή σημειώσεις...',
    filter: 'Φίλτρο',
    grid: 'Πλέγμα',
    list: 'Λίστα',
    noPhotos: 'Δεν υπάρχουν φωτογραφίες',
    plate: 'Πινακίδα',
    date: 'Ημερομηνία',
    logType: 'Τύπος',
    notes: 'Σημειώσεις',
    actions: 'Ενέργειες',
    delete: 'Διαγραφή',
    download: 'Λήψη',
    viewDetails: 'Λεπτομέρειες',
    mileage: 'Χιλιόμετρα',
    km: 'χλμ',
    allCompanies: 'Όλες οι Εταιρείες',
    europcar: 'Europcar',
    goldcar: 'Goldcar',
    total: 'Σύνολο Φωτογραφιών',
    cleaning: 'Καθαρισμός',
    maintenance: 'Συντήρηση',
    inspection: 'Επιθεώρηση',
    damage: 'Ζημιά',
    fuel: 'Καύσιμα',
    transfer: 'Μεταφορά',
    other: 'Άλλο',
  }
};

interface Props {
  language: Language;
  useColors: boolean;
}

export function PhotoGallery({ language, useColors }: Props) {
  const t = translations[language];
  const { photos } = usePhotos();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [filterCompany, setFilterCompany] = useState<FilterCompany>('all');

  // Fast filtering with useMemo
  const filteredPhotos = useMemo(() => {
    return photos.filter(photo => {
      // Company filter
      if (filterCompany !== 'all' && photo.company !== filterCompany) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          photo.vehiclePlate.toLowerCase().includes(query) ||
          photo.logType?.toLowerCase().includes(query) ||
          photo.notes?.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [photos, searchQuery, filterCompany]);

  const companyCounts = {
    all: photos.length,
    europcar: photos.filter(p => p.company === 'europcar').length,
    goldcar: photos.filter(p => p.company === 'goldcar').length,
  };

  const getLogTypeLabel = (logType?: string) => {
    if (!logType) return t.other;
    const labels: { [key: string]: string } = {
      cleaning: t.cleaning,
      maintenance: t.maintenance,
      inspection: t.inspection,
      damage: t.damage,
      fuel: t.fuel,
      transfer: t.transfer,
      other: t.other,
    };
    return labels[logType] || logType;
  };

  const handleDownload = (photo: Photo) => {
    const a = document.createElement('a');
    a.href = photo.url;
    a.download = `${photo.vehiclePlate}_${new Date(photo.timestamp).toISOString()}.jpg`;
    a.click();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2>{t.title}</h2>
        <p className="text-sm text-gray-600 mt-1">{t.subtitle}</p>
      </div>

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
            <FolderOpen className="w-4 h-4" />
          </div>
          <div className="text-xl">{companyCounts.all}</div>
          <div className="text-xs text-gray-600">{t.total}</div>
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

      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.search}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-2 border border-gray-300 transition-colors ${
              viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-2 border border-gray-300 transition-colors ${
              viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Photo Gallery */}
      {filteredPhotos.length === 0 ? (
        <div className="border border-gray-300 border-dashed p-12 text-center">
          <FolderOpen className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-gray-500">{t.noPhotos}</p>
          <p className="text-sm text-gray-400 mt-2">
            Photos will appear here automatically when uploaded from vehicle log entries
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredPhotos.map((photo) => (
            <div key={photo.id} className="border border-gray-300 overflow-hidden group">
              <div 
                className="aspect-square cursor-pointer relative overflow-hidden bg-gray-100"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img 
                  src={photo.url} 
                  alt={photo.vehiclePlate} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity" />
              </div>
              
              <div className="p-2 bg-gray-50 border-t border-gray-300">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs px-2 py-0.5 bg-black text-white font-mono">
                    {photo.vehiclePlate}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-gray-200 border border-gray-300">
                    {photo.company === 'europcar' ? '🚗' : '🚙'}
                  </span>
                </div>
                
                <p className="text-xs text-gray-600 truncate">
                  {getLogTypeLabel(photo.logType)}
                </p>
                
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(photo.timestamp).toLocaleDateString(language)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-gray-300">
          <div className="bg-gray-50 border-b border-gray-300 px-4 py-2 hidden md:grid md:grid-cols-12 gap-4">
            <div className="col-span-2">Preview</div>
            <div className="col-span-2">{t.plate}</div>
            <div className="col-span-2">{t.date}</div>
            <div className="col-span-2">{t.logType}</div>
            <div className="col-span-2">{t.mileage}</div>
            <div className="col-span-2">{t.actions}</div>
          </div>
          
          {filteredPhotos.map((photo) => (
            <div key={photo.id} className="border-b border-gray-300 last:border-b-0 px-4 py-3 grid grid-cols-1 md:grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors">
              <div className="col-span-2">
                <img 
                  src={photo.url} 
                  alt={photo.vehiclePlate} 
                  className="w-20 h-20 object-cover border border-gray-300 cursor-pointer"
                  onClick={() => setSelectedPhoto(photo)}
                />
              </div>
              
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <p className="font-mono">{photo.vehiclePlate}</p>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 border border-gray-300">
                    {photo.company === 'europcar' ? '🚗 EC' : '🚙 GC'}
                  </span>
                </div>
              </div>
              
              <div className="col-span-2">
                <p className="text-sm">{new Date(photo.timestamp).toLocaleDateString(language)}</p>
                <p className="text-xs text-gray-500">{new Date(photo.timestamp).toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              
              <div className="col-span-2">
                <span className="inline-block px-2 py-1 text-xs bg-gray-100 border border-gray-300">
                  {getLogTypeLabel(photo.logType)}
                </span>
              </div>
              
              <div className="col-span-2">
                <p className="text-sm">
                  {photo.mileage ? `${photo.mileage.toLocaleString()} ${t.km}` : '—'}
                </p>
              </div>
              
              <div className="col-span-2 flex gap-2">
                <button
                  onClick={() => handleDownload(photo)}
                  className="px-3 py-1 text-sm border border-gray-300 hover:bg-gray-100"
                  title={t.download}
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedPhoto(photo)}
                  className="px-3 py-1 text-sm border border-gray-300 hover:bg-gray-100"
                >
                  {t.viewDetails}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
          <div className="bg-white max-w-5xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="border-b border-gray-300 p-4 flex justify-between items-center sticky top-0 bg-white z-10">
              <div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-black text-white font-mono tracking-wider">
                    {selectedPhoto.vehiclePlate}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 border border-gray-300 text-sm">
                    {selectedPhoto.company === 'europcar' ? '🚗 Europcar' : '🚙 Goldcar'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-2 hover:bg-gray-100 border border-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <img 
                src={selectedPhoto.url} 
                alt={selectedPhoto.vehiclePlate} 
                className="w-full h-auto max-h-[60vh] object-contain border border-gray-300 mb-6"
              />
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t.plate}</p>
                    <p className="font-mono">{selectedPhoto.vehiclePlate}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t.date}</p>
                    <p>{new Date(selectedPhoto.timestamp).toLocaleString(language)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t.logType}</p>
                    <span className="inline-block px-3 py-1 bg-gray-100 border border-gray-300">
                      {getLogTypeLabel(selectedPhoto.logType)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedPhoto.mileage && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{t.mileage}</p>
                      <p>{selectedPhoto.mileage.toLocaleString()} {t.km}</p>
                    </div>
                  )}
                  
                  {selectedPhoto.notes && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{t.notes}</p>
                      <p className="whitespace-pre-wrap bg-gray-50 p-3 border border-gray-300">{selectedPhoto.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => handleDownload(selectedPhoto)}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  {t.download}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
