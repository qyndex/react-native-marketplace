# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native Marketplace -- a full-featured mobile marketplace app with product catalog, search/filter, shopping cart, and checkout flow. Built with Expo SDK 51, TypeScript strict mode, expo-router for file-based navigation, and Zustand for state management. Supports iOS, Android, and web via react-native-web.

## Commands

```bash
npm install              # Install dependencies
npx expo start           # Start Expo dev server (press i/a/w for platform)
npx expo start --ios     # Start iOS simulator
npx expo start --android # Start Android emulator
npx expo start --web     # Start web dev server
npm test                 # Run Jest test suite
npm test -- --coverage   # Run tests with coverage report
npx tsc --noEmit         # Type check without emitting
npm run lint             # ESLint for .ts/.tsx files
npm run build:web        # Export static web build
```

## Architecture

- `app/` -- Expo Router file-based routing (tabs layout with shop, product detail, cart, checkout, order confirmation)
- `app/_layout.tsx` -- Root Stack navigator with GestureHandlerRootView wrapper
- `app/(tabs)/index.tsx` -- Main shop screen with search, category filters, and product grid
- `components/ProductCard.tsx` -- Reusable product card with image placeholder, rating, price, and add-to-cart
- `store/cartStore.ts` -- Zustand store managing cart items, quantities, totals (add/remove/update/clear)
- `hooks/useColorScheme.ts` -- Safe wrapper around RN useColorScheme (defaults to 'light')
- `constants/Colors.ts` -- Light/dark theme color tokens (orange tint palette)
- `data/products.ts` -- Mock product catalog (6 items across 4 categories)
- `types/marketplace.ts` -- Product type definition (id, name, description, price, category, rating, reviewCount, inStock)
- `src/` -- Contains stub files (not used at runtime; real implementations are in root-level directories)

## Key Patterns

- **State management**: Zustand store at `store/cartStore.ts` with `create<CartStore>()` pattern. Access via `useCartStore()` hook with selectors for `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `totalItems()`, `totalPrice()`.
- **Theming**: `useColorScheme()` hook returns `'light' | 'dark'`; index into `Colors[colorScheme]` for themed values.
- **Navigation**: expo-router file-based routing. Push with `router.push({ pathname: '/product/[id]', params: { id } })`.
- **Responsive layout**: `Platform.select({ web: 3, default: 2 })` for grid columns in FlatList.
- **Accessibility**: All TouchableOpacity elements have `accessibilityLabel` props. Cart badge announces item count.

## Testing

Tests live in `__tests__/` using Jest + jest-expo preset + @testing-library/react-native.

```bash
npm test                           # Run all tests
npm test -- --watch                # Watch mode
npm test -- --coverage             # Coverage report
npm test -- __tests__/cartStore    # Run specific test file
```

Test files:
- `__tests__/cartStore.test.ts` -- Cart store logic (add, remove, update, clear, totals)
- `__tests__/ProductCard.test.tsx` -- Component rendering, accessibility, user interactions
- `__tests__/products.test.ts` -- Mock data integrity (unique IDs, valid prices/ratings)
- `__tests__/Colors.test.ts` -- Theme structure validation (both themes have matching keys, valid hex values)
- `__tests__/useColorScheme.test.ts` -- Hook fallback behavior (null/undefined defaults to 'light')

## Rules

- TypeScript strict mode -- no `any` types
- Use Expo SDK APIs over bare React Native where available
- All interactive elements must have `accessibilityLabel`
- Zustand for global state; React state for local UI state
- Module path aliases: `@/` maps to project root (configured in tsconfig.json `paths`)
- Colors via theme tokens from `constants/Colors.ts` -- never hardcode colors inline (except #fff for badge/button text)
- Product type must match the interface in `types/marketplace.ts`
- Cart operations must handle edge cases: duplicate adds increment quantity, zero/negative quantity removes item
- Test with both iOS and Android before shipping

## Environment Variables

See `.env.example` for all available configuration. Copy to `.env` to customize. Expo public vars use `EXPO_PUBLIC_` prefix.
