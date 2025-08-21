import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { SmtpClient } from 'https://deno.land/x/smtp@v0.7.0/mod.ts';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

// Email validation schema
const EmailRequestSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1).max(200),
  demoRequest: z.object({
    name: z.string().min(1).max(100),
    company: z.string().min(1).max(100),
    jobTitle: z.string().min(1).max(100),
    industry: z.string().min(1).max(100),
    companySize: z.string().min(1).max(100),
    email: z.string().email(),
    phone: z.string().min(5).max(20),
    message: z.string().max(1000),
    requestId: z.string().uuid(),
    requestDate: z.string(),
  }),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting
const RATE_LIMIT = 10; // requests per window
const RATE_WINDOW = 60000; // 1 minute in milliseconds
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (now - record.timestamp > RATE_WINDOW) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
          status: 429,
        }
      );
    }

    // Validate request body
    const body = await req.json();
    const validatedData = EmailRequestSchema.parse(body);

    // Get SMTP credentials from environment variables
    const SMTP_CONFIG = {
      hostname: Deno.env.get('SMTP_HOST') || '',
      port: parseInt(Deno.env.get('SMTP_PORT') || '587'),
      username: Deno.env.get('SMTP_USERNAME') || '',
      password: Deno.env.get('SMTP_PASSWORD') || '',
    };

    // Validate SMTP configuration
    if (!SMTP_CONFIG.hostname || !SMTP_CONFIG.username || !SMTP_CONFIG.password) {
      throw new Error('SMTP configuration is incomplete');
    }

    // Create email content with sanitization
    const emailContent = `
New Demo Request Details:

Name: ${validatedData.demoRequest.name.replace(/[<>]/g, '')}
Company: ${validatedData.demoRequest.company.replace(/[<>]/g, '')}
Job Title: ${validatedData.demoRequest.jobTitle.replace(/[<>]/g, '')}
Industry: ${validatedData.demoRequest.industry.replace(/[<>]/g, '')}
Company Size: ${validatedData.demoRequest.companySize.replace(/[<>]/g, '')}

Contact Information:
Email: ${validatedData.demoRequest.email}
Phone: ${validatedData.demoRequest.phone.replace(/[<>]/g, '')}

Message:
${validatedData.demoRequest.message.replace(/[<>]/g, '')}

Request Details:
ID: ${validatedData.demoRequest.requestId}
Date: ${validatedData.demoRequest.requestDate}

---
This is an automated notification from AipaFlow.
    `.trim();

    // Initialize SMTP client with timeout
    const client = new SmtpClient();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('SMTP connection timeout')), 10000);
    });

    try {
      // Connect to SMTP server with timeout
      await Promise.race([
        client.connectTLS({
          hostname: SMTP_CONFIG.hostname,
          port: SMTP_CONFIG.port,
          username: SMTP_CONFIG.username,
          password: SMTP_CONFIG.password,
        }),
        timeoutPromise,
      ]);

      // Send email
      await client.send({
        from: SMTP_CONFIG.username,
        to: validatedData.to,
        subject: validatedData.subject,
        content: emailContent,
      });
    } finally {
      // Always try to close the connection
      try {
        await client.close();
      } catch (closeError) {
        console.error('Error closing SMTP connection:', closeError);
      }
    }

    return new Response(
      JSON.stringify({ message: 'Email sent successfully' }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    const statusCode = error instanceof z.ZodError ? 400 : 500;

    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error instanceof z.ZodError ? error.errors : undefined
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: statusCode,
      }
    );
  }
});