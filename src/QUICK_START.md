# Quick Start Guide - Fleet Management System

Get up and running in 5 minutes! 🚀

## 🎯 What You'll Learn
- How to navigate the application
- How to manage vehicles
- How to use the AI assistant
- How to work with photos
- Essential workflows

---

## 📋 Table of Contents
1. [First Look](#first-look)
2. [Dashboard Overview](#dashboard-overview)
3. [Managing Vehicles](#managing-vehicles)
4. [Activity Logging](#activity-logging)
5. [Photo Management](#photo-management)
6. [AI Assistant](#ai-assistant)
7. [Quick Tips](#quick-tips)

---

## 🏁 First Look

When you open the app, you'll see:

```
┌─────────────────────────────────────────────────┐
│  Fleet Manager                         [EN] ΕΛ  │ ← Header
├─────────────────────────────────────────────────┤
│  Dashboard  Gallery  Chat  Calendar  Settings   │ ← Navigation
├─────────────────────────────────────────────────┤
│                                                  │
│  [Search box]  [Filters]  [Import Excel]        │
│                                                  │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐        │
│  │Vehicle│  │Vehicle│  │Vehicle│  │Vehicle│       │ ← Vehicle Grid
│  └──────┘  └──────┘  └──────┘  └──────┘        │
│                                                  │
└─────────────────────────────────────────────────┘
                                        [AI Bot] ← Floating AI Assistant
```

---

## 📊 Dashboard Overview

### Key Elements

**1. Search Bar**
- Type vehicle plate, model, or VIN
- Real-time filtering
- Example: "ABC" finds all plates starting with ABC

**2. Status Filters**
- All
- Available (ready to use)
- Maintenance (in service)
- Cleaning (being cleaned)
- Out of Service

**3. Company Filter**
- All Companies
- Europcar
- Goldcar

**4. Statistics Cards**
```
┌─────────────────────────────────────┐
│ Total Vehicles: 30                  │
│ ✓ Available: 12                     │
│ 🔧 Maintenance: 5                    │
│ ✨ Cleaning: 3                       │
└─────────────────────────────────────┘
```

---

## 🚗 Managing Vehicles

### Viewing Vehicle Details

**Step 1:** Click any vehicle card  
**Step 2:** See complete information:
- License plate, VIN, make, model
- Current status and location
- Mileage
- Recent activity history

**Step 3:** Take actions:
- Add new log entry
- View full history
- Filter activities

### Quick Actions

From vehicle detail page, click quick action buttons:

```
[🧹 Cleaning]  [🔧 Maintenance]  [📋 Inspection]
[⛽ Refuel]    [🚚 Transfer]     [📝 Other]
```

These pre-fill the log entry form with the selected type.

---

## 📝 Activity Logging

### Adding a Log Entry

**1. Navigate to Vehicle Detail**
```
Dashboard → Click Vehicle → "Add Log Entry"
```

**2. Fill Out Form**
```
┌─────────────────────────────────┐
│ Select Activity Type            │
│ ○ Cleaning                      │
│ ● Maintenance    ← Select one   │
│ ○ Inspection                    │
│ ○ Fuel                          │
│ ○ Transfer                      │
│ ○ Other                         │
├─────────────────────────────────┤
│ Notes:                          │
│ [Oil change and filter...     ] │
├─────────────────────────────────┤
│ Mileage: [45,230] km            │
├─────────────────────────────────┤
│ Cost: [$250.00]    (optional)   │
├─────────────────────────────────┤
│ Upload Photos:                  │
│ [Drop files here or browse]     │
└─────────────────────────────────┘
```

**3. Upload Photos (Optional)**
- Drag and drop images
- Or click to browse
- Photos automatically get watermarked with:
  - Vehicle plate
  - Date and time
  - Company identifier

**4. Save**
- Click "Save Entry"
- Log appears instantly in history
- Photos sync to gallery

### Viewing Activity History

**Filters Available:**
- All Logs
- Today
- This Week
- This Month
- By Type (cleaning, maintenance, etc.)

**Information Shown:**
- Date and time
- Activity type
- User who logged it
- Notes and details
- Attached photos
- Costs (if applicable)

---

## 📸 Photo Management

### Accessing Gallery

```
Navigation Bar → Gallery
```

### Features

**1. View Modes**
- Grid view (default)
- List view

**2. Filters**
- Company (Europcar/Goldcar)
- Vehicle plate search

**3. Photo Details**
Each photo shows:
- Vehicle plate (watermarked)
- Date/time (watermarked)
- Activity type
- Uploaded by

**4. Actions**
- View full size
- Download individual
- Download all

### Watermark Information

Every photo includes:
```
┌──────────────────────────┐
│                          │
│   ABC-1234      ←Plate   │
│   2024-11-05    ←Date    │
│   14:30         ←Time    │
│                          │
│   [PHOTO CONTENT]        │
│                          │
└──────────────────────────┘
```

---

## 🤖 AI Assistant

### Opening the Assistant

**Method 1:** Click the floating bot icon (bottom-right)  
**Method 2:** It's open by default!

### Quick Questions

Try these examples:

**Fleet Statistics**
```
You: "How many vehicles do we have?"
AI: "You have 30 vehicles total:
     🚗 Europcar: 15
     🚙 Goldcar: 15"
```

**Availability**
```
You: "Show me available Europcar vehicles"
AI: "There are 6 Europcar vehicles available:
     • ABC-1001 - Toyota Corolla at Main Office
     • ABC-1002 - BMW 3 Series at Airport
     ..."
```

**Maintenance Status**
```
You: "Which vehicles need maintenance?"
AI: "Currently, 5 vehicles are in maintenance:
     • ABC-1005 (Toyota RAV4) - 45,230 km
     • ABC-1010 (Mercedes C-Class) - 67,890 km
     ..."
```

**Specific Vehicle**
```
You: "ABC-1234"
AI: "Found vehicle ABC-1234:
     🚗 Toyota Corolla (2022)
     📍 Location: Main Office
     📊 Status: Available
     ⏱️ Mileage: 35,450 km
     Recent Activity: ..."
```

**Photo Queries**
```
You: "Show me recent photos"
AI: "You have 47 photos in the gallery.
     Most recent:
     • ABC-1001 - Maintenance (Nov 5)
     • ABC-1234 - Cleaning (Nov 4)
     ..."
```

### AI Features

✅ Natural language understanding  
✅ Bilingual (English/Greek)  
✅ Context-aware responses  
✅ Quick question suggestions  
✅ Minimize/maximize interface  
✅ New chat button  

---

## 💡 Quick Tips

### Navigation
- Use top navigation bar to switch between sections
- Click "Dashboard" anytime to return to main view
- Back button in vehicle detail returns to dashboard

### Language
- Toggle EN/ΕΛ in top-right corner
- Entire app switches instantly
- Includes dates, numbers, all text

### Colors
- Settings → Toggle "Enable Colors"
- Switches between monochrome and color highlights
- Applies app-wide

### Search
- Dashboard search is real-time
- Type as you go, no need to press Enter
- Searches plate, model, VIN

### Filters
- Use multiple filters together
- Status + Company + Search all work together
- Reset by clicking "All"

### Excel Import
1. Dashboard → "Import Excel"
2. Select company (Europcar/Goldcar)
3. Upload file
4. Map columns (auto-detected)
5. Review and import

### Calendar
- Schedule future activities
- View by month, week, or day
- Assign staff to activities
- Track vehicle schedules

### Team Chat
- Internal communication
- Share files and images
- Channel-based organization
- Direct messages

---

## 🎯 Common Workflows

### Workflow 1: Vehicle Returns to Cleaning
```
1. Dashboard → Find vehicle
2. Click vehicle card
3. Quick action: "Cleaning"
4. Add notes: "Post-rental cleaning"
5. Upload before/after photos
6. Save
✅ Status updated, photos in gallery
```

### Workflow 2: Schedule Maintenance
```
1. Navigation → Calendar
2. Click "Schedule Activity"
3. Select vehicle
4. Choose date/time
5. Type: Maintenance
6. Assign staff member
7. Save
✅ Appears on calendar, reminder set
```

### Workflow 3: Check Fleet Status
```
1. Click AI chat icon
2. Ask: "Fleet status"
3. Review response
4. Ask follow-up: "Show maintenance vehicles"
5. Get detailed list
✅ Quick overview without navigation
```

### Workflow 4: Bulk Import Vehicles
```
1. Dashboard → "Import Excel"
2. Select company
3. Upload spreadsheet
4. Map: Plate→A, Model→B, etc.
5. Preview data
6. Import
✅ All vehicles added instantly
```

---

## ⚡ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open AI Chat | Click bot icon |
| Search Dashboard | Click search, start typing |
| New Log Entry | Button in vehicle detail |
| Switch Language | Header toggle |
| Navigate Sections | Top nav buttons |

---

## 🆘 Troubleshooting

**Photos not showing?**
- Check PhotoGallery section
- Photos are automatically watermarked
- May take a moment to process

**Vehicle not updating?**
- Make sure to click "Save"
- Changes are instant once saved
- Refresh if needed

**AI not responding?**
- Check if chat is minimized
- Try asking a different way
- Use suggested quick questions

**Can't find vehicle?**
- Check search spelling
- Try partial plate (e.g., "ABC")
- Reset all filters

---

## 🎓 Pro Tips

1. **Use Quick Actions** - Faster than full form for common tasks
2. **AI First** - Ask AI before navigating manually
3. **Bulk Operations** - Use Excel import for multiple vehicles
4. **Photo Everything** - Document all activities with photos
5. **Filter Smart** - Combine status + company for precise results
6. **Schedule Ahead** - Use calendar for planning
7. **Team Chat** - Communicate instead of walking around
8. **Regular Exports** - Settings → Export data for backups

---

## 📚 Next Steps

Once you're comfortable:

1. Explore **Calendar** for scheduling
2. Try **Team Chat** for communication
3. Experiment with **Excel Import**
4. Customize in **Settings**
5. Master **AI Assistant** queries

---

## 🎉 You're Ready!

You now know how to:
- ✅ Navigate the application
- ✅ Manage vehicles and activities
- ✅ Use the AI assistant
- ✅ Work with photos
- ✅ Import data
- ✅ Communicate with team

**Happy Fleet Managing! 🚗💨**

---

*Need more help? Check README.md for detailed documentation.*
