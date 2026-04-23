import { useAuthStore } from '../store/authStore';

// supabase is mocked globally via jest.setup.js

beforeEach(() => {
  useAuthStore.setState({
    session: null,
    user: null,
    profile: null,
    loading: false,
    initialized: false,
  });
});

describe('authStore', () => {
  it('starts with null session and user', () => {
    const state = useAuthStore.getState();
    expect(state.session).toBeNull();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.initialized).toBe(false);
  });

  it('sets initialized to true after initialize()', async () => {
    await useAuthStore.getState().initialize();
    expect(useAuthStore.getState().initialized).toBe(true);
  });

  it('sets loading during signIn', async () => {
    const { supabase } = require('../lib/supabase');
    supabase.auth.signInWithPassword.mockResolvedValue({ error: null });

    const promise = useAuthStore.getState().signIn('test@test.com', 'password');
    // loading should be true immediately (sync part of signIn)
    expect(useAuthStore.getState().loading).toBe(true);

    await promise;
    expect(useAuthStore.getState().loading).toBe(false);
  });

  it('returns error message on failed signIn', async () => {
    const { supabase } = require('../lib/supabase');
    supabase.auth.signInWithPassword.mockResolvedValue({
      error: { message: 'Invalid credentials' },
    });

    const result = await useAuthStore.getState().signIn('bad@test.com', 'wrong');
    expect(result.error).toBe('Invalid credentials');
  });

  it('returns null error on successful signIn', async () => {
    const { supabase } = require('../lib/supabase');
    supabase.auth.signInWithPassword.mockResolvedValue({ error: null });

    const result = await useAuthStore.getState().signIn('good@test.com', 'correct');
    expect(result.error).toBeNull();
  });

  it('clears state on signOut', async () => {
    const { supabase } = require('../lib/supabase');
    supabase.auth.signOut.mockResolvedValue({});

    useAuthStore.setState({
      session: {} as never,
      user: { id: '123' } as never,
      profile: { id: '123', email: 'test@test.com' } as never,
    });

    await useAuthStore.getState().signOut();

    const state = useAuthStore.getState();
    expect(state.session).toBeNull();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
  });

  it('returns error when updating profile while not authenticated', async () => {
    const result = await useAuthStore.getState().updateProfile({ full_name: 'New Name' });
    expect(result.error).toBe('Not authenticated');
  });
});
