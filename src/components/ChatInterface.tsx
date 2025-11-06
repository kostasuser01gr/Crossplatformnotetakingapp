import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Image as ImageIcon, Smile, Search, Phone, Video, MoreVertical, Users, Hash, AtSign } from 'lucide-react';

type Language = 'en' | 'el';

interface Message {
  id: string;
  channelId: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  attachments?: string[];
  type: 'text' | 'image' | 'file';
}

interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'dm';
  unread?: number;
}

const translations = {
  en: {
    title: 'Team Chat',
    channels: 'Channels',
    directMessages: 'Direct Messages',
    typeMessage: 'Type a message...',
    send: 'Send',
    search: 'Search messages',
    voiceCall: 'Voice Call',
    videoCall: 'Video Call',
    addChannel: 'Add Channel',
    general: 'General',
    inspections: 'Inspections',
    maintenance: 'Maintenance',
    rentals: 'Rentals',
    noMessages: 'No messages yet. Start the conversation!',
    online: 'Online',
    offline: 'Offline',
    attachFile: 'Attach File',
    attachImage: 'Attach Image',
  },
  el: {
    title: 'Ομαδική Συνομιλία',
    channels: 'Κανάλια',
    directMessages: 'Απευθείας Μηνύματα',
    typeMessage: 'Πληκτρολογήστε μήνυμα...',
    send: 'Αποστολή',
    search: 'Αναζήτηση μηνυμάτων',
    voiceCall: 'Φωνητική Κλήση',
    videoCall: 'Βιντεοκλήση',
    addChannel: 'Προσθήκη Καναλιού',
    general: 'Γενικά',
    inspections: 'Επιθεωρήσεις',
    maintenance: 'Συντήρηση',
    rentals: 'Ενοικιάσεις',
    noMessages: 'Δεν υπάρχουν μηνύματα. Ξεκινήστε τη συνομιλία!',
    online: 'Συνδεδεμένος',
    offline: 'Αποσυνδεδεμένος',
    attachFile: 'Επισύναψη Αρχείου',
    attachImage: 'Επισύναψη Εικόνας',
  }
};

interface Props {
  language: Language;
  useColors: boolean;
}

export function ChatInterface({ language, useColors }: Props) {
  const t = translations[language];
  const [channels] = useState<Channel[]>([
    { id: '1', name: t.general, type: 'text' },
    { id: '2', name: t.inspections, type: 'text' },
    { id: '3', name: t.maintenance, type: 'text' },
    { id: '4', name: t.rentals, type: 'text' },
  ]);
  
  const [currentChannel, setCurrentChannel] = useState<Channel>(channels[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      channelId: '1',
      userId: '1',
      userName: 'System',
      content: language === 'en' ? 'Welcome to the team chat!' : 'Καλώς ήρθατε στην ομαδική συνομιλία!',
      timestamp: new Date().toISOString(),
      type: 'text'
    }
  ]);
  
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      channelId: currentChannel.id,
      userId: 'current-user',
      userName: 'You',
      content: messageInput,
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const newMessage: Message = {
          id: Date.now().toString() + Math.random(),
          channelId: currentChannel.id,
          userId: 'current-user',
          userName: 'You',
          content: `Attached: ${file.name}`,
          timestamp: new Date().toISOString(),
          type: file.type.startsWith('image/') ? 'image' : 'file',
          attachments: [URL.createObjectURL(file)]
        };
        setMessages(prev => [...prev, newMessage]);
      });
    }
  };

  const channelMessages = messages.filter(m => m.channelId === currentChannel.id);
  const filteredMessages = searchQuery
    ? channelMessages.filter(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : channelMessages;

  return (
    <div className="flex h-[calc(100vh-220px)] border border-gray-300">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-300 flex flex-col bg-gray-50">
        <div className="p-4 border-b border-gray-300">
          <h3>{t.title}</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {/* Channels */}
          <div className="p-2">
            <div className="px-2 py-1 text-sm text-gray-600 flex items-center gap-2">
              <Hash className="w-4 h-4" />
              {t.channels}
            </div>
            <div className="space-y-1 mt-1">
              {channels.map(channel => (
                <button
                  key={channel.id}
                  onClick={() => setCurrentChannel(channel)}
                  className={`w-full text-left px-3 py-2 transition-colors flex items-center gap-2 ${
                    currentChannel.id === channel.id
                      ? 'bg-white border-l-2 border-black'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Hash className="w-4 h-4" />
                  {channel.name}
                  {channel.unread && (
                    <span className={`ml-auto px-2 py-0.5 text-xs ${
                      useColors 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-700 text-white'
                    }`}>
                      {channel.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Direct Messages */}
          <div className="p-2 mt-2">
            <div className="px-2 py-1 text-sm text-gray-600 flex items-center gap-2">
              <AtSign className="w-4 h-4" />
              {t.directMessages}
            </div>
            <div className="space-y-1 mt-1">
              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${useColors ? 'bg-green-500' : 'bg-gray-700'}`} />
                John Doe
              </button>
              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-400" />
                Jane Smith
              </button>
            </div>
          </div>
        </div>

        {/* User Status */}
        <div className="p-3 border-t border-gray-300 bg-white">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full border-2 ${useColors ? 'border-green-500' : 'border-gray-700'} bg-gray-200 flex items-center justify-center`}>
              <Users className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">Current User</p>
              <p className="text-xs text-gray-500">{t.online}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-300 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5" />
            <h3>{currentChannel.name}</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.search}
                className="pl-9 pr-3 py-1 text-sm border border-gray-300 w-48 focus:outline-none focus:border-gray-500"
              />
            </div>
            
            <button className="p-2 hover:bg-gray-100 border border-gray-300">
              <Phone className="w-4 h-4" />
            </button>
            
            <button className="p-2 hover:bg-gray-100 border border-gray-300">
              <Video className="w-4 h-4" />
            </button>
            
            <button className="p-2 hover:bg-gray-100 border border-gray-300">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
          {filteredMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              {t.noMessages}
            </div>
          ) : (
            filteredMessages.map((message) => (
              <div key={message.id} className="flex gap-3 group">
                <div className={`w-8 h-8 rounded-full ${
                  message.userId === 'current-user' 
                    ? useColors ? 'bg-blue-500' : 'bg-gray-700'
                    : 'bg-gray-300'
                } flex items-center justify-center text-white flex-shrink-0`}>
                  {message.userName[0].toUpperCase()}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className={message.userId === 'current-user' ? '' : 'text-gray-600'}>
                      {message.userName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(message.timestamp).toLocaleTimeString(language, { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  
                  <div className="text-gray-900 break-words">
                    {message.content}
                  </div>
                  
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 grid grid-cols-2 gap-2 max-w-md">
                      {message.attachments.map((attachment, idx) => (
                        <div key={idx} className="border border-gray-300">
                          {message.type === 'image' ? (
                            <img 
                              src={attachment} 
                              alt="Attachment" 
                              className="w-full h-32 object-cover"
                            />
                          ) : (
                            <div className="p-3 flex items-center gap-2">
                              <Paperclip className="w-4 h-4" />
                              <span className="text-sm truncate">File</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-300 bg-white">
          <div className="flex gap-2">
            <div className="flex-1 border border-gray-300 flex items-end">
              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t.typeMessage}
                rows={1}
                className="flex-1 px-3 py-2 focus:outline-none resize-none"
                style={{ minHeight: '40px', maxHeight: '120px' }}
              />
              
              <div className="flex items-center gap-1 px-2 pb-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,application/pdf"
                  onChange={handleFileAttach}
                  className="hidden"
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1 hover:bg-gray-100 transition-colors"
                  title={t.attachFile}
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1 hover:bg-gray-100 transition-colors"
                  title={t.attachImage}
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
                
                <button className="p-1 hover:bg-gray-100 transition-colors">
                  <Smile className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className={`px-4 py-2 flex items-center gap-2 transition-colors ${
                messageInput.trim()
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              {t.send}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
