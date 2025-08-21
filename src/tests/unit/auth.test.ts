import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

describe('Auth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should sign in successfully', async () => {
    const mockSignIn = vi.fn().mockResolvedValue({ data: {}, error: null });
    supabase.auth.signInWithPassword = mockSignIn;

    const { signIn } = useAuth();
    await signIn('test@example.com', 'password');

    expect(mockSignIn).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
  });

  it('should handle sign in errors', async () => {
    const mockSignIn = vi.fn().mockResolvedValue({
      data: null,
      error: new Error('Invalid credentials'),
    });
    supabase.auth.signInWithPassword = mockSignIn;

    const { signIn } = useAuth();
    await expect(signIn('test@example.com', 'wrong')).rejects.toThrow();
  });
});