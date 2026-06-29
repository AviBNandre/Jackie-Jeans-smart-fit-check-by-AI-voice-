# Jackie Jeans – Smart Fit Onboarding

A premium mobile-first onboarding experience for Jackie Jeans that helps users find their perfect denim fit through either a Manual Quiz or AI Voice Stylist.

## Features

- **Manual Fit Quiz** – 10-step wizard collecting measurements, style preferences, and brand history
- **AI Voice Stylist** – Fully voice-driven onboarding using Web Speech API
- **Dark Mode** – Full dark mode support
- **Local Storage** – Answers persist across sessions
- **Framer Motion Animations** – Smooth transitions throughout
- **Mobile-First** – Optimized for touch devices

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Framer Motion
- Web Speech API (SpeechRecognition + SpeechSynthesis)
- React Hook Form + Zod
- LocalStorage persistence

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

Deploy to Vercel with one click or via CLI:

```bash
npm install -g vercel
vercel
```

## Browser Support

- Voice features require Chrome, Edge, or Safari (desktop/mobile)
- All other features work in any modern browser

## Project Structure

```
app/
  page.tsx          # Landing page
  manual/page.tsx   # Manual quiz wizard
  voice/page.tsx    # AI Voice Stylist
  summary/page.tsx  # Review & submit
  complete/page.tsx # Completion screen
components/
  ui/               # shadcn/ui components
  manual/           # Quiz-specific components
  voice/            # Voice assistant
  shared/           # Shared layout components
hooks/              # Custom hooks
types/              # TypeScript interfaces
data/               # Questions & brands data
lib/                # Utilities
```
