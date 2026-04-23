import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import type { Listing, ListingWithSeller } from '@/types/marketplace';

/** Manage favorites for the current user */
export function useFavorites() {
  const user = useAuthStore((s) => s.user);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [favoriteListings, setFavoriteListings] = useState<ListingWithSeller[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavoriteIds(new Set());
      setFavoriteListings([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data } = await supabase
      .from('favorites')
      .select('listing_id, listing:listings(*, seller:profiles!seller_id(*))')
      .eq('user_id', user.id);

    if (data) {
      setFavoriteIds(new Set(data.map((f) => f.listing_id)));
      setFavoriteListings(
        data
          .map((f) => f.listing as unknown as ListingWithSeller)
          .filter(Boolean),
      );
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = async (listingId: string): Promise<boolean> => {
    if (!user) return false;

    if (favoriteIds.has(listingId)) {
      // Remove
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('listing_id', listingId);

      setFavoriteIds((prev) => {
        const next = new Set(prev);
        next.delete(listingId);
        return next;
      });
      setFavoriteListings((prev) => prev.filter((l) => l.id !== listingId));
      return false; // no longer favorited
    } else {
      // Add
      await supabase
        .from('favorites')
        .insert({ user_id: user.id, listing_id: listingId });

      setFavoriteIds((prev) => new Set(prev).add(listingId));
      // Refresh to get the listing data
      await fetchFavorites();
      return true; // now favorited
    }
  };

  const isFavorite = (listingId: string) => favoriteIds.has(listingId);

  return { favoriteListings, favoriteIds, loading, toggleFavorite, isFavorite, refresh: fetchFavorites };
}
