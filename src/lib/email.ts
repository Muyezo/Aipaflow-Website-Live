import { supabase } from './supabase';
import type { DemoRequest } from '@/types/database';

const NOTIFICATION_EMAIL = 'support@aipaflow.com';

export async function sendDemoRequestEmail(demoRequest: DemoRequest) {
  if (!supabase) throw new Error('Supabase client not initialized');

  try {
    // Call Supabase Edge Function to send email
    const { error } = await supabase.functions.invoke('send-demo-notification', {
      body: {
        to: NOTIFICATION_EMAIL,
        subject: 'New Demo Request from ' + demoRequest.company,
        demoRequest: {
          name: `${demoRequest.first_name} ${demoRequest.last_name}`,
          company: demoRequest.company,
          jobTitle: demoRequest.job_title,
          industry: demoRequest.industry,
          companySize: demoRequest.company_size,
          email: demoRequest.email,
          phone: demoRequest.phone,
          message: demoRequest.message || 'No additional message provided',
          requestId: demoRequest.id,
          requestDate: new Date(demoRequest.created_at).toLocaleString(),
        }
      }
    });

    if (error) throw error;
  } catch (err) {
    console.error('Failed to send demo request notification:', err);
    throw new Error('Failed to send email notification');
  }
}