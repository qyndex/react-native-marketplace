import type { Database } from './database';

/** Profile row from Supabase */
export type Profile = Database['public']['Tables']['profiles']['Row'];

/** Listing row from Supabase */
export type Listing = Database['public']['Tables']['listings']['Row'];

/** Message row from Supabase */
export type Message = Database['public']['Tables']['messages']['Row'];

/** Favorite row from Supabase */
export type Favorite = Database['public']['Tables']['favorites']['Row'];

/** Listing with seller profile joined */
export interface ListingWithSeller extends Listing {
  seller: Profile;
}

/** Conversation thread grouped by the other party + listing */
export interface Conversation {
  otherUser: Profile;
  listing: Listing | null;
  lastMessage: Message;
  unreadCount: number;
}

/** Category list for filter chips */
export const CATEGORIES = [
  'All',
  'Electronics',
  'Clothing',
  'Home',
  'Sports',
] as const;

export type Category = (typeof CATEGORIES)[number];

/** Legacy Product type — kept for cart store backward compatibility */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
}

/** Convert a Listing to a legacy Product for the cart store */
export function listingToProduct(listing: Listing): Product {
  return {
    id: listing.id,
    name: listing.title,
    description: listing.description,
    price: Number(listing.price),
    category: listing.category,
    rating: 0,
    reviewCount: 0,
    inStock: listing.status === 'active',
  };
}
