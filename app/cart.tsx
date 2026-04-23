import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useCartStore, CartItem } from '@/store/cartStore';

export default function CartScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.thumb, { backgroundColor: colors.tint + '22' }]}>
        <Ionicons name="cube-outline" size={28} color={colors.tint} />
      </View>
      <View style={styles.details}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {item.product.name}
        </Text>
        <Text style={[styles.price, { color: colors.tint }]}>
          ${item.product.price.toFixed(2)}
        </Text>
      </View>
      <View style={styles.qtyRow}>
        <TouchableOpacity
          onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
          style={[styles.qtyBtn, { borderColor: colors.border }]}
          accessibilityLabel="Decrease quantity"
        >
          <Ionicons name="remove" size={16} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.qtyText, { color: colors.text }]}>{item.quantity}</Text>
        <TouchableOpacity
          onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
          style={[styles.qtyBtn, { borderColor: colors.border }]}
          accessibilityLabel="Increase quantity"
        >
          <Ionicons name="add" size={16} color={colors.text} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => removeItem(item.product.id)}
        accessibilityLabel={`Remove ${item.product.name}`}
      >
        <Ionicons name="trash-outline" size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.product.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.center}>
            <Ionicons name="cart-outline" size={64} color={colors.subtext} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Your cart is empty</Text>
            <Text style={[styles.emptySubtitle, { color: colors.subtext }]}>
              Browse listings and add items to your cart
            </Text>
          </View>
        }
      />

      {items.length > 0 && (
        <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
            <Text style={[styles.totalPrice, { color: colors.tint }]}>
              ${totalPrice().toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.checkoutBtn, { backgroundColor: colors.tint }]}
            onPress={() => router.push('/checkout')}
            accessibilityLabel="Proceed to checkout"
          >
            <Text style={styles.checkoutText}>Checkout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={clearCart}
            style={styles.clearBtn}
            accessibilityLabel="Clear cart"
          >
            <Text style={[styles.clearText, { color: colors.subtext }]}>Clear Cart</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  list: { padding: 16, gap: 10, flexGrow: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: { flex: 1 },
  name: { fontSize: 14, fontWeight: '600' },
  price: { fontSize: 15, fontWeight: '700', marginTop: 2 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: { width: 28, height: 28, borderRadius: 6, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  qtyText: { fontSize: 15, fontWeight: '600', minWidth: 20, textAlign: 'center' },
  footer: { padding: 16, borderTopWidth: 1, gap: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 18, fontWeight: '600' },
  totalPrice: { fontSize: 24, fontWeight: '800' },
  checkoutBtn: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  clearBtn: { alignItems: 'center', paddingVertical: 8 },
  clearText: { fontSize: 14 },
  emptyTitle: { fontSize: 20, fontWeight: '600', marginTop: 16 },
  emptySubtitle: { fontSize: 14, textAlign: 'center', marginTop: 8 },
});
