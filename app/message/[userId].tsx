import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThread } from '@/hooks/useMessages';
import { useAuthStore } from '@/store/authStore';
import type { Message } from '@/types/marketplace';

export default function MessageScreen() {
  const { userId, listingId } = useLocalSearchParams<{ userId: string; listingId?: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const currentUser = useAuthStore((s) => s.user);
  const { messages, loading, sendMessage } = useThread(userId, listingId);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList<Message>>(null);

  const handleSend = async () => {
    if (!text.trim() || sending) return;

    const content = text.trim();
    setText('');
    setSending(true);

    await sendMessage(content);
    setSending(false);

    // Scroll to bottom after sending
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMine = item.sender_id === currentUser?.id;

    return (
      <View
        style={[
          styles.bubble,
          isMine ? styles.bubbleRight : styles.bubbleLeft,
          {
            backgroundColor: isMine ? colors.tint : colors.card,
            borderColor: isMine ? colors.tint : colors.border,
          },
        ]}
      >
        <Text style={[styles.bubbleText, { color: isMine ? '#fff' : colors.text }]}>
          {item.content}
        </Text>
        <Text
          style={[
            styles.bubbleTime,
            { color: isMine ? 'rgba(255,255,255,0.7)' : colors.subtext },
          ]}
        >
          {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={48} color={colors.subtext} />
              <Text style={[styles.emptyText, { color: colors.subtext }]}>
                Start the conversation
              </Text>
            </View>
          }
        />

        <View style={[styles.inputBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <TextInput
            style={[styles.textInput, { color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
            placeholder="Type a message..."
            placeholderTextColor={colors.subtext}
            value={text}
            onChangeText={setText}
            multiline
            maxLength={2000}
            accessibilityLabel="Message input"
          />
          <TouchableOpacity
            style={[styles.sendBtn, { backgroundColor: text.trim() ? colors.tint : colors.border }]}
            onPress={handleSend}
            disabled={!text.trim() || sending}
            accessibilityLabel="Send message"
          >
            {sending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={18} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  messageList: { padding: 16, paddingBottom: 8 },
  bubble: {
    maxWidth: '78%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
  },
  bubbleLeft: { alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  bubbleRight: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  bubbleText: { fontSize: 15, lineHeight: 20 },
  bubbleTime: { fontSize: 11, marginTop: 4, alignSelf: 'flex-end' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyText: { fontSize: 16, marginTop: 12 },
  inputBar: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    borderTopWidth: 1,
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
