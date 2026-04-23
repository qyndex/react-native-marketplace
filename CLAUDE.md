# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native Marketplace — Full marketplace with product catalog, search, cart, and checkout flow. State managed by Zustand; uses expo-router for deep-linking and Platform.select for responsive grid layouts.

Built with React Native (Expo), TypeScript, and NativeWind.

## Commands

```bash
npm install              # Install dependencies
npx expo start           # Start Expo dev server
npx expo start --ios     # Start iOS simulator
npx expo start --android # Start Android emulator
npm test                 # Run tests (Jest)
npx tsc --noEmit         # Type check
npm run lint             # ESLint
```

## Architecture

- `app/` — Expo Router file-based routing
- `components/` — Reusable React Native components
- `hooks/` — Custom hooks
- `lib/` or `utils/` — Utilities and API clients
- `assets/` — Images, fonts, and other static assets

## Rules

- TypeScript strict mode — no `any` types
- Use Expo SDK APIs over bare React Native where available
- NativeWind (Tailwind for RN) for styling
- Error boundaries around all screens
- Test with both iOS and Android
