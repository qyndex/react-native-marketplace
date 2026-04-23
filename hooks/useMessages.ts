import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import type { Message, Conversation, Profile, Listing } from '@/types/marketplace';

/** Fetch conversation threads for the current user */
export function useConversations() {
  const user = useAuthStore((s) => s.user);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    if (!user) {
      setConversations([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Fetch all messages where user is sender or recipient
    const { data: messages } = await supabase
      .from('messages')
      .select('*, sender:profiles!sender_id(*), recipient:profiles!recipient_id(*), listing:listings(*)')
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (!messages) {
      setConversations([]);
      setLoading(false);
      return;
    }

    // Group by the other user + listing to form conversations
    const threadMap = new Map<string, Conversation>();

    for (const msg of messages as Array<Message & { sender: Profile; recipient: Profile; listing: Listing | null }>) {
      const otherUser = msg.sender_id === user.id ? msg.recipient : msg.sender;
      const threadKey = `${otherUser.id}:${msg.listing_id ?? 'general'}`;

      const existing = threadMap.get(threadKey);
      if (!existing) {
        threadMap.set(threadKey, {
          otherUser,
          listing: msg.listing,
          lastMessage: msg,
          unreadCount: (!msg.read && msg.recipient_id === user.id) ? 1 : 0,
        });
      } else {
        if (!msg.read && msg.recipient_id === user.id) {
          existing.unreadCount += 1;
        }
      }
    }

    setConversations(Array.from(threadMap.values()));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return { conversations, loading, refresh: fetchConversations };
}

/** Fetch messages in a specific thread (between current user and another user, optionally about a listing) */
export function useThread(otherUserId: string, listingId?: string) {
  const user = useAuthStore((s) => s.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (!user) return;

    setLoading(true);

    let query = supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${user.id},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${user.id})`,
      )
      .order('created_at', { ascending: true });

    if (listingId) {
      query = query.eq('listing_id', listingId);
    }

    const { data } = await query;
    setMessages(data ?? []);
    setLoading(false);

    // Mark unread messages as read
    if (data?.some((m) => !m.read && m.recipient_id === user.id)) {
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('recipient_id', user.id)
        .eq('sender_id', otherUserId);
    }
  }, [user, otherUserId, listingId]);

  useEffect(() => {
    fetchMessages();

    // Subscribe to new messages in real-time
    const channel = supabase
      .channel(`thread:${otherUserId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const msg = payload.new as Message;
          const isRelevant =
            (msg.sender_id === otherUserId && msg.recipient_id === user?.id) ||
            (msg.sender_id === user?.id && msg.recipient_id === otherUserId);
          if (isRelevant) {
            setMessages((prev) => [...prev, msg]);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMessages, otherUserId, user]);

  const sendMessage = async (content: string): Promise<{ error: string | null }> => {
    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      recipient_id: otherUserId,
      listing_id: listingId ?? null,
      content,
    });

    return { error: error?.message ?? null };
  };

  return { messages, loading, sendMessage, refresh: fetchMessages };
}
