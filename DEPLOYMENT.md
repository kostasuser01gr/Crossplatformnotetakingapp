# Deployment Guide

## Quick Start

### Local Development
```bash
pnpm install
pnpm run dev
```
Visit http://localhost:3000

### Production Build
```bash
pnpm run build
pnpm run preview
```

## Vercel Deployment

### Option 1: GitHub Integration (Recommended)
1. Go to https://vercel.com
2. Import your GitHub repository
3. Configure:
   - Framework Preset: **Vite**
   - Build Command: `pnpm run build`
   - Output Directory: `dist`
   - Install Command: `pnpm install --frozen-lockfile`
4. Deploy!

### Option 2: Vercel CLI
```bash
pnpm dlx vercel@latest --prod
```

The `vercel.json` file is already configured for SPA routing.

## Environment Variables

No environment variables are required for the basic app. 

For future sync features, you may need:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

## PWA Configuration

The app is PWA-ready with:
- Service worker for offline support
- Web manifest for installation
- Icons (add 192x192 and 512x512 PNG icons to `public/icons/`)

## Performance Optimization

Current bundle size: ~620KB (gzipped: ~195KB)

To optimize:
1. Enable code splitting in `vite.config.ts`
2. Lazy load heavy components
3. Use dynamic imports for features

## Desktop (Tauri) - Coming Soon

```bash
pnpm add -D @tauri-apps/cli
pnpm run tauri dev
pnpm run tauri build
```

## Mobile (Capacitor) - Coming Soon

```bash
pnpm add -g @capacitor/cli
npx cap init
npx cap add ios
npx cap add android
pnpm run build && npx cap sync
npx cap open ios
npx cap open android
```

## Monitoring

Consider adding:
- Sentry for error tracking
- Analytics (privacy-focused like Plausible)
- Web Vitals monitoring

## Database Backups

All data is stored locally in IndexedDB. Users can:
1. Export notes as JSON
2. Export notes as Markdown
3. Use browser export tools

For production, consider implementing:
- Periodic auto-export to localStorage backup
- Cloud backup with encryption
- Sync to Git repository

## Security

- All sensitive operations use Web Crypto API
- No data sent to external servers (unless sync enabled)
- HTTPS required for service workers
- CSP headers recommended

Add to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
        }
      ]
    }
  ]
}
```
