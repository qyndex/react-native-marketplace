import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import type { Listing } from '@/types/marketplace';

export default function MyListingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const user = useAuthStore((s) => s.user);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('listings')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });
    setListings(data ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleStatusChange = async (listing: Listing, newStatus: Listing['status']) => {
    const { error } = await supabase
      .from('listings')
      .update({ status: newStatus })
      .eq('id', listing.id);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      await fetch();
    }
  };

  const statusColors: Record<string, string> = {
    active: '#22c55e',
    sold: '#6366f1',
    draft: '#f59e0b',
    archived: '#94a3b8',
  };

  const renderItem = ({ item }: { item: Listing }) => (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.cardRow}>
        {item.image_urls?.[0] ? (
          <Image source={{ uri: item.image_urls[0] }} style={styles.thumbnail} />
        ) : (
          <View style={[styles.thumbPlaceholder, { backgroundColor: colors.tint + '22' }]}>
            <Ionicons name="image-outline" size={24} color={colors.tint} />
          </View>
        )}
        <View style={styles.cardContent}>
          <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[styles.cardPrice, { color: colors.tint }]}>
            ${Number(item.price).toFixed(2)}
          </Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: statusColors[item.status] ?? colors.subtext }]} />
            <Text style={[styles.statusText, { color: colors.subtext }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.actions}>
        {item.status === 'active' && (
          <TouchableOpacity
            style={[styles.actionBtn, { borderColor: '#6366f1' }]}
            onPress={() => handleStatusChange(item, 'sold')}
            accessibilityLabel="Mark as sold"
          >
            <Text style={[styles.actionText, { color: '#6366f1' }]}>Mark Sold</Text>
          </TouchableOpacity>
        )}
        {item.status !== 'archived' && (
          <TouchableOpacity
            style={[styles.actionBtn, { borderColor: colors.subtext }]}
            onPress={() => handleStatusChange(item, 'archived')}
            accessibilityLabel="Archive listing"
          >
            <Text style={[styles.actionText, { color: colors.subtext }]}>Archive</Text>
          </TouchableOpacity>
        )}
        {item.status === 'archived' && (
          <TouchableOpacity
            style={[styles.actionBtn, { borderColor: '#22c55e' }]}
            onPress={() => handleStatusChange(item, 'active')}
            accessibilityLabel="Reactivate listing"
          >
            <Text style={[styles.actionText, { color: '#22c55e' }]}>Reactivate</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.tint} />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <FlatList
        data={listings}
        keyExtractor={(l) => l.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.center}>
            <Ionicons name="storefront-outline" size={64} color={colors.subtext} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No listings yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.subtext }]}>
              Create your first listing to start selling
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  list: { padding: 16, gap: 12, flexGrow: 1 },
  card: { borderWidth: 1, borderRadius: 12, padding: 12 },
  cardRow: { flexDirection: 'row', gap: 12 },
  thumbnail: { width: 64, height: 64, borderRadius: 8 },
  thumbPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600' },
  cardPrice: { fontSize: 16, fontWeight: '700', marginTop: 4 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 12 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  actionBtn: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6 },
  actionText: { fontSize: 13, fontWeight: '600' },
  emptyTitle: { fontSize: 20, fontWeight: '600', marginTop: 16 },
  emptySubtitle: { fontSize: 14, textAlign: 'center', marginTop: 8 },
});
