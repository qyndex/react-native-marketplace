import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useListing } from '@/hooks/useListings';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { listingToProduct } from '@/types/marketplace';

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { listing, loading } = useListing(id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const user = useAuthStore((s) => s.user);
  const addItem = useCartStore((s) => s.addItem);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.subtext }}>Listing not found</Text>
      </View>
    );
  }

  const isOwnListing = user?.id === listing.seller_id;
  const imageUrl = listing.image_urls?.[0];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.heroImage} resizeMode="cover" />
        ) : (
          <View style={[styles.heroPlaceholder, { backgroundColor: colors.tint + '22' }]}>
            <Ionicons name="image-outline" size={64} color={colors.tint} />
          </View>
        )}

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.text }]}>{listing.title}</Text>
            {user && (
              <TouchableOpacity
                onPress={() => toggleFavorite(listing.id)}
                accessibilityLabel={isFavorite(listing.id) ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Ionicons
                  name={isFavorite(listing.id) ? 'heart' : 'heart-outline'}
                  size={28}
                  color={isFavorite(listing.id) ? '#ef4444' : colors.icon}
                />
              </TouchableOpacity>
            )}
          </View>

          <Text style={[styles.price, { color: colors.tint }]}>
            ${Number(listing.price).toFixed(2)}
          </Text>

          <View style={[styles.categoryBadge, { backgroundColor: colors.tint + '18' }]}>
            <Text style={[styles.categoryText, { color: colors.tint }]}>{listing.category}</Text>
          </View>

          <Text style={[styles.description, { color: colors.text }]}>
            {listing.description}
          </Text>

          {/* Seller info */}
          <View style={[styles.sellerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.sellerAvatar, { backgroundColor: colors.tint + '22' }]}>
              {listing.seller?.avatar_url ? (
                <Image
                  source={{ uri: listing.seller.avatar_url }}
                  style={styles.avatarImage}
                />
              ) : (
                <Ionicons name="person" size={24} color={colors.tint} />
              )}
            </View>
            <View style={styles.sellerInfo}>
              <Text style={[styles.sellerName, { color: colors.text }]}>
                {listing.seller?.full_name || 'Anonymous'}
              </Text>
              <Text style={[styles.sellerLabel, { color: colors.subtext }]}>Seller</Text>
            </View>
            {user && !isOwnListing && (
              <TouchableOpacity
                style={[styles.messageBtn, { borderColor: colors.tint }]}
                onPress={() =>
                  router.push({
                    pathname: '/message/[userId]',
                    params: { userId: listing.seller_id, listingId: listing.id },
                  })
                }
                accessibilityLabel={`Message ${listing.seller?.full_name || 'seller'}`}
              >
                <Ionicons name="chatbubble-outline" size={16} color={colors.tint} />
                <Text style={[styles.messageBtnText, { color: colors.tint }]}>Message</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={[styles.dateText, { color: colors.subtext }]}>
            Listed {new Date(listing.created_at).toLocaleDateString()}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom action bar */}
      {!isOwnListing && (
        <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.addToCartBtn, { backgroundColor: colors.tint }]}
            onPress={() => {
              addItem(listingToProduct(listing));
              router.push('/cart');
            }}
            accessibilityLabel="Add to cart"
          >
            <Ionicons name="cart-outline" size={20} color="#fff" />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>

          {user && (
            <TouchableOpacity
              style={[styles.messageActionBtn, { borderColor: colors.tint }]}
              onPress={() =>
                router.push({
                  pathname: '/message/[userId]',
                  params: { userId: listing.seller_id, listingId: listing.id },
                })
              }
              accessibilityLabel="Message seller"
            >
              <Ionicons name="chatbubble-outline" size={20} color={colors.tint} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  heroImage: { width: '100%', height: 300 },
  heroPlaceholder: {
    width: '100%',
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { padding: 20 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  title: { fontSize: 24, fontWeight: '700', flex: 1 },
  price: { fontSize: 28, fontWeight: '800', marginTop: 8 },
  categoryBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16, marginTop: 12 },
  categoryText: { fontSize: 13, fontWeight: '600' },
  description: { fontSize: 15, lineHeight: 22, marginTop: 16 },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 20,
    gap: 12,
  },
  sellerAvatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatarImage: { width: 48, height: 48, borderRadius: 24 },
  sellerInfo: { flex: 1 },
  sellerName: { fontSize: 16, fontWeight: '600' },
  sellerLabel: { fontSize: 12, marginTop: 2 },
  messageBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  messageBtnText: { fontSize: 13, fontWeight: '600' },
  dateText: { fontSize: 12, marginTop: 16 },
  bottomBar: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addToCartText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  messageActionBtn: {
    width: 50,
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
