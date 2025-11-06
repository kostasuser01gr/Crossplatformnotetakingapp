import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, User, X, Calendar as CalendarIcon } from 'lucide-react';

type Language = 'en' | 'el';

interface CalendarEvent {
  id: string;
  title: string;
  vehicleId: string;
  vehiclePlate: string;
  startDate: string;
  endDate: string;
  type: 'cleaning' | 'inspection' | 'maintenance' | 'transfer' | 'service';
  location?: string;
  notes?: string;
  assignedTo?: string;
}

const translations = {
  en: {
    title: 'Vehicle Operations Calendar',
    today: 'Today',
    month: 'Month',
    week: 'Week',
    day: 'Day',
    addEvent: 'Schedule Activity',
    noEvents: 'No scheduled activities',
    eventDetails: 'Activity Details',
    eventTitle: 'Activity Title',
    vehiclePlate: 'Vehicle Plate',
    assignedTo: 'Assigned To',
    startDate: 'Start Date',
    endDate: 'End Date',
    type: 'Type',
    location: 'Location',
    notes: 'Notes',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    cleaning: 'Cleaning',
    inspection: 'Inspection',
    maintenance: 'Maintenance',
    transfer: 'Transfer',
    service: 'Service',
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },
  el: {
    title: 'Ημερολόγιο Λειτουργιών Οχημάτων',
    today: 'Σήμερα',
    month: 'Μήνας',
    week: 'Εβδομάδα',
    day: 'Ημέρα',
    addEvent: 'Προγραμματισμός',
    noEvents: 'Δεν υπάρχουν προγραμματισμένες δραστηριότητες',
    eventDetails: 'Λεπτομέρειες',
    eventTitle: 'Τίτλος',
    vehiclePlate: 'Πινακίδα',
    assignedTo: 'Ανατέθηκε Σε',
    startDate: 'Ημ. Έναρξης',
    endDate: 'Ημ. Λήξης',
    type: 'Τύπος',
    location: 'Τοποθεσία',
    notes: 'Σημειώσεις',
    save: 'Αποθήκευση',
    cancel: 'Ακύρωση',
    delete: 'Διαγραφή',
    cleaning: 'Καθαρισμός',
    inspection: 'Επιθεώρηση',
    maintenance: 'Συντήρηση',
    transfer: 'Μεταφορά',
    service: 'Σέρβις',
    months: ['Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος', 'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος'],
    days: ['Κυρ', 'Δευ', 'Τρί', 'Τετ', 'Πέμ', 'Παρ', 'Σάβ'],
  }
};

interface Props {
  language: Language;
  useColors: boolean;
}

export function CalendarView({ language, useColors }: Props) {
  const t = translations[language];
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Scheduled Maintenance',
      vehicleId: 'vehicle-1',
      vehiclePlate: 'ABC-1001',
      startDate: new Date(2024, 10, 15, 9, 0).toISOString(),
      endDate: new Date(2024, 10, 15, 12, 0).toISOString(),
      type: 'maintenance',
      location: 'Service Center',
      assignedTo: 'Mike Wilson',
      notes: 'Oil change and tire rotation'
    },
    {
      id: '2',
      title: 'Deep Cleaning',
      vehicleId: 'vehicle-2',
      vehiclePlate: 'XYZ-2002',
      startDate: new Date(2024, 10, 16, 14, 0).toISOString(),
      endDate: new Date(2024, 10, 16, 16, 0).toISOString(),
      type: 'cleaning',
      location: 'Main Office',
      assignedTo: 'Jane Smith',
    },
    {
      id: '3',
      title: 'Safety Inspection',
      vehicleId: 'vehicle-3',
      vehiclePlate: 'DEF-3003',
      startDate: new Date(2024, 10, 18, 10, 0).toISOString(),
      endDate: new Date(2024, 10, 18, 11, 0).toISOString(),
      type: 'inspection',
      location: 'Service Center',
      assignedTo: 'John Doe',
    },
  ]);
  
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getEventsForDay = (date: Date | null) => {
    if (!date) return [];
    
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      return (
        eventStart.getDate() === date.getDate() &&
        eventStart.getMonth() === date.getMonth() &&
        eventStart.getFullYear() === date.getFullYear()
      );
    });
  };

  const changeMonth = (delta: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getEventColor = (type: CalendarEvent['type']) => {
    if (!useColors) {
      return 'bg-gray-200 border-gray-400 text-gray-900';
    }
    
    const colors = {
      cleaning: 'bg-purple-100 border-purple-500 text-purple-700',
      inspection: 'bg-yellow-100 border-yellow-500 text-yellow-700',
      maintenance: 'bg-orange-100 border-orange-500 text-orange-700',
      transfer: 'bg-blue-100 border-blue-500 text-blue-700',
      service: 'bg-green-100 border-green-500 text-green-700',
    };
    
    return colors[type];
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2>{t.title}</h2>
        
        <div className="flex gap-2">
          <button
            onClick={goToToday}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            {t.today}
          </button>
          
          <button
            onClick={() => setShowEventModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t.addEvent}
          </button>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="flex items-center justify-between border-b border-gray-300 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 border border-gray-300 hover:bg-gray-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <h3 className="min-w-[200px] text-center">
            {t.months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          
          <button
            onClick={() => changeMonth(1)}
            className="p-2 border border-gray-300 hover:bg-gray-100"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-2">
          {['month', 'week', 'day'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode as typeof viewMode)}
              className={`px-3 py-1 border border-gray-300 transition-colors ${
                viewMode === mode ? 'bg-gray-200' : 'hover:bg-gray-100'
              }`}
            >
              {t[mode as keyof typeof t] as string}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      {viewMode === 'month' && (
        <div className="border border-gray-300">
          {/* Day Headers */}
          <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-300">
            {t.days.map((day) => (
              <div key={day} className="p-2 text-center border-r border-gray-300 last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {days.map((day, index) => {
              const dayEvents = getEventsForDay(day);
              const isToday = day && 
                day.getDate() === new Date().getDate() &&
                day.getMonth() === new Date().getMonth() &&
                day.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={index}
                  className={`min-h-[120px] p-2 border-r border-b border-gray-300 ${
                    !day ? 'bg-gray-50' : ''
                  } ${isToday ? 'bg-yellow-50' : ''}`}
                >
                  {day && (
                    <>
                      <div className={`text-sm mb-1 ${isToday ? '' : 'text-gray-700'}`}>
                        {day.getDate()}
                      </div>
                      
                      <div className="space-y-1">
                        {dayEvents.map((event) => (
                          <button
                            key={event.id}
                            onClick={() => {
                              setSelectedEvent(event);
                              setShowEventModal(true);
                            }}
                            className={`w-full text-left text-xs p-1 border-l-2 ${getEventColor(event.type)} hover:opacity-80 transition-opacity`}
                          >
                            <div className="truncate">{event.title}</div>
                            <div className="truncate text-xs opacity-75">{event.vehiclePlate}</div>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full border-2 border-black">
            <div className="border-b-2 border-black p-4 flex justify-between items-center">
              <h3>{selectedEvent ? t.eventDetails : t.addEvent}</h3>
              <button
                onClick={() => {
                  setShowEventModal(false);
                  setSelectedEvent(null);
                }}
                className="p-1 hover:bg-gray-100 border border-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {selectedEvent ? (
                <>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t.eventTitle}</p>
                    <p>{selectedEvent.title}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t.vehiclePlate}</p>
                    <p className="font-mono">{selectedEvent.vehiclePlate}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t.type}</p>
                    <span className={`inline-block px-3 py-1 border ${getEventColor(selectedEvent.type)}`}>
                      {t[selectedEvent.type]}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{t.startDate}</p>
                      <p className="text-sm">
                        {new Date(selectedEvent.startDate).toLocaleString(language)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">{t.endDate}</p>
                      <p className="text-sm">
                        {new Date(selectedEvent.endDate).toLocaleString(language)}
                      </p>
                    </div>
                  </div>

                  {selectedEvent.location && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{t.location}</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <p>{selectedEvent.location}</p>
                      </div>
                    </div>
                  )}

                  {selectedEvent.assignedTo && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{t.assignedTo}</p>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <p>{selectedEvent.assignedTo}</p>
                      </div>
                    </div>
                  )}

                  {selectedEvent.notes && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{t.notes}</p>
                      <p className="text-sm bg-gray-50 p-2 border border-gray-300">{selectedEvent.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={() => {
                        setEvents(events.filter(e => e.id !== selectedEvent.id));
                        setShowEventModal(false);
                        setSelectedEvent(null);
                      }}
                      className="px-4 py-2 border border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                      {t.delete}
                    </button>
                    <button
                      onClick={() => {
                        setShowEventModal(false);
                        setSelectedEvent(null);
                      }}
                      className="flex-1 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
                    >
                      {t.cancel}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>Event creation form would go here</p>
                  <p className="text-sm mt-2">Connect vehicle scheduling with log entries</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
