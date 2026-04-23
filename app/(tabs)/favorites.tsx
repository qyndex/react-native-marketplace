import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ProductCard } from '@/components/ProductCard';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { listingToProduct } from '@/types/marketplace';
import type { ListingWithSeller } from '@/types/marketplace';

export default function FavoritesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const user = useAuthStore((s) => s.user);
  const { favoriteListings, loading } = useFavorites();
  const addItem = useCartStore((s) => s.addItem);

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.center}>
          <Ionicons name="heart-outline" size={64} color={colors.subtext} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Sign in to save favorites</Text>
          <Text style={[styles.emptySubtitle, { color: colors.subtext }]}>
            Keep track of listings you love
          </Text>
          <TouchableOpacity
            style={[styles.signInBtn, { backgroundColor: colors.tint }]}
            onPress={() => router.push('/auth/sign-in')}
            accessibilityLabel="Sign in"
          >
            <Text style={styles.signInBtnText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={favoriteListings}
        keyExtractor={(l) => l.id}
        numColumns={Platform.select({ web: 3, default: 2 })}
        key={Platform.select({ web: 'web', default: 'native' })}
        contentContainerStyle={styles.grid}
        renderItem={({ item }: { item: ListingWithSeller }) => (
          <ProductCard
            product={listingToProduct(item)}
            imageUrl={item.image_urls?.[0]}
            sellerName={item.seller?.full_name}
            onPress={() =>
              router.push({ pathname: '/listing/[id]', params: { id: item.id } })
            }
            onAddToCart={() => addItem(listingToProduct(item))}
          />
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Ionicons name="heart-outline" size={64} color={colors.subtext} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No favorites yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.subtext }]}>
              Tap the heart icon on listings to save them here
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
  grid: { padding: 8, flexGrow: 1 },
  emptyTitle: { fontSize: 20, fontWeight: '600', marginTop: 16 },
  emptySubtitle: { fontSize: 14, textAlign: 'center', marginTop: 8 },
  signInBtn: { marginTop: 20, paddingHorizontal: 32, paddingVertical: 12, borderRadius: 10 },
  signInBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
