import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '@/store/authStore';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="auth/sign-in"
          options={{ title: 'Sign In', presentation: 'modal' }}
        />
        <Stack.Screen
          name="auth/sign-up"
          options={{ title: 'Sign Up', presentation: 'modal' }}
        />
        <Stack.Screen
          name="listing/[id]"
          options={{ title: 'Listing Details', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="message/[userId]"
          options={{ title: 'Message', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="create-listing"
          options={{ title: 'New Listing', presentation: 'modal' }}
        />
        <Stack.Screen
          name="my-listings"
          options={{ title: 'My Listings', headerBackTitle: 'Profile' }}
        />
        <Stack.Screen
          name="cart"
          options={{ title: 'Cart', presentation: 'modal' }}
        />
        <Stack.Screen
          name="checkout"
          options={{ title: 'Checkout', headerBackTitle: 'Cart' }}
        />
        <Stack.Screen
          name="order-confirmation"
          options={{ headerShown: false }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });
