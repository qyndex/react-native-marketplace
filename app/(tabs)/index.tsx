import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ProductCard } from '@/components/ProductCard';
import { useCartStore } from '@/store/cartStore';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MOCK_PRODUCTS } from '@/data/products';
import type { Product } from '@/types/marketplace';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Home', 'Sports'];

export default function ShopScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { addItem, totalItems } = useCartStore();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const filtered: Product[] = MOCK_PRODUCTS.filter((p) => {
    const matchQuery = p.name.toLowerCase().includes(query.toLowerCase());
    const matchCat = category === 'All' || p.category === category;
    return matchQuery && matchCat;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topBar}>
        <View style={[styles.searchRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={18} color={colors.icon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search products..."
            placeholderTextColor={colors.subtext}
            value={query}
            onChangeText={setQuery}
            accessibilityLabel="Search products"
          />
        </View>
        <TouchableOpacity
          style={styles.cartBtn}
          onPress={() => router.push('/cart')}
          accessibilityLabel={`Cart with ${totalItems()} items`}
        >
          <Ionicons name="cart-outline" size={26} color={colors.tint} />
          {totalItems() > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.tint }]}>
              <Text style={styles.badgeText}>{totalItems()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(c) => c}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catList}
        renderItem={({ item: cat }) => (
          <TouchableOpacity
            onPress={() => setCategory(cat)}
            style={[
              styles.catChip,
              cat === category && { backgroundColor: colors.tint },
              { borderColor: colors.border },
            ]}
            accessibilityLabel={`Filter by ${cat}`}
          >
            <Text style={[styles.catLabel, { color: cat === category ? '#fff' : colors.text }]}>
              {cat}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={filtered}
        keyExtractor={(p) => p.id}
        numColumns={Platform.select({ web: 3, default: 2 })}
        key={Platform.select({ web: 'web', default: 'native' })}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() =>
              router.push({ pathname: '/product/[id]', params: { id: item.id } })
            }
            onAddToCart={() => addItem(item)}
          />
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.subtext }]}>No products found.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  searchRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    gap: 6,
  },
  searchInput: { flex: 1, fontSize: 14 },
  cartBtn: { position: 'relative', padding: 4 },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  catList: { paddingHorizontal: 16, paddingBottom: 8, gap: 8 },
  catChip: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  catLabel: { fontSize: 13, fontWeight: '500' },
  grid: { padding: 8 },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 16 },
});
