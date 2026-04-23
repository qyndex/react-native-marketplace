import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useConversations } from '@/hooks/useMessages';
import { useAuthStore } from '@/store/authStore';
import type { Conversation } from '@/types/marketplace';

export default function MessagesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const user = useAuthStore((s) => s.user);
  const { conversations, loading, refresh } = useConversations();

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.center}>
          <Ionicons name="chatbubbles-outline" size={64} color={colors.subtext} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Sign in to see messages</Text>
          <Text style={[styles.emptySubtitle, { color: colors.subtext }]}>
            Chat with buyers and sellers
          </Text>
          <TouchableOpacity
            style={[styles.signInBtn, { backgroundColor: colors.tint }]}
            onPress={() => router.push('/auth/sign-in')}
            accessibilityLabel="Sign in"
          >
            <Text style={styles.signInBtnText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.tint} />
        </View>
      </View>
    );
  }

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={[styles.conversationRow, { borderBottomColor: colors.border }]}
      onPress={() =>
        router.push({
          pathname: '/message/[userId]',
          params: {
            userId: item.otherUser.id,
            listingId: item.listing?.id ?? '',
          },
        })
      }
      accessibilityLabel={`Conversation with ${item.otherUser.full_name}`}
    >
      <View style={[styles.avatar, { backgroundColor: colors.tint + '22' }]}>
        {item.otherUser.avatar_url ? (
          <Image source={{ uri: item.otherUser.avatar_url }} style={styles.avatarImage} />
        ) : (
          <Ionicons name="person" size={24} color={colors.tint} />
        )}
      </View>
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={[styles.userName, { color: colors.text }]} numberOfLines={1}>
            {item.otherUser.full_name || 'Anonymous'}
          </Text>
          <Text style={[styles.timeText, { color: colors.subtext }]}>
            {new Date(item.lastMessage.created_at).toLocaleDateString()}
          </Text>
        </View>
        {item.listing && (
          <Text style={[styles.listingTitle, { color: colors.tint }]} numberOfLines={1}>
            Re: {item.listing.title}
          </Text>
        )}
        <Text style={[styles.lastMessage, { color: colors.subtext }]} numberOfLines={1}>
          {item.lastMessage.content}
        </Text>
      </View>
      {item.unreadCount > 0 && (
        <View style={[styles.unreadBadge, { backgroundColor: colors.tint }]}>
          <Text style={styles.unreadText}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={conversations}
        keyExtractor={(c) => `${c.otherUser.id}:${c.listing?.id ?? 'general'}`}
        renderItem={renderConversation}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.center}>
            <Ionicons name="chatbubbles-outline" size={64} color={colors.subtext} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No messages yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.subtext }]}>
              Start a conversation from a listing page
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  list: { flexGrow: 1 },
  conversationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: { width: 48, height: 48, borderRadius: 24 },
  conversationContent: { flex: 1 },
  conversationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  userName: { fontSize: 16, fontWeight: '600', flex: 1 },
  timeText: { fontSize: 12, marginLeft: 8 },
  listingTitle: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  lastMessage: { fontSize: 14, marginTop: 2 },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  emptyTitle: { fontSize: 20, fontWeight: '600', marginTop: 16 },
  emptySubtitle: { fontSize: 14, textAlign: 'center', marginTop: 8 },
  signInBtn: { marginTop: 20, paddingHorizontal: 32, paddingVertical: 12, borderRadius: 10 },
  signInBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
