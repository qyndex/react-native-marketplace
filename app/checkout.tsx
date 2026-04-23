import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useCartStore } from '@/store/cartStore';

export default function CheckoutScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { items, totalPrice, clearCart } = useCartStore();
  const [processing, setProcessing] = useState(false);

  const handlePlaceOrder = () => {
    setProcessing(true);
    // Simulate order processing
    setTimeout(() => {
      setProcessing(false);
      clearCart();
      router.replace('/order-confirmation');
    }, 1500);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Order Summary</Text>
        {items.map((item) => (
          <View key={item.product.id} style={[styles.itemRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>
              {item.product.name} x{item.quantity}
            </Text>
            <Text style={[styles.itemPrice, { color: colors.tint }]}>
              ${(item.product.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}

        <View style={[styles.totalRow, { borderTopColor: colors.border }]}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
          <Text style={[styles.totalPrice, { color: colors.tint }]}>
            ${totalPrice().toFixed(2)}
          </Text>
        </View>

        <Text style={[styles.note, { color: colors.subtext }]}>
          This is a demo checkout. No real payment will be processed.
        </Text>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.orderBtn, { backgroundColor: colors.tint, opacity: processing ? 0.7 : 1 }]}
          onPress={handlePlaceOrder}
          disabled={processing || items.length === 0}
          accessibilityLabel="Place order"
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
          <Text style={styles.orderText}>
            {processing ? 'Processing...' : 'Place Order'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  itemName: { fontSize: 15, flex: 1 },
  itemPrice: { fontSize: 15, fontWeight: '600' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderTopWidth: 2,
    marginTop: 8,
  },
  totalLabel: { fontSize: 18, fontWeight: '700' },
  totalPrice: { fontSize: 22, fontWeight: '800' },
  note: { textAlign: 'center', fontSize: 13, marginTop: 24 },
  footer: { padding: 16, borderTopWidth: 1 },
  orderBtn: {
    flexDirection: 'row',
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  orderText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});
