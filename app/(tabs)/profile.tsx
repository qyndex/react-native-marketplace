import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/store/authStore';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { user, profile, loading, signOut, updateProfile } = useAuthStore();

  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [saving, setSaving] = useState(false);

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.center}>
          <Ionicons name="person-circle-outline" size={80} color={colors.subtext} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Your Profile</Text>
          <Text style={[styles.emptySubtitle, { color: colors.subtext }]}>
            Sign in to manage your account and listings
          </Text>
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: colors.tint }]}
            onPress={() => router.push('/auth/sign-in')}
            accessibilityLabel="Sign in"
          >
            <Text style={styles.primaryBtnText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.secondaryBtn, { borderColor: colors.tint }]}
            onPress={() => router.push('/auth/sign-up')}
            accessibilityLabel="Create account"
          >
            <Text style={[styles.secondaryBtnText, { color: colors.tint }]}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateProfile({ full_name: fullName, bio });
    setSaving(false);
    if (error) {
      Alert.alert('Error', error);
    } else {
      setEditing(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.tint + '22' }]}>
            {profile?.avatar_url ? (
              <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={48} color={colors.tint} />
            )}
          </View>

          {editing ? (
            <View style={styles.editForm}>
              <TextInput
                style={[styles.nameInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Full Name"
                placeholderTextColor={colors.subtext}
                accessibilityLabel="Edit full name"
              />
              <TextInput
                style={[styles.bioInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
                value={bio}
                onChangeText={setBio}
                placeholder="Write a short bio..."
                placeholderTextColor={colors.subtext}
                multiline
                maxLength={200}
                accessibilityLabel="Edit bio"
              />
              <View style={styles.editActions}>
                <TouchableOpacity
                  style={[styles.cancelBtn, { borderColor: colors.border }]}
                  onPress={() => {
                    setEditing(false);
                    setFullName(profile?.full_name ?? '');
                    setBio(profile?.bio ?? '');
                  }}
                  accessibilityLabel="Cancel editing"
                >
                  <Text style={[styles.cancelBtnText, { color: colors.text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.saveBtn, { backgroundColor: colors.tint }]}
                  onPress={handleSave}
                  disabled={saving}
                  accessibilityLabel="Save profile"
                >
                  {saving ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.saveBtnText}>Save</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <Text style={[styles.displayName, { color: colors.text }]}>
                {profile?.full_name || 'Set your name'}
              </Text>
              <Text style={[styles.email, { color: colors.subtext }]}>{profile?.email}</Text>
              {profile?.bio ? (
                <Text style={[styles.bio, { color: colors.text }]}>{profile.bio}</Text>
              ) : null}
              <TouchableOpacity
                style={[styles.editBtn, { borderColor: colors.tint }]}
                onPress={() => setEditing(true)}
                accessibilityLabel="Edit profile"
              >
                <Ionicons name="pencil-outline" size={16} color={colors.tint} />
                <Text style={[styles.editBtnText, { color: colors.tint }]}>Edit Profile</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={[styles.menuSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={() => router.push('/create-listing')}
            accessibilityLabel="Create a listing"
          >
            <Ionicons name="add-circle-outline" size={22} color={colors.tint} />
            <Text style={[styles.menuText, { color: colors.text }]}>Create a Listing</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.subtext} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={() => router.push('/my-listings')}
            accessibilityLabel="My listings"
          >
            <Ionicons name="storefront-outline" size={22} color={colors.tint} />
            <Text style={[styles.menuText, { color: colors.text }]}>My Listings</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.subtext} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleSignOut}
            accessibilityLabel="Sign out"
          >
            <Ionicons name="log-out-outline" size={22} color="#ef4444" />
            <Text style={[styles.menuText, { color: '#ef4444' }]}>Sign Out</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.subtext} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.memberSince, { color: colors.subtext }]}>
          Member since {new Date(profile?.created_at ?? '').toLocaleDateString()}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  scrollContent: { padding: 20 },
  profileHeader: { alignItems: 'center', marginBottom: 24 },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: { width: 96, height: 96, borderRadius: 48 },
  displayName: { fontSize: 24, fontWeight: '700', marginTop: 14 },
  email: { fontSize: 14, marginTop: 4 },
  bio: { fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
  editBtnText: { fontSize: 14, fontWeight: '600' },
  editForm: { width: '100%', gap: 12, marginTop: 16 },
  nameInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, height: 44, fontSize: 16 },
  bioInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  editActions: { flexDirection: 'row', gap: 12, justifyContent: 'center' },
  cancelBtn: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 24, paddingVertical: 10 },
  cancelBtnText: { fontSize: 14, fontWeight: '600' },
  saveBtn: { borderRadius: 10, paddingHorizontal: 24, paddingVertical: 10, minWidth: 80, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  menuSection: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
  },
  menuText: { flex: 1, fontSize: 16 },
  memberSince: { textAlign: 'center', fontSize: 12, marginTop: 20 },
  emptyTitle: { fontSize: 22, fontWeight: '600', marginTop: 16 },
  emptySubtitle: { fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  primaryBtn: {
    marginTop: 24,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryBtnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  secondaryBtn: {
    marginTop: 12,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  secondaryBtnText: { fontSize: 17, fontWeight: '600' },
});
