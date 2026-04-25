// app/api/webhook/lemon/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Cruciaal: God Mode nodig om RLS te bypassen
);

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-signature') || '';
  
  // Verifieer dat het bericht echt van Lemon Squeezy komt
  const hmac = crypto.createHmac('sha256', process.env.LEMON_SQUEEZY_WEBHOOK_SECRET!);
  const digest = hmac.update(rawBody).digest('hex');

  if (signature !== digest) {
    console.error("INVALID_SIGNATURE_DETECTED");
    return new Response('Invalid signature', { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const eventName = payload.meta.event_name;
  const userEmail = payload.data.attributes.user_email;

  console.log(`> INCOMING_WEBHOOK: ${eventName} for ${userEmail}`);

  try {
    if (eventName === 'order_created') {
      // $27 PARADOX_SHIFT (The Archive Access)
      // We zetten de rol naar FOUNDER
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: 'FOUNDER',
          subscription_status: 'ACTIVE' 
        })
        .eq('email', userEmail);
      
      if (error) throw error;
      console.log(`> STATUS_UPDATE: ${userEmail} is nu [ FOUNDER ]`);

    } else if (eventName === 'subscription_created') {
      // $49/mo FULL_DEPLOYMENT (The SaaS Operating System)
      // We zetten de rol naar OPERATOR en starten de drip-feed timer
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: 'OPERATOR',
          subscription_status: 'ACTIVE',
          subscription_started_at: new Date().toISOString()
        })
        .eq('email', userEmail);
      
      if (error) throw error;
      console.log(`> STATUS_UPDATE: ${userEmail} is nu [ OPERATOR ]`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("> WEBHOOK_ERROR:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}