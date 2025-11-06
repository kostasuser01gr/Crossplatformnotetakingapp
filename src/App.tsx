import { useState } from 'react';
import { VehicleDashboard } from './components/VehicleDashboard';
import { VehicleDetail } from './components/VehicleDetail';
import { PhotoGallery } from './components/PhotoGallery';
import { ChatInterface } from './components/ChatInterface';
import { CalendarView } from './components/CalendarView';
import { SettingsPanel } from './components/SettingsPanel';
import { PhotoProvider } from './components/PhotoContext';
import { VehicleProvider, useVehicles } from './components/VehicleContext';
import { AIChatBot } from './components/AIChatBot';
import { LayoutDashboard, Camera, MessageSquare, Calendar, Settings } from 'lucide-react';

type Language = 'en' | 'el';
type View = 'dashboard' | 'gallery' | 'chat' | 'calendar' | 'settings';

const translations = {
  en: {
    dashboard: 'Dashboard',
    gallery: 'Gallery',
    chat: 'Chat',
    calendar: 'Calendar',
    settings: 'Settings',
    title: 'Fleet Manager'
  },
  el: {
    dashboard: 'Πίνακας',
    gallery: 'Συλλογή',
    chat: 'Συνομιλία',
    calendar: 'Ημερολόγιο',
    settings: 'Ρυθμίσεις',
    title: 'Διαχείριση Στόλου'
  }
};

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [language, setLanguage] = useState<Language>('en');
  const [useColors, setUseColors] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [showAIChat, setShowAIChat] = useState(true);
  const [aiChatMinimized, setAIChatMinimized] = useState(false);
  const { vehicles } = useVehicles();

  const t = translations[language];

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
  };

  const handleBackToDashboard = () => {
    setSelectedVehicleId(null);
  };

  return (
    <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b border-gray-300 bg-white sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6" />
            <h1>{t.title}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'en' ? 'el' : 'en')}
              className="px-3 py-1 border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              {language === 'en' ? 'ΕΛ' : 'EN'}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-gray-300 bg-gray-50 sticky top-[73px] z-40">
        <div className="max-w-[1920px] mx-auto px-4">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => {
                setCurrentView('dashboard');
                setSelectedVehicleId(null);
              }}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                currentView === 'dashboard'
                  ? 'border-black bg-white'
                  : 'border-transparent hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              {t.dashboard}
            </button>
            
            <button
              onClick={() => setCurrentView('gallery')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                currentView === 'gallery'
                  ? 'border-black bg-white'
                  : 'border-transparent hover:bg-gray-100'
              }`}
            >
              <Camera className="w-4 h-4" />
              {t.gallery}
            </button>
            
            <button
              onClick={() => setCurrentView('chat')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                currentView === 'chat'
                  ? 'border-black bg-white'
                  : 'border-transparent hover:bg-gray-100'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              {t.chat}
            </button>
            
            <button
              onClick={() => setCurrentView('calendar')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                currentView === 'calendar'
                  ? 'border-black bg-white'
                  : 'border-transparent hover:bg-gray-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              {t.calendar}
            </button>
            
            <button
              onClick={() => setCurrentView('settings')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                currentView === 'settings'
                  ? 'border-black bg-white'
                  : 'border-transparent hover:bg-gray-100'
              }`}
            >
              <Settings className="w-4 h-4" />
              {t.settings}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1920px] mx-auto px-4 py-6">
        {currentView === 'dashboard' && (
          selectedVehicleId ? (
            <VehicleDetail 
              vehicleId={selectedVehicleId}
              language={language}
              useColors={useColors}
              onBack={handleBackToDashboard}
            />
          ) : (
            <VehicleDashboard 
              language={language}
              useColors={useColors}
              onVehicleSelect={handleVehicleSelect}
            />
          )
        )}
        {currentView === 'gallery' && <PhotoGallery language={language} useColors={useColors} />}
        {currentView === 'chat' && <ChatInterface language={language} useColors={useColors} />}
        {currentView === 'calendar' && <CalendarView language={language} useColors={useColors} />}
        {currentView === 'settings' && (
          <SettingsPanel 
            language={language} 
            useColors={useColors} 
            onToggleColors={() => setUseColors(!useColors)}
          />
        )}
      </main>

      {/* AI Chat Bot */}
      {showAIChat && (
        <AIChatBot
          language={language}
          useColors={useColors}
          vehicles={vehicles}
          onClose={() => setShowAIChat(false)}
          isMinimized={aiChatMinimized}
          onToggleMinimize={() => setAIChatMinimized(!aiChatMinimized)}
        />
      )}

      {/* Show AI Chat Button if closed */}
      {!showAIChat && (
        <button
          onClick={() => {
            setShowAIChat(true);
            setAIChatMinimized(false);
          }}
          className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg border-2 border-black ${
            useColors ? 'bg-blue-500' : 'bg-black'
          } text-white hover:scale-110 transition-transform z-50`}
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

export default function App() {
  return (
    <VehicleProvider>
      <PhotoProvider>
        <AppContent />
      </PhotoProvider>
    </VehicleProvider>
  );
}
