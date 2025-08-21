import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { sendDemoRequestEmail } from '@/lib/email';
import type { DemoRequest } from '@/types/database';

export function useDemoRequests() {
  const submitDemoRequest = useCallback(async (request: Omit<DemoRequest, 'id' | 'status' | 'created_at' | 'updated_at'>) => {
    if (!supabase) throw new Error('Supabase client not initialized');

    try {
      // Insert the demo request
      const { data, error } = await supabase
        .from('demo_requests')
        .insert({
          first_name: request.firstName,
          last_name: request.lastName,
          email: request.email,
          phone: request.phone,
          company: request.company,
          job_title: request.jobTitle,
          industry: request.industry,
          company_size: request.companySize,
          message: request.message,
        })
        .select()
        .single();

      if (error) throw error;

      // Send email notification
      await sendDemoRequestEmail(data);

      return data;
    } catch (err) {
      console.error('Error submitting demo request:', err);
      throw err;
    }
  }, []);

  return { submitDemoRequest };
}