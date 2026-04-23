# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native Marketplace -- a full-featured peer-to-peer mobile marketplace app (think OfferUp / Craigslist). Built with Expo SDK 55, TypeScript strict mode, expo-router for file-based navigation, Supabase for auth/database/realtime, and Zustand for client state. Supports iOS, Android, and web via react-native-web.

Features: user authentication (email/password), listing browse/search/filter, listing detail with seller profiles, create/manage listings, direct messaging with real-time updates, favorites, and a shopping cart with checkout flow.

## Commands

```bash
# Install & run
npm install              # Install dependencies
npx expo start           # Start Expo dev server (press i/a/w for platform)
npx expo start --ios     # Start iOS simulator
npx expo start --android # Start Android emulator
npx expo start --web     # Start web dev server

# Database (Supabase)
npx supabase start       # Start local Supabase (Postgres, Auth, Realtime)
npx supabase db reset    # Reset database and re-run migrations + seed
npx supabase stop        # Stop local Supabase
npx supabase gen types typescript --local > types/database.ts  # Regenerate DB types

# Testing & linting
npm test                 # Run Jest test suite
npm test -- --coverage   # Run tests with coverage report
npx tsc --noEmit         # Type check without emitting
npm run lint             # ESLint for .ts/.tsx files

# Build
npm run build:web        # Export static web build
```

## Quick Start

```bash
cp .env.example .env
npx supabase start          # note the anon key from output
# Paste EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY into .env
npx supabase db reset       # apply migrations + seed data (5 users, 15 listings)
npm install
npx expo start
```

## Architecture

### Navigation (expo-router file-based)
- `app/_layout.tsx` -- Root Stack navigator, initializes auth on mount
- `app/(tabs)/_layout.tsx` -- Bottom tab bar: Browse, Favorites, Messages, Profile
- `app/(tabs)/index.tsx` -- Main browse screen with search, category filters, listing grid
- `app/(tabs)/favorites.tsx` -- User's saved listings
- `app/(tabs)/messages.tsx` -- Conversation threads inbox
- `app/(tabs)/profile.tsx` -- User profile, edit, create/manage listings, sign out
- `app/auth/sign-in.tsx` -- Email/password sign in
- `app/auth/sign-up.tsx` -- Account creation with name
- `app/listing/[id].tsx` -- Listing detail with seller info, favorite toggle, message seller
- `app/message/[userId].tsx` -- Real-time chat thread with a specific user about a listing
- `app/create-listing.tsx` -- New listing form (title, description, price, category, image URL)
- `app/my-listings.tsx` -- Manage own listings (mark sold, archive, reactivate)
- `app/cart` -- Shopping cart (modal)
- `app/checkout` -- Checkout flow
- `app/order-confirmation` -- Order success

### Data Layer
- `lib/supabase.ts` -- Supabase client with AsyncStorage persistence
- `hooks/useListings.ts` -- `useListings(search, category)`, `useListing(id)`, `useCreateListing()`
- `hooks/useMessages.ts` -- `useConversations()`, `useThread(userId, listingId)` with real-time subscription
- `hooks/useFavorites.ts` -- `useFavorites()` with `toggleFavorite()`, `isFavorite()` helpers
- `store/authStore.ts` -- Zustand store: session, profile, signIn/signUp/signOut, updateProfile
- `store/cartStore.ts` -- Zustand store: cart items, quantities, totals

### Types
- `types/database.ts` -- Supabase-generated table types (profiles, listings, messages, favorites)
- `types/marketplace.ts` -- App-level types: `Listing`, `Profile`, `Message`, `Conversation`, `ListingWithSeller`, `Product` (legacy cart compat), `listingToProduct()` converter, `CATEGORIES` constant

### Components
- `components/ProductCard.tsx` -- Reusable card with image (or placeholder), seller name, price, add-to-cart

### Database Schema (Supabase)
- `supabase/migrations/20240101000000_initial_schema.sql` -- profiles, listings, messages, favorites with RLS
- `supabase/seed.sql` -- 5 users, 15 listings across categories, 10 messages, 8 favorites
- `supabase/config.toml` -- Local Supabase project configuration

Tables:
- `profiles` -- id (uuid, FK auth.users), email, full_name, avatar_url, bio, created_at
- `listings` -- id (uuid), seller_id (FK profiles), title, description, price, category, image_urls[], status, created_at
- `messages` -- id (uuid), sender_id, recipient_id, listing_id, content, read, created_at
- `favorites` -- id (uuid), user_id, listing_id, created_at, UNIQUE(user_id, listing_id)

RLS policies: listings publicly readable when active, messages accessible by sender/recipient only, favorites user-scoped. Auto-creates profile on auth.users signup via trigger.

## Key Patterns

- **Auth flow**: `useAuthStore.initialize()` runs on app mount, restores session from AsyncStorage. Auth state change listener keeps session synced. Protected features (favorites, messages, profile) show sign-in prompts when unauthenticated.
- **State management**: Zustand for auth + cart (client state). Custom hooks wrapping Supabase queries for server state. No TanStack Query -- direct async/await in hooks with useState.
- **Real-time messaging**: `useThread()` subscribes to Supabase Realtime (postgres_changes) for instant message delivery. Auto-marks received messages as read.
- **Theming**: `useColorScheme()` hook returns `'light' | 'dark'`; index into `Colors[colorScheme]` for themed values.
- **Navigation**: expo-router file-based routing. Push with `router.push({ pathname: '/listing/[id]', params: { id } })`.
- **Responsive layout**: `Platform.select({ web: 3, default: 2 })` for grid columns in FlatList.
- **Accessibility**: All TouchableOpacity elements have `accessibilityLabel` props.

## Testing

Tests live in `__tests__/` using Jest + jest-expo preset + @testing-library/react-native. Supabase is mocked globally in `jest.setup.js`.

```bash
npm test                                    # Run all tests
npm test -- --watch                         # Watch mode
npm test -- --coverage                      # Coverage report
npm test -- __tests__/authStore             # Run specific test file
```

Test files:
- `__tests__/cartStore.test.ts` -- Cart store logic (add, remove, update, clear, totals)
- `__tests__/authStore.test.ts` -- Auth store (initialize, signIn/signUp/signOut, profile)
- `__tests__/marketplace-types.test.ts` -- listingToProduct converter, CATEGORIES constant
- `__tests__/ProductCard.test.tsx` -- Component rendering, accessibility, user interactions
- `__tests__/products.test.ts` -- Fallback mock data integrity
- `__tests__/Colors.test.ts` -- Theme structure validation
- `__tests__/useColorScheme.test.ts` -- Hook fallback behavior

## Rules

- TypeScript strict mode -- no `any` types
- Use Expo SDK APIs over bare React Native where available
- All interactive elements must have `accessibilityLabel`
- Zustand for client state (auth, cart); custom hooks for server state (listings, messages, favorites)
- Module path aliases: `@/` maps to project root (configured in tsconfig.json `paths`)
- Colors via theme tokens from `constants/Colors.ts` -- never hardcode colors inline (except #fff for badge/button text)
- All Supabase queries go through hooks or stores -- never call `supabase.from()` directly in components
- Cart operations must handle edge cases: duplicate adds increment quantity, zero/negative quantity removes item
- RLS policies must exist on every table -- never rely on client-side filtering for security
- Test with both iOS and Android before shipping

## Environment Variables

See `.env.example` for all available configuration. Copy to `.env` to customize.

Required:
- `EXPO_PUBLIC_SUPABASE_URL` -- Supabase API URL (local: `http://127.0.0.1:54321`)
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` -- Supabase anonymous key

Optional:
- `STRIPE_PUBLISHABLE_KEY` -- For checkout integration
- `ANALYTICS_ENABLED` / `ANALYTICS_KEY` -- For analytics
