import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { UserSettings } from '@/types/database';
import { useAuth } from '@/lib/auth';

export function useSettings() {
  const { user } = useAuth();

  const getSettings = useCallback(async () => {
    if (!supabase || !user) return null;

    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    return data as UserSettings;
  }, [user]);

  const updateSettings = useCallback(async (updates: Partial<Omit<UserSettings, 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!supabase || !user) return null;

    const { data, error } = await supabase
      .from('user_settings')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data as UserSettings;
  }, [user]);

  return { getSettings, updateSettings };
}