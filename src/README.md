# Fleet Management System

A comprehensive car rental fleet management application built with React and TypeScript, designed for internal staff operations.

## 🚀 Features

### Core Functionality
- **Vehicle Management Dashboard** - Manage your entire fleet with real-time status updates
- **Activity Logging** - Track cleaning, maintenance, inspections, fuel, transfers, and custom activities
- **Photo Gallery** - Automatic photo watermarking with vehicle plate, date, and time stamps
- **AI Assistant** - Intelligent chatbot for fleet queries and operations guidance
- **Operations Calendar** - Schedule and track vehicle activities
- **Team Chat** - Internal communication channels
- **Excel Import** - Bulk import vehicles from Europcar and Goldcar files

### Key Capabilities
- ✅ Bilingual Support (English/Greek)
- ✅ Monochrome Design with Optional Color Highlights
- ✅ Fast, Responsive, and Production-Ready
- ✅ Real-time Data Synchronization
- ✅ Automatic Photo Watermarking
- ✅ Company Filtering (Europcar/Goldcar)
- ✅ Advanced Search and Filtering
- ✅ Mobile and Desktop Optimized

## 🏗️ Architecture

### State Management
The application uses React Context API for centralized state management:

```
App (Root)
├── VehicleProvider (Vehicle State)
│   └── PhotoProvider (Photo State)
│       └── AppContent (Main Application)
```

### Context Providers

**VehicleProvider** (`/components/VehicleContext.tsx`)
- Manages all vehicle data
- CRUD operations for vehicles
- Log entry management
- Mileage tracking

**PhotoProvider** (`/components/PhotoContext.tsx`)
- Global photo state
- Automatic watermarking
- Company-based filtering
- Vehicle association

## 📁 Project Structure

```
/
├── App.tsx                          # Main application entry point
├── components/
│   ├── VehicleContext.tsx          # Vehicle state management
│   ├── PhotoContext.tsx            # Photo state management
│   ├── vehicle-data.ts             # Types and mock data generator
│   ├── watermark-utils.ts          # Photo watermarking utilities
│   ├── VehicleDashboard.tsx        # Main dashboard view
│   ├── VehicleDetail.tsx           # Vehicle details and logs
│   ├── VehicleLogEntry.tsx         # Add/edit log entries
│   ├── PhotoGallery.tsx            # Photo gallery view
│   ├── AIChatBot.tsx               # AI assistant chatbot
│   ├── CalendarView.tsx            # Operations calendar
│   ├── ChatInterface.tsx           # Team chat
│   ├── SettingsPanel.tsx           # Settings and preferences
│   ├── ExcelImport.tsx             # Excel import functionality
│   └── ui/                         # Shadcn UI components
└── styles/
    └── globals.css                 # Global styles
```

## 🎯 Core Components

### VehicleDashboard
- Fleet overview with statistics
- Advanced filtering (status, company, search)
- Quick action buttons
- Excel import integration
- Responsive grid layout

### VehicleDetail
- Complete vehicle information
- Activity history with filtering
- Quick action buttons for common tasks
- Real-time log updates
- Photo management

### VehicleLogEntry
- Multi-step log entry form
- Photo upload with preview
- Automatic watermarking
- Mileage tracking
- Custom notes and metadata

### PhotoGallery
- Grid and list view modes
- Company filtering
- Vehicle search
- Download functionality
- Watermark information display

### AIChatBot
- Natural language queries
- Fleet statistics
- Vehicle search by plate
- Maintenance alerts
- Location queries
- Photo gallery information
- Bilingual responses

### CalendarView
- Month/week/day views
- Schedule vehicle operations
- Event management
- Activity type filtering

## 🔧 Data Types

### Vehicle
```typescript
interface Vehicle {
  id: string;
  company: 'europcar' | 'goldcar';
  plate: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  color: string;
  mileage: number;
  status: 'available' | 'maintenance' | 'cleaning' | 'out-of-service';
  location: string;
  logs: VehicleLog[];
  images: string[];
  notes: string;
  lastService?: string;
  nextService?: string;
}
```

### VehicleLog
```typescript
interface VehicleLog {
  id: string;
  type: 'maintenance' | 'cleaning' | 'inspection' | 'damage' | 'fuel' | 'transfer' | 'other';
  timestamp: string;
  user: string;
  notes: string;
  mileage?: number;
  photos?: string[];
  metadata?: {
    maintenanceType?: string;
    damageDescription?: string;
    fuelLevel?: number;
    cost?: number;
    location?: string;
    transferFrom?: string;
    transferTo?: string;
    [key: string]: any;
  };
}
```

### Photo
```typescript
interface Photo {
  id: string;
  url: string;
  vehiclePlate: string;
  vehicleId: string;
  company: 'europcar' | 'goldcar';
  timestamp: string;
  logType?: string;
  uploadedBy: string;
  watermarked: boolean;
}
```

## 🎨 Design System

### Colors
The application uses a monochrome design by default with optional color highlights:

**Monochrome Mode:**
- Black (#000000)
- White (#FFFFFF)
- Gray shades (#F9FAFB to #111827)

**Color Mode (Optional):**
- Primary: Blue (#3B82F6)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Danger: Red (#EF4444)
- Info: Purple (#8B5CF6)

### Typography
Custom typography tokens in `styles/globals.css`:
- Font family: System font stack
- Responsive font sizes
- Proper line heights

## 🚦 Usage Guide

### Adding a Vehicle Log Entry
1. Navigate to vehicle detail page
2. Click "Add Log Entry" or use quick action buttons
3. Select log type (cleaning, maintenance, etc.)
4. Enter details and notes
5. Upload photos (optional)
6. Photos are automatically watermarked
7. Save entry

### Using the AI Assistant
1. Click the AI chat icon (bottom-right)
2. Ask questions in natural language:
   - "How many vehicles need maintenance?"
   - "Show me available Europcar vehicles"
   - "Search for ABC-1234"
   - "What are the latest photos?"
3. Get instant, intelligent responses

### Importing Excel Data
1. Go to Dashboard
2. Click "Import Excel"
3. Select company (Europcar/Goldcar)
4. Upload Excel file
5. Map columns to system fields
6. Review and import

### Managing Photos
1. Navigate to Photo Gallery
2. Filter by company or vehicle
3. Search by plate number
4. Download individual or all photos
5. View watermark details

## 🔐 Security Notes

- This is a frontend-only application
- All data is stored in local state
- No backend or database integration
- Not designed for collecting PII or sensitive data
- For production use, integrate with a proper backend

## 🌍 Internationalization

The application supports:
- **English** - Full support
- **Greek (Ελληνικά)** - Full support

Switch languages using the header toggle button.

## 📱 Responsive Design

Optimized for:
- Desktop (1920px+)
- Laptop (1280px+)
- Tablet (768px+)
- Mobile (320px+)

## ⚡ Performance

- Optimized with React.memo and useMemo
- Efficient re-rendering with Context selectors
- Fast filtering and searching
- Lazy loading for images
- Minimal bundle size

## 🛠️ Technologies

- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Lucide React** - Icons
- **Canvas API** - Watermarking
- **Shadcn UI** - Component library

## 📝 Best Practices

1. **State Management**: All vehicle and photo state is centralized in Context providers
2. **Photo Uploads**: Photos are automatically watermarked before being added to the gallery
3. **Type Safety**: Full TypeScript coverage for all components and utilities
4. **Performance**: Use useMemo for expensive computations
5. **Accessibility**: Semantic HTML and ARIA labels where needed

## 🔄 Data Flow

```
User Action → Component → Context Provider → State Update → Re-render
                    ↓
            Photo Upload → Watermark → PhotoContext → Gallery
                    ↓
            Log Entry → VehicleContext → Vehicle Update → Dashboard
```

## 📦 Mock Data

The application includes a mock data generator (`createMockVehicles()`) that creates:
- 30 sample vehicles
- Mixed Europcar and Goldcar fleet
- Realistic log entries
- Various vehicle statuses
- Different locations

## 🎯 Future Enhancements

- Backend integration with Supabase
- Real-time collaboration features
- Advanced reporting and analytics
- PDF export functionality
- Email notifications
- Mobile app version (React Native)
- Offline mode with service workers
- Multi-user authentication

## 📄 License

This is a proprietary fleet management system for internal use.

---

Built with ❤️ for efficient fleet operations management.
