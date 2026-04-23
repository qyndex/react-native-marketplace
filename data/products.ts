/**
 * Fallback product data used when Supabase is unavailable.
 * The app fetches real listings from the database — this file
 * is kept for tests and offline-first scenarios.
 */
import type { Product } from '@/types/marketplace';

export const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Wireless Headphones', description: 'Premium over-ear headphones with ANC.', price: 79.99, category: 'Electronics', rating: 4.5, reviewCount: 312, inStock: true },
  { id: 'p2', name: 'Running Shoes', description: 'Lightweight shoes for long-distance runs.', price: 59.99, category: 'Sports', rating: 4.7, reviewCount: 198, inStock: true },
  { id: 'p3', name: 'Minimalist Desk Lamp', description: 'USB-C powered LED lamp with adjustable arm.', price: 34.99, category: 'Home', rating: 4.3, reviewCount: 87, inStock: true },
  { id: 'p4', name: 'Cotton Crew T-Shirt', description: '100% organic cotton, pre-shrunk.', price: 19.99, category: 'Clothing', rating: 4.6, reviewCount: 421, inStock: false },
  { id: 'p5', name: 'Mechanical Keyboard', description: 'Compact 75% layout with red switches.', price: 89.99, category: 'Electronics', rating: 4.8, reviewCount: 556, inStock: true },
  { id: 'p6', name: 'Yoga Mat', description: 'Non-slip 6mm thick exercise mat.', price: 24.99, category: 'Sports', rating: 4.4, reviewCount: 203, inStock: true },
];
