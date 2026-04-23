import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function OrderConfirmationScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.center}>
        <View style={[styles.iconCircle, { backgroundColor: '#22c55e22' }]}>
          <Ionicons name="checkmark-circle" size={80} color="#22c55e" />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Order Confirmed!</Text>
        <Text style={[styles.subtitle, { color: colors.subtext }]}>
          Thank you for your purchase. The seller has been notified.
        </Text>

        <TouchableOpacity
          style={[styles.homeBtn, { backgroundColor: colors.tint }]}
          onPress={() => router.replace('/(tabs)')}
          accessibilityLabel="Back to browse"
        >
          <Text style={styles.homeBtnText}>Back to Browse</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  iconCircle: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 15, textAlign: 'center', marginTop: 12, lineHeight: 22 },
  homeBtn: { marginTop: 32, paddingHorizontal: 40, paddingVertical: 14, borderRadius: 12 },
  homeBtnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});
