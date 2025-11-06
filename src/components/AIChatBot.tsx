import { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, Minimize2, Maximize2, RefreshCw, Sparkles } from 'lucide-react';
import { Vehicle } from './vehicle-data';
import { usePhotos } from './PhotoContext';

type Language = 'en' | 'el';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface Props {
  language: Language;
  useColors: boolean;
  vehicles: Vehicle[];
  onClose?: () => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

const translations = {
  en: {
    title: 'Fleet AI Assistant',
    subtitle: 'Ask me anything about your fleet',
    placeholder: 'Ask about vehicles, maintenance, schedules...',
    send: 'Send',
    newChat: 'New Chat',
    minimize: 'Minimize',
    maximize: 'Maximize',
    close: 'Close',
    thinking: 'Thinking...',
    welcomeMessage: "Hello! I'm your Fleet AI Assistant. I can help you with:\n\n• Vehicle status and availability\n• Maintenance schedules and history\n• Photo gallery queries\n• Fleet statistics and reports\n• System guidance and tips\n\nWhat would you like to know?",
    suggestedQuestions: [
      'How many vehicles need maintenance?',
      'Show me available Europcar vehicles',
      'What are the latest photos?',
      'Which vehicles have high mileage?',
    ],
    quickActions: 'Quick Questions',
  },
  el: {
    title: 'AI Βοηθός Στόλου',
    subtitle: 'Ρωτήστε με οτιδήποτε για τον στόλο σας',
    placeholder: 'Ρωτήστε για οχήματα, συντήρηση, προγράμματα...',
    send: 'Αποστολή',
    newChat: 'Νέα Συνομιλία',
    minimize: 'Ελαχιστοποίηση',
    maximize: 'Μεγιστοποίηση',
    close: 'Κλείσιμο',
    thinking: 'Σκέφτομαι...',
    welcomeMessage: "Γεια σας! Είμαι ο AI Βοηθός Στόλου. Μπορώ να σας βοηθήσω με:\n\n• Κατάσταση και διαθεσιμότητα οχημάτων\n• Προγράμματα και ιστορικό συντήρησης\n• Ερωτήματα συλλογής φωτογραφιών\n• Στατιστικά και αναφορές στόλου\n• Καθοδήγηση και συμβουλές συστήματος\n\nΤι θα θέλατε να μάθετε;",
    suggestedQuestions: [
      'Πόσα οχήματα χρειάζονται συντήρηση;',
      'Δείξε μου διαθέσιμα οχήματα Europcar',
      'Ποιες είναι οι τελευταίες φωτογραφίες;',
      'Ποια οχήματα έχουν υψηλά χιλιόμετρα;',
    ],
    quickActions: 'Γρήγορες Ερωτήσεις',
  }
};

export function AIChatBot({ language, useColors, vehicles, onClose, isMinimized, onToggleMinimize }: Props) {
  const t = translations[language];
  const { photos } = usePhotos();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: t.welcomeMessage,
      timestamp: new Date().toISOString(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Vehicle status queries
    if (lowerMessage.includes('maintenance') || lowerMessage.includes('συντήρηση')) {
      const maintenanceVehicles = vehicles.filter(v => v.status === 'maintenance');
      if (lowerMessage.includes('how many') || lowerMessage.includes('πόσα')) {
        return language === 'en'
          ? `Currently, ${maintenanceVehicles.length} vehicle${maintenanceVehicles.length !== 1 ? 's' : ''} ${maintenanceVehicles.length !== 1 ? 'are' : 'is'} in maintenance:\n\n${maintenanceVehicles.map(v => `• ${v.plate} (${v.make} ${v.model}) - ${v.mileage.toLocaleString()} km`).join('\n')}`
          : `Αυτή τη στιγμή, ${maintenanceVehicles.length} όχημα${maintenanceVehicles.length !== 1 ? 'τα' : ''} βρίσκεται σε συντήρηση:\n\n${maintenanceVehicles.map(v => `• ${v.plate} (${v.make} ${v.model}) - ${v.mileage.toLocaleString()} χλμ`).join('\n')}`;
      }
    }

    // Available vehicles
    if (lowerMessage.includes('available') || lowerMessage.includes('διαθέσιμ')) {
      let availableVehicles = vehicles.filter(v => v.status === 'available');
      
      if (lowerMessage.includes('europcar')) {
        availableVehicles = availableVehicles.filter(v => v.company === 'europcar');
      } else if (lowerMessage.includes('goldcar')) {
        availableVehicles = availableVehicles.filter(v => v.company === 'goldcar');
      }

      const companyText = lowerMessage.includes('europcar') ? 'Europcar ' : lowerMessage.includes('goldcar') ? 'Goldcar ' : '';
      
      return language === 'en'
        ? `There ${availableVehicles.length !== 1 ? 'are' : 'is'} ${availableVehicles.length} ${companyText}vehicle${availableVehicles.length !== 1 ? 's' : ''} available:\n\n${availableVehicles.slice(0, 10).map(v => `• ${v.plate} - ${v.make} ${v.model} (${v.year}) at ${v.location}`).join('\n')}${availableVehicles.length > 10 ? `\n\n...and ${availableVehicles.length - 10} more.` : ''}`
        : `Υπάρχουν ${availableVehicles.length} ${companyText}διαθέσιμα οχήματα:\n\n${availableVehicles.slice(0, 10).map(v => `• ${v.plate} - ${v.make} ${v.model} (${v.year}) στο ${v.location}`).join('\n')}${availableVehicles.length > 10 ? `\n\n...και ${availableVehicles.length - 10} ακόμη.` : ''}`;
    }

    // Fleet statistics
    if (lowerMessage.includes('total') || lowerMessage.includes('statistics') || lowerMessage.includes('στατιστικ') || lowerMessage.includes('σύνολο')) {
      const europcarCount = vehicles.filter(v => v.company === 'europcar').length;
      const goldcarCount = vehicles.filter(v => v.company === 'goldcar').length;
      const availableCount = vehicles.filter(v => v.status === 'available').length;
      const maintenanceCount = vehicles.filter(v => v.status === 'maintenance').length;
      const cleaningCount = vehicles.filter(v => v.status === 'cleaning').length;

      return language === 'en'
        ? `Here's your fleet overview:\n\n📊 Total Vehicles: ${vehicles.length}\n🚗 Europcar: ${europcarCount}\n🚙 Goldcar: ${goldcarCount}\n\n✅ Available: ${availableCount}\n🔧 Maintenance: ${maintenanceCount}\n✨ Cleaning: ${cleaningCount}\n\nTotal Photos: ${photos.length}`
        : `Εδώ είναι η επισκόπηση του στόλου σας:\n\n📊 Σύνολο Οχημάτων: ${vehicles.length}\n🚗 Europcar: ${europcarCount}\n🚙 Goldcar: ${goldcarCount}\n\n✅ Διαθέσιμα: ${availableCount}\n🔧 Συντήρηση: ${maintenanceCount}\n✨ Καθαρισμός: ${cleaningCount}\n\nΣύνολο Φωτογραφιών: ${photos.length}`;
    }

    // Photo queries
    if (lowerMessage.includes('photo') || lowerMessage.includes('φωτογραφ') || lowerMessage.includes('image')) {
      const recentPhotos = photos.slice(0, 5);
      return language === 'en'
        ? `You have ${photos.length} photos in the gallery. Here are the most recent:\n\n${recentPhotos.map(p => `• ${p.vehiclePlate} - ${p.logType || 'General'} (${new Date(p.timestamp).toLocaleDateString()})`).join('\n')}\n\nYou can view all photos in the Photo Gallery section.`
        : `Έχετε ${photos.length} φωτογραφίες στη συλλογή. Εδώ είναι οι πιο πρόσφατες:\n\n${recentPhotos.map(p => `• ${p.vehiclePlate} - ${p.logType || 'Γενικά'} (${new Date(p.timestamp).toLocaleDateString()})`).join('\n')}\n\nΜπορείτε να δείτε όλες τις φωτογραφίες στην ενότητα Συλλογή Φωτογραφιών.`;
    }

    // High mileage
    if (lowerMessage.includes('high mileage') || lowerMessage.includes('most km') || lowerMessage.includes('υψηλά χιλιόμετρα')) {
      const sortedByMileage = [...vehicles].sort((a, b) => b.mileage - a.mileage).slice(0, 5);
      return language === 'en'
        ? `Vehicles with highest mileage:\n\n${sortedByMileage.map(v => `• ${v.plate} - ${v.make} ${v.model}: ${v.mileage.toLocaleString()} km`).join('\n')}\n\nThese vehicles may need attention soon.`
        : `Οχήματα με τα περισσότερα χιλιόμετρα:\n\n${sortedByMileage.map(v => `• ${v.plate} - ${v.make} ${v.model}: ${v.mileage.toLocaleString()} χλμ`).join('\n')}\n\nΑυτά τα οχήματα μπορεί να χρειαστούν προσοχή σύντομα.`;
    }

    // Search specific vehicle
    const plateMatch = userMessage.match(/[A-Z]{3}-\d{4}/i);
    if (plateMatch) {
      const plate = plateMatch[0].toUpperCase();
      const vehicle = vehicles.find(v => v.plate.toUpperCase() === plate);
      if (vehicle) {
        const recentLogs = vehicle.logs.slice(0, 3);
        return language === 'en'
          ? `Found vehicle ${vehicle.plate}:\n\n🚗 ${vehicle.make} ${vehicle.model} (${vehicle.year})\n📍 Location: ${vehicle.location}\n📊 Status: ${vehicle.status}\n⏱️ Mileage: ${vehicle.mileage.toLocaleString()} km\n🏢 Company: ${vehicle.company === 'europcar' ? 'Europcar' : 'Goldcar'}\n\nRecent Activity:\n${recentLogs.map(log => `• ${log.type}: ${log.notes || 'No notes'} (${new Date(log.timestamp).toLocaleDateString()})`).join('\n')}`
          : `Βρέθηκε όχημα ${vehicle.plate}:\n\n🚗 ${vehicle.make} ${vehicle.model} (${vehicle.year})\n📍 Τοποθεσία: ${vehicle.location}\n📊 Κατάσταση: ${vehicle.status}\n⏱️ Χιλιόμετρα: ${vehicle.mileage.toLocaleString()} χλμ\n🏢 Εταιρεία: ${vehicle.company === 'europcar' ? 'Europcar' : 'Goldcar'}\n\nΠρόσφατη Δραστηριότητα:\n${recentLogs.map(log => `• ${log.type}: ${log.notes || 'Χωρίς σημειώσεις'} (${new Date(log.timestamp).toLocaleDateString()})`).join('\n')}`;
      }
    }

    // Cleaning status
    if (lowerMessage.includes('cleaning') || lowerMessage.includes('clean') || lowerMessage.includes('καθαρ')) {
      const cleaningVehicles = vehicles.filter(v => v.status === 'cleaning');
      return language === 'en'
        ? `${cleaningVehicles.length} vehicle${cleaningVehicles.length !== 1 ? 's are' : ' is'} currently being cleaned:\n\n${cleaningVehicles.map(v => `• ${v.plate} (${v.make} ${v.model})`).join('\n')}`
        : `${cleaningVehicles.length} όχημα${cleaningVehicles.length !== 1 ? 'τα' : ''} καθαρίζεται αυτή τη στιγμή:\n\n${cleaningVehicles.map(v => `• ${v.plate} (${v.make} ${v.model})`).join('\n')}`;
    }

    // Location queries
    if (lowerMessage.includes('location') || lowerMessage.includes('where') || lowerMessage.includes('τοποθεσ') || lowerMessage.includes('που')) {
      const locations = [...new Set(vehicles.map(v => v.location))];
      const locationCounts = locations.map(loc => ({
        location: loc,
        count: vehicles.filter(v => v.location === loc).length
      }));
      
      return language === 'en'
        ? `Vehicle distribution by location:\n\n${locationCounts.map(l => `• ${l.location}: ${l.count} vehicle${l.count !== 1 ? 's' : ''}`).join('\n')}`
        : `Κατανομή οχημάτων ανά τοποθεσία:\n\n${locationCounts.map(l => `• ${l.location}: ${l.count} όχημα${l.count !== 1 ? 'τα' : ''}`).join('\n')}`;
    }

    // Help and guidance
    if (lowerMessage.includes('help') || lowerMessage.includes('how') || lowerMessage.includes('βοήθ') || lowerMessage.includes('πώς')) {
      return language === 'en'
        ? "I can help you with:\n\n📊 Fleet Statistics\n• Total vehicles, status breakdown\n• Company-specific counts\n\n🚗 Vehicle Information\n• Search by plate number\n• Check availability\n• Maintenance status\n\n📸 Photo Gallery\n• Recent uploads\n• Photo counts\n\n🔧 Maintenance\n• Vehicles needing service\n• High mileage alerts\n\n📍 Locations\n• Vehicle distribution\n• Availability by location\n\nJust ask me anything!"
        : "Μπορώ να σας βοηθήσω με:\n\n📊 Στατιστικά Στόλου\n• Σύνολο οχημάτων, κατανομή καταστάσεων\n• Μετρήσεις ανά εταιρεία\n\n🚗 Πληροφορίες Οχήματος\n• Αναζήτηση με πινακίδα\n• Έλεγχος διαθεσιμότητας\n• Κατάσταση συντήρησης\n\n📸 Συλλογή Φωτογραφιών\n• Πρόσφατες μεταφορτώσεις\n• Αριθμός φωτογραφιών\n\n🔧 Συντήρηση\n• Οχήματα που χρειάζονται σέρβις\n• Ειδοποιήσεις υψηλών χιλιομέτρων\n\n📍 Τοποθεσίες\n• Κατανομή οχημάτων\n• Διαθεσιμότητα ανά τοποθεσία\n\nΑπλά ρωτήστε με οτιδήποτε!";
    }

    // Default response
    return language === 'en'
      ? "I'd be happy to help! You can ask me about:\n\n• Vehicle status and availability\n• Maintenance schedules\n• Fleet statistics\n• Photo gallery\n• Specific vehicle information (use plate number)\n• Location information\n\nWhat would you like to know?"
      : "Θα χαρώ να σας βοηθήσω! Μπορείτε να με ρωτήσετε για:\n\n• Κατάσταση και διαθεσιμότητα οχημάτων\n• Προγράμματα συντήρησης\n• Στατιστικά στόλου\n• Συλλογή φωτογραφιών\n• Συγκεκριμένες πληροφορίες οχήματος (χρησιμοποιήστε πινακίδα)\n• Πληροφορίες τοποθεσίας\n\nΤι θα θέλατε να μάθετε;";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(input),
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsThinking(false);
    }, 800 + Math.random() * 700);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: t.welcomeMessage,
        timestamp: new Date().toISOString(),
      }
    ]);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  if (isMinimized) {
    return (
      <button
        onClick={onToggleMinimize}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg border-2 border-black ${
          useColors ? 'bg-blue-500' : 'bg-black'
        } text-white hover:scale-110 transition-transform z-50`}
      >
        <Bot className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white border-2 border-black shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className={`p-4 border-b-2 border-black flex items-center justify-between ${
        useColors ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-black'
      } text-white`}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bot className="w-6 h-6" />
            <Sparkles className="w-3 h-3 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <div>
            <h3 className="text-white">{t.title}</h3>
            <p className="text-xs opacity-90">{t.subtitle}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={handleNewChat}
            className="p-1.5 hover:bg-white/20 transition-colors rounded"
            title={t.newChat}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          {onToggleMinimize && (
            <button
              onClick={onToggleMinimize}
              className="p-1.5 hover:bg-white/20 transition-colors rounded"
              title={t.minimize}
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          )}
          
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/20 transition-colors rounded"
              title={t.close}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.role === 'assistant'
                ? useColors ? 'bg-gradient-to-br from-blue-500 to-purple-500' : 'bg-black'
                : 'bg-gray-300'
            } text-white`}>
              {message.role === 'assistant' ? <Bot className="w-5 h-5" /> : 'U'}
            </div>
            
            <div className={`flex-1 ${message.role === 'user' ? 'flex justify-end' : ''}`}>
              <div className={`inline-block px-4 py-2 max-w-[85%] ${
                message.role === 'assistant'
                  ? 'bg-white border border-gray-300'
                  : useColors
                    ? 'bg-blue-500 text-white'
                    : 'bg-black text-white'
              }`}>
                <div className="text-sm whitespace-pre-wrap break-words">
                  {message.content}
                </div>
                <div className={`text-xs mt-1 ${
                  message.role === 'assistant' ? 'text-gray-500' : 'opacity-70'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString(language, {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              useColors ? 'bg-gradient-to-br from-blue-500 to-purple-500' : 'bg-black'
            } text-white`}>
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-white border border-gray-300 px-4 py-2 inline-flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm text-gray-600">{t.thinking}</span>
            </div>
          </div>
        )}

        {messages.length === 1 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-600">{t.quickActions}:</p>
            {t.suggestedQuestions.map((question, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickQuestion(question)}
                className="w-full text-left px-3 py-2 text-sm bg-white border border-gray-300 hover:border-black transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t-2 border-black bg-white">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t.placeholder}
            rows={1}
            disabled={isThinking}
            className="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:border-black resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            style={{ minHeight: '40px', maxHeight: '100px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isThinking}
            className={`px-4 py-2 flex items-center justify-center transition-colors ${
              input.trim() && !isThinking
                ? useColors
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-black hover:bg-gray-800'
                : 'bg-gray-200 cursor-not-allowed'
            } text-white`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
