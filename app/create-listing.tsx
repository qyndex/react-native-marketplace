import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useCreateListing } from '@/hooks/useListings';
import { useAuthStore } from '@/store/authStore';
import { CATEGORIES } from '@/types/marketplace';

const LISTING_CATEGORIES = CATEGORIES.filter((c) => c !== 'All');

export default function CreateListingScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const user = useAuthStore((s) => s.user);
  const { create, loading } = useCreateListing();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(LISTING_CATEGORIES[0]);
  const [imageUrl, setImageUrl] = useState('');

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title.');
      return;
    }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      Alert.alert('Error', 'Please enter a valid price.');
      return;
    }
    if (!user) {
      Alert.alert('Error', 'You must be signed in.');
      return;
    }

    const { error } = await create({
      seller_id: user.id,
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      category,
      image_urls: imageUrl.trim() ? [imageUrl.trim()] : [],
    });

    if (error) {
      Alert.alert('Error', error);
    } else {
      Alert.alert('Success', 'Listing created!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={[styles.label, { color: colors.text }]}>Title</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
            value={title}
            onChangeText={setTitle}
            placeholder="What are you selling?"
            placeholderTextColor={colors.subtext}
            maxLength={100}
            accessibilityLabel="Listing title"
          />

          <Text style={[styles.label, { color: colors.text }]}>Description</Text>
          <TextInput
            style={[styles.textArea, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your item, condition, and any details..."
            placeholderTextColor={colors.subtext}
            multiline
            maxLength={2000}
            accessibilityLabel="Listing description"
          />

          <Text style={[styles.label, { color: colors.text }]}>Price ($)</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
            value={price}
            onChangeText={setPrice}
            placeholder="0.00"
            placeholderTextColor={colors.subtext}
            keyboardType="decimal-pad"
            accessibilityLabel="Price"
          />

          <Text style={[styles.label, { color: colors.text }]}>Category</Text>
          <View style={styles.categoryRow}>
            {LISTING_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategory(cat)}
                style={[
                  styles.catChip,
                  { borderColor: colors.border },
                  cat === category && { backgroundColor: colors.tint, borderColor: colors.tint },
                ]}
                accessibilityLabel={`Select ${cat} category`}
              >
                <Text style={[styles.catText, { color: cat === category ? '#fff' : colors.text }]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.label, { color: colors.text }]}>Image URL (optional)</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
            value={imageUrl}
            onChangeText={setImageUrl}
            placeholder="https://example.com/photo.jpg"
            placeholderTextColor={colors.subtext}
            keyboardType="url"
            autoCapitalize="none"
            accessibilityLabel="Image URL"
          />

          <TouchableOpacity
            style={[styles.createBtn, { backgroundColor: colors.tint }]}
            onPress={handleCreate}
            disabled={loading}
            accessibilityLabel="Create listing"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="add-circle-outline" size={20} color="#fff" />
                <Text style={styles.createBtnText}>Create Listing</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  content: { padding: 20, gap: 4 },
  label: { fontSize: 15, fontWeight: '600', marginTop: 12, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 15,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  catText: { fontSize: 13, fontWeight: '500' },
  createBtn: {
    flexDirection: 'row',
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
  },
  createBtnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});
