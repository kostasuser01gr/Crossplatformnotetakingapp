# Component Index - Fleet Management System

Complete reference of all components, their purpose, and relationships.

---

## 🎯 Core Application

### `/App.tsx`
**Purpose:** Main application entry point  
**Dependencies:** All main components, Context providers  
**State:**
- currentView (dashboard|gallery|chat|calendar|settings)
- language (en|el)
- useColors (boolean)
- selectedVehicleId (string|null)
- showAIChat (boolean)
- aiChatMinimized (boolean)

**Structure:**
```tsx
App (default export)
└── VehicleProvider
    └── PhotoProvider
        └── AppContent
            ├── Header
            ├── Navigation
            ├── Main Content (routes)
            ├── AIChatBot (floating)
            └── AI Toggle Button
```

**Exports:** `default App`

---

## 🔄 State Management

### `/components/VehicleContext.tsx`
**Purpose:** Centralized vehicle state management  
**Provides:**
- `vehicles: Vehicle[]` - All vehicles
- `setVehicles(vehicles: Vehicle[])` - Update all vehicles
- `getVehicleById(id: string)` - Find vehicle
- `updateVehicle(id, updates)` - Update vehicle
- `addLogToVehicle(vehicleId, log)` - Add activity log

**Usage:**
```tsx
import { useVehicles } from './components/VehicleContext';

function Component() {
  const { vehicles, addLogToVehicle } = useVehicles();
  // ...
}
```

**Exports:** `VehicleProvider`, `useVehicles`

---

### `/components/PhotoContext.tsx`
**Purpose:** Global photo state with watermarking  
**Provides:**
- `photos: Photo[]` - All photos
- `addPhoto(photo)` - Add new photo
- `getPhotosByVehicle(vehicleId)` - Filter by vehicle
- `getPhotosByCompany(company)` - Filter by company

**Usage:**
```tsx
import { usePhotos } from './components/PhotoContext';

function Component() {
  const { photos, addPhoto } = usePhotos();
  // ...
}
```

**Exports:** `PhotoProvider`, `usePhotos`

---

## 📊 Data & Utilities

### `/components/vehicle-data.ts`
**Purpose:** Type definitions and mock data generation  
**Exports:**
- `VehicleStatus` - Type: 'available' | 'maintenance' | 'cleaning' | 'out-of-service'
- `LogType` - Type: 'maintenance' | 'cleaning' | 'inspection' | 'damage' | 'fuel' | 'transfer' | 'other'
- `Company` - Type: 'europcar' | 'goldcar'
- `VehicleLog` - Interface
- `Vehicle` - Interface
- `ExcelMapping` - Interface
- `createMockVehicles()` - Function: Generate 30 mock vehicles

**Key Interfaces:**
```typescript
interface Vehicle {
  id: string;
  company: Company;
  plate: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  color: string;
  mileage: number;
  status: VehicleStatus;
  location: string;
  logs: VehicleLog[];
  images: string[];
  notes: string;
  lastService?: string;
  nextService?: string;
}

interface VehicleLog {
  id: string;
  type: LogType;
  timestamp: string;
  user: string;
  notes: string;
  mileage?: number;
  photos?: string[];
  metadata?: Record<string, any>;
}
```

---

### `/components/watermark-utils.ts`
**Purpose:** Photo watermarking functionality  
**Exports:**
- `addWatermarkToImage(file, vehiclePlate, company)` - Async function
  - Adds plate, date, time to image
  - Returns: Promise<string> (base64 data URL)

**Usage:**
```tsx
import { addWatermarkToImage } from './components/watermark-utils';

const watermarked = await addWatermarkToImage(file, 'ABC-1234', 'europcar');
```

---

## 🚗 Vehicle Management

### `/components/VehicleDashboard.tsx`
**Purpose:** Main fleet dashboard view  
**Props:**
- `language: Language`
- `useColors: boolean`
- `onVehicleSelect: (id: string) => void`

**State:**
- searchQuery (string)
- filterStatus (FilterStatus)
- filterCompany (FilterCompany)
- showImport (boolean)

**Features:**
- Vehicle grid display
- Real-time search
- Status filtering
- Company filtering
- Statistics cards
- Excel import integration

**Uses:** `useVehicles`, `ExcelImport`  
**Exports:** `VehicleDashboard`

---

### `/components/VehicleDetail.tsx`
**Purpose:** Detailed vehicle view with activity history  
**Props:**
- `vehicleId: string`
- `language: Language`
- `useColors: boolean`
- `onBack: () => void`

**State:**
- showLogEntry (boolean)
- selectedLogType (LogType | null)
- timeFilter ('all' | 'today' | 'week' | 'month')
- typeFilter (LogType | 'all')

**Features:**
- Complete vehicle information
- Activity history timeline
- Filtering (time + type)
- Quick action buttons
- Log entry modal

**Uses:** `useVehicles`, `VehicleLogEntry`  
**Exports:** `VehicleDetail`

---

### `/components/VehicleLogEntry.tsx`
**Purpose:** Modal form for adding/editing activity logs  
**Props:**
- `vehicle: Vehicle`
- `language: Language`
- `useColors: boolean`
- `initialLogType?: LogType | null`
- `onClose: () => void`
- `onSave: (log: Omit<VehicleLog, 'id'>) => void`

**State:**
- step (1 | 2 | 3) - Multi-step form
- logType (LogType)
- notes (string)
- mileage (number)
- cost (number)
- photos (File[])
- metadata (object)

**Features:**
- Multi-step form wizard
- Photo upload with preview
- Automatic watermarking
- Type-specific fields
- Validation

**Uses:** `usePhotos`, `watermark-utils`  
**Exports:** `VehicleLogEntry`

---

## 📸 Photo Management

### `/components/PhotoGallery.tsx`
**Purpose:** Photo gallery with filtering  
**Props:**
- `language: Language`
- `useColors: boolean`

**State:**
- viewMode ('grid' | 'list')
- filterCompany ('all' | 'europcar' | 'goldcar')
- searchQuery (string)
- selectedPhoto (Photo | null)

**Features:**
- Grid/list view toggle
- Company filtering
- Vehicle search
- Photo modal
- Download functionality
- Watermark display

**Uses:** `usePhotos`  
**Exports:** `PhotoGallery`

---

## 🤖 AI & Communication

### `/components/AIChatBot.tsx`
**Purpose:** AI-powered fleet assistant  
**Props:**
- `language: Language`
- `useColors: boolean`
- `vehicles: Vehicle[]`
- `onClose?: () => void`
- `isMinimized?: boolean`
- `onToggleMinimize?: () => void`

**State:**
- messages (Message[])
- input (string)
- isThinking (boolean)

**Features:**
- Natural language queries
- Fleet statistics
- Vehicle search
- Maintenance alerts
- Photo queries
- Quick questions
- Minimize/maximize

**AI Capabilities:**
- Vehicle status queries
- Availability checks
- Maintenance tracking
- Photo information
- Location data
- High mileage alerts
- Help and guidance

**Uses:** `usePhotos`, `vehicles` prop  
**Exports:** `AIChatBot`

---

### `/components/ChatInterface.tsx`
**Purpose:** Team communication channels  
**Props:**
- `language: Language`
- `useColors: boolean`

**State:**
- channels (Channel[])
- currentChannel (Channel)
- messages (Message[])
- messageInput (string)
- searchQuery (string)

**Features:**
- Channel-based messaging
- Direct messages
- File attachments
- Image sharing
- Message search
- User status

**Exports:** `ChatInterface`

---

## 📅 Calendar & Operations

### `/components/CalendarView.tsx`
**Purpose:** Vehicle operations scheduling  
**Props:**
- `language: Language`
- `useColors: boolean`

**State:**
- currentDate (Date)
- viewMode ('month' | 'week' | 'day')
- events (CalendarEvent[])
- selectedEvent (CalendarEvent | null)
- showEventModal (boolean)

**Features:**
- Month/week/day views
- Event scheduling
- Activity type filtering
- Vehicle assignment
- Staff assignment
- Event management

**Event Types:**
- cleaning
- inspection
- maintenance
- transfer
- service

**Exports:** `CalendarView`

---

## 📤 Data Import/Export

### `/components/ExcelImport.tsx`
**Purpose:** Bulk vehicle import from Excel  
**Props:**
- `language: Language`
- `useColors: boolean`
- `onImport: (vehicles: Vehicle[]) => void`
- `onClose: () => void`

**State:**
- selectedCompany (Company | null)
- file (File | null)
- isAnalyzing (boolean)
- columns (string[])
- mapping (ExcelMapping)
- previewData (any[])
- step (1 | 2 | 3)

**Features:**
- Company selection
- File upload (drag & drop)
- Column mapping
- Preview data
- Template download
- Bulk import

**Supported Formats:** .xlsx, .xls, .csv  
**Exports:** `ExcelImport`

---

## ⚙️ Settings & Configuration

### `/components/SettingsPanel.tsx`
**Purpose:** Application settings and preferences  
**Props:**
- `language: Language`
- `useColors: boolean`
- `onToggleColors: () => void`

**State:**
- notifications (boolean)
- offlineMode (boolean)
- cloudSync (boolean)
- requireAuth (boolean)
- dataEncryption (boolean)
- nfcAvailable (boolean)

**Features:**
- Appearance settings
- Language (handled in App.tsx)
- Color toggle
- Data management
- Export/import options
- System information
- Connectivity settings

**Exports:** `SettingsPanel`

---

## 🎨 UI Components (Shadcn)

Located in `/components/ui/`

### Core UI Components
- `button.tsx` - Button component
- `input.tsx` - Input field
- `textarea.tsx` - Text area
- `select.tsx` - Select dropdown
- `checkbox.tsx` - Checkbox
- `radio-group.tsx` - Radio buttons
- `switch.tsx` - Toggle switch
- `slider.tsx` - Range slider

### Layout Components
- `card.tsx` - Card container
- `dialog.tsx` - Modal dialog
- `sheet.tsx` - Slide-out panel
- `tabs.tsx` - Tab navigation
- `accordion.tsx` - Collapsible sections
- `separator.tsx` - Divider line

### Data Display
- `table.tsx` - Data table
- `avatar.tsx` - User avatar
- `badge.tsx` - Status badge
- `progress.tsx` - Progress bar
- `skeleton.tsx` - Loading placeholder
- `chart.tsx` - Recharts wrapper

### Navigation
- `navigation-menu.tsx` - Nav menu
- `breadcrumb.tsx` - Breadcrumbs
- `pagination.tsx` - Page navigation
- `menubar.tsx` - Menu bar

### Feedback
- `alert.tsx` - Alert message
- `alert-dialog.tsx` - Confirmation dialog
- `toast.tsx` - Toast notification
- `tooltip.tsx` - Tooltip

### Forms
- `form.tsx` - Form wrapper
- `label.tsx` - Form label
- `input-otp.tsx` - OTP input

### Advanced
- `calendar.tsx` - Calendar picker
- `carousel.tsx` - Image carousel
- `command.tsx` - Command palette
- `context-menu.tsx` - Right-click menu
- `dropdown-menu.tsx` - Dropdown
- `hover-card.tsx` - Hover popup
- `popover.tsx` - Popover
- `sidebar.tsx` - Sidebar navigation
- `scroll-area.tsx` - Scroll container
- `resizable.tsx` - Resizable panels

### Utilities
- `utils.ts` - cn() helper function
- `use-mobile.ts` - Mobile detection hook

---

## 🖼️ Figma Components

### `/components/figma/ImageWithFallback.tsx`
**Purpose:** Image component with fallback  
**Props:**
- `src: string`
- `alt: string`
- `className?: string`
- Other img attributes

**Features:**
- Automatic fallback on error
- Loading state
- Responsive

**Exports:** `ImageWithFallback`

---

## 📐 Component Relationships

### Data Flow
```
User Input
    ↓
Component (UI)
    ↓
Context (State)
    ↓
State Update
    ↓
Re-render (UI)
```

### Vehicle Management Flow
```
VehicleDashboard (list)
    ↓ select vehicle
VehicleDetail (view)
    ↓ add log
VehicleLogEntry (form)
    ↓ save
VehicleContext (state)
    ↓ update
VehicleDetail (refresh)
```

### Photo Upload Flow
```
VehicleLogEntry (upload)
    ↓ add photos
watermark-utils (watermark)
    ↓ process
PhotoContext (save)
    ↓ sync
PhotoGallery (display)
```

### AI Query Flow
```
User Question
    ↓
AIChatBot (parse)
    ↓ query data
VehicleContext + PhotoContext
    ↓ process
generateAIResponse()
    ↓ format
Display Response
```

---

## 🔍 Component Dependencies

### High-level Dependencies
- **App.tsx** → All components
- **VehicleDashboard** → VehicleContext, ExcelImport
- **VehicleDetail** → VehicleContext, VehicleLogEntry
- **VehicleLogEntry** → PhotoContext, watermark-utils
- **PhotoGallery** → PhotoContext
- **AIChatBot** → VehicleContext, PhotoContext

### Context Dependencies
- **VehicleContext** → vehicle-data (types)
- **PhotoContext** → None (standalone)

### Utility Dependencies
- **watermark-utils** → Browser Canvas API
- **vehicle-data** → None (standalone)

---

## 📦 Import Patterns

### Standard Component Import
```tsx
import { ComponentName } from './components/ComponentName';
```

### Context Import
```tsx
import { useVehicles } from './components/VehicleContext';
import { usePhotos } from './components/PhotoContext';
```

### Type Import
```tsx
import { Vehicle, VehicleLog, LogType } from './components/vehicle-data';
```

### Utility Import
```tsx
import { addWatermarkToImage } from './components/watermark-utils';
```

### UI Component Import
```tsx
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
```

---

## 🎯 Component Usage Examples

### Using VehicleDashboard
```tsx
<VehicleDashboard
  language="en"
  useColors={false}
  onVehicleSelect={(id) => setSelectedVehicleId(id)}
/>
```

### Using VehicleDetail
```tsx
<VehicleDetail
  vehicleId="vehicle-1"
  language="en"
  useColors={false}
  onBack={() => setSelectedVehicleId(null)}
/>
```

### Using AIChatBot
```tsx
<AIChatBot
  language="en"
  useColors={false}
  vehicles={vehicles}
  onClose={() => setShowAIChat(false)}
  isMinimized={false}
  onToggleMinimize={() => setMinimized(!minimized)}
/>
```

---

## 📊 Component Statistics

| Category | Count | Files |
|----------|-------|-------|
| Main Components | 9 | VehicleDashboard, VehicleDetail, etc. |
| Context Providers | 2 | VehicleContext, PhotoContext |
| Utilities | 2 | vehicle-data, watermark-utils |
| UI Components | 40+ | Shadcn UI library |
| Total Components | 50+ | All files |

---

## ✅ Component Checklist

### Production Ready
- [x] App.tsx
- [x] VehicleContext.tsx
- [x] PhotoContext.tsx
- [x] VehicleDashboard.tsx
- [x] VehicleDetail.tsx
- [x] VehicleLogEntry.tsx
- [x] PhotoGallery.tsx
- [x] AIChatBot.tsx
- [x] CalendarView.tsx
- [x] ChatInterface.tsx
- [x] SettingsPanel.tsx
- [x] ExcelImport.tsx
- [x] vehicle-data.ts
- [x] watermark-utils.ts

### All Components Tested
- [x] Rendering correctly
- [x] Props working
- [x] State management
- [x] Event handlers
- [x] Responsive design
- [x] Bilingual support
- [x] Error handling

---

*This index covers all components in the Fleet Management System.*
