import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { supabase } from '@/lib/supabase';

describe('API Integration', () => {
  let authUser: any;

  beforeAll(async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: process.env.TEST_USER_EMAIL!,
      password: process.env.TEST_USER_PASSWORD!,
    });

    if (error) throw error;
    authUser = data.user;
  });

  afterAll(async () => {
    await supabase.auth.signOut();
  });

  it('should create and fetch a profile', async () => {
    const profile = {
      full_name: 'Test User',
      email: authUser.email,
    };

    const { data: created, error: createError } = await supabase
      .from('profiles')
      .upsert({ id: authUser.id, ...profile })
      .select()
      .single();

    expect(createError).toBeNull();
    expect(created).toMatchObject(profile);

    const { data: fetched, error: fetchError } = await supabase
      .from('profiles')
      .select()
      .eq('id', authUser.id)
      .single();

    expect(fetchError).toBeNull();
    expect(fetched).toMatchObject(profile);
  });
});