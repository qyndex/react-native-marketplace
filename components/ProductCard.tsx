import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import type { Product } from '@/types/marketplace';

interface ProductCardProps {
  product: Product;
  imageUrl?: string;
  sellerName?: string;
  onPress: () => void;
  onAddToCart: () => void;
}

export function ProductCard({ product, imageUrl, sellerName, onPress, onAddToCart }: ProductCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityLabel={`${product.name}, $${product.price.toFixed(2)}`}
    >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.imagePlaceholder, { backgroundColor: colors.tint + '22' }]}>
          <Ionicons name="cube-outline" size={40} color={colors.tint} />
        </View>
      )}
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
          {product.name}
        </Text>
        {sellerName ? (
          <Text style={[styles.seller, { color: colors.subtext }]} numberOfLines={1}>
            {sellerName}
          </Text>
        ) : product.rating > 0 ? (
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color="#f59e0b" />
            <Text style={[styles.rating, { color: colors.subtext }]}>
              {product.rating} ({product.reviewCount})
            </Text>
          </View>
        ) : null}
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: colors.tint }]}>
            ${product.price.toFixed(2)}
          </Text>
          <TouchableOpacity
            onPress={onAddToCart}
            disabled={!product.inStock}
            style={[
              styles.addBtn,
              { backgroundColor: product.inStock ? colors.tint : colors.border },
            ]}
            accessibilityLabel={product.inStock ? `Add ${product.name} to cart` : 'Out of stock'}
          >
            <Ionicons
              name="add"
              size={Platform.select({ web: 16, default: 18 }) ?? 18}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
        {!product.inStock && (
          <Text style={[styles.outOfStock, { color: colors.subtext }]}>Out of stock</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    height: 120,
    width: '100%',
  },
  imagePlaceholder: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { padding: 10 },
  name: { fontSize: 13, fontWeight: '600', marginBottom: 4, lineHeight: 18 },
  seller: { fontSize: 11, marginBottom: 6 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 6 },
  rating: { fontSize: 11 },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontSize: 15, fontWeight: '700' },
  addBtn: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  outOfStock: { fontSize: 10, marginTop: 2 },
});
