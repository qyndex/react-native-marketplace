import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useColorScheme, StyleSheet } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="product/[id]"
          options={{ title: 'Product Details', headerBackTitle: 'Shop' }}
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
