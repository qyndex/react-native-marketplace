import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Listing, ListingWithSeller, Category } from '@/types/marketplace';

/** Fetch active listings with optional search + category filter */
export function useListings(search: string, category: Category) {
  const [listings, setListings] = useState<ListingWithSeller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from('listings')
      .select('*, seller:profiles!seller_id(*)')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (category !== 'All') {
      query = query.eq('category', category);
    }

    if (search.trim()) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error: fetchError } = await query;

    if (fetchError) {
      setError(fetchError.message);
      setListings([]);
    } else {
      // Supabase returns seller as an object (single FK join)
      setListings((data ?? []) as unknown as ListingWithSeller[]);
    }
    setLoading(false);
  }, [search, category]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return { listings, loading, error, refresh: fetchListings };
}

/** Fetch a single listing by ID with seller profile */
export function useListing(id: string) {
  const [listing, setListing] = useState<ListingWithSeller | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      const { data } = await supabase
        .from('listings')
        .select('*, seller:profiles!seller_id(*)')
        .eq('id', id)
        .single();

      setListing(data as unknown as ListingWithSeller | null);
      setLoading(false);
    }
    fetch();
  }, [id]);

  return { listing, loading };
}

/** Create a new listing */
export function useCreateListing() {
  const [loading, setLoading] = useState(false);

  const create = async (
    listing: Omit<Listing, 'id' | 'created_at' | 'status'>,
  ): Promise<{ data: Listing | null; error: string | null }> => {
    setLoading(true);
    const { data, error } = await supabase
      .from('listings')
      .insert(listing)
      .select()
      .single();

    setLoading(false);
    return { data, error: error?.message ?? null };
  };

  return { create, loading };
}
