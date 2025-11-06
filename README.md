# Notes — Local-First Note-Taking App

A production-ready, privacy-focused note-taking application that works offline-first and syncs across devices. Built with React, TypeScript, and modern web technologies.

## Features

### MVP (Current)
- **Local-First Storage**: All data stored in IndexedDB via Dexie
- **Rich Text Editor**: TipTap (ProseMirror-based) with Markdown support
- **Full-Text Search**: Client-side search with MiniSearch
- **PWA Support**: Installable, offline-capable with service workers
- **Notebooks & Tags**: Organize notes with notebooks and tags
- **Import/Export**: Markdown, JSON, and ZIP formats
- **Dark Theme**: Premium dark UI with Tailwind CSS
- **Keyboard Shortcuts**: 
  - `Cmd/Ctrl+K`: Command Palette
  - `Cmd/Ctrl+N`: New Note
  - `Cmd/Ctrl+S`: Save (auto-saves)

### Pro Features (Scaffolded)
- **E2E Encryption**: Optional encryption with Web Crypto API
- **Sync Adapters**: Pluggable sync (Git, Supabase) - interfaces ready
- **Desktop App**: Tauri scaffold (coming soon)
- **Mobile App**: Capacitor scaffold (coming soon)

## Tech Stack

- **Frontend**: React 18, TypeScript (strict mode), Vite
- **UI**: Tailwind CSS, Radix UI primitives, Lucide icons
- **Editor**: TipTap with StarterKit
- **Database**: Dexie (IndexedDB wrapper)
- **Search**: MiniSearch
- **PWA**: vite-plugin-pwa with Workbox
- **Testing**: Vitest (unit), Playwright (e2e)
- **CI/CD**: GitHub Actions

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/kostasuser01gr/Crossplatformnotetakingapp.git
cd Crossplatformnotetakingapp

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will open at `http://localhost:3000`

### Building for Production

```bash
# Build the app
pnpm build

# Preview production build
pnpm preview
```

Output will be in the `dist/` directory.

### Testing

```bash
# Run unit tests
pnpm test

# Run tests in watch mode
pnpm test:ui

# Run e2e tests
pnpm e2e
```

### Linting & Formatting

```bash
# Lint code
pnpm lint

# Format code
pnpm format
```

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── AppShell/        # Main layout components
│   │   │   ├── AppShell.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── NoteList.tsx
│   │   │   ├── Editor.tsx
│   │   │   └── CommandPalette.tsx
│   ├── features/
│   │   ├── notes/
│   │   │   ├── types.ts      # TypeScript types
│   │   │   ├── db.ts         # Dexie schema
│   │   │   ├── repo.ts       # CRUD operations
│   │   │   ├── search.ts     # MiniSearch integration
│   │   │   ├── importExport.ts
│   │   │   └── encryption.ts # Optional E2E encryption
│   │   ├── settings/
│   │   ├── sync/
│   │   │   └── adapters/     # Sync adapter interfaces
│   │   └── platform/         # Platform abstraction
│   ├── pages/
│   │   └── Home.tsx
│   ├── lib/                  # Utilities
│   ├── app.tsx
│   └── main.tsx
├── e2e/                      # E2E tests
├── public/
│   └── icons/                # PWA icons
├── .github/
│   └── workflows/
│       └── ci.yml           # GitHub Actions CI
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Deployment

### Vercel (Web)

1. Push to GitHub.
2. Vercel Dashboard → **New Project** → Import this repo.
3. Settings:
   - Framework Preset: **Vite**
   - Install Command: `pnpm i --frozen-lockfile`
   - Build Command: `pnpm build`
   - Output Directory: `dist`
4. Click **Deploy**. You'll get a Preview URL. Promote to Production when ready.

#### CLI (optional)

```bash
pnpm dlx vercel@latest   # initial link
pnpm dlx vercel build    # local build
pnpm dlx vercel --prod   # production deploy
```

#### Verify

* SPA routing works on deep links (no 404 on refresh).
* PWA is installable and works offline (DevTools → Application → Service Workers → activated).
* Assets are hashed and cached.

The `vercel.json` configuration ensures SPA routing works correctly.

### Desktop (Tauri) - Coming Soon

```bash
# Install Tauri CLI
pnpm add -g @tauri-apps/cli

# Build for your platform
pnpm tauri build
```

### Mobile (Capacitor) - Coming Soon

```bash
# Add platforms
npx cap add ios
npx cap add android

# Build and sync
pnpm build
npx cap sync

# Open in Xcode/Android Studio
npx cap open ios
npx cap open android
```

## Data Layer

### Schema

- **Notebooks**: Organize notes into collections
- **Notes**: Rich content with metadata
- **Tags**: Cross-cutting organization
- **Revisions**: Version history (coming soon)
- **Attachments**: File attachments (coming soon)

### Storage

All data is stored locally in IndexedDB. Nothing leaves your device unless you enable sync.

### Encryption (Optional)

Enable E2E encryption in settings. Uses Web Crypto API with PBKDF2 key derivation and AES-GCM encryption.

## Roadmap

- [ ] Tauri desktop app with native features
- [ ] Capacitor mobile apps (iOS/Android)
- [ ] Git-based sync adapter
- [ ] Supabase sync adapter
- [ ] Real-time collaboration with Yjs
- [ ] Plugin system
- [ ] Kanban/whiteboard views
- [ ] OCR for images
- [ ] Advanced search (regex, filters)

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- Editor powered by [TipTap](https://tiptap.dev/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons by [Lucide](https://lucide.dev/)
