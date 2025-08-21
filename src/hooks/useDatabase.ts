import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Profile, Appointment } from '@/types/database';
import { useAuth } from '@/lib/auth';

export function useProfile() {
  const { user } = useAuth();

  const getProfile = useCallback(async () => {
    if (!supabase || !user) return null;

    try {
      // First try to get the existing profile
      const { data: existingProfile, error: selectError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (selectError) throw selectError;

      // If profile exists, return it
      if (existingProfile) return existingProfile as Profile;

      // If profile doesn't exist, create it
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({ id: user.id, email: user.email })
        .select()
        .single();

      if (insertError) throw insertError;
      return newProfile as Profile;
    } catch (error) {
      console.error('Error fetching/creating profile:', error);
      throw error;
    }
  }, [user]);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!supabase || !user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  }, [user]);

  return { getProfile, updateProfile };
}

export function useAppointments() {
  const { user } = useAuth();

  const getAppointments = useCallback(async () => {
    if (!supabase || !user) return [];

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', user.id)
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data as Appointment[];
  }, [user]);

  const createAppointment = useCallback(async (appointment: Omit<Appointment, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!supabase || !user) return null;

    const { data, error } = await supabase
      .from('appointments')
      .insert({ ...appointment, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return data as Appointment;
  }, [user]);

  const updateAppointment = useCallback(async (id: string, updates: Partial<Omit<Appointment, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!supabase || !user) return null;

    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data as Appointment;
  }, [user]);

  const deleteAppointment = useCallback(async (id: string) => {
    if (!supabase || !user) return;

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  }, [user]);

  return {
    getAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
  };
}

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
    return data;
  }, [user]);

  const updateSettings = useCallback(async (updates: Partial<Omit<any, 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!supabase || !user) return null;

    const { data, error } = await supabase
      .from('user_settings')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }, [user]);

  return { getSettings, updateSettings };
}