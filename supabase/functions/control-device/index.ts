import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { deviceId, action, value } = await req.json();
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get user from auth header
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('Controlling device:', deviceId, 'action:', action, 'value:', value);

    // Get device from database
    const { data: device, error: deviceError } = await supabaseClient
      .from('smart_home_devices')
      .select('*')
      .eq('id', deviceId)
      .eq('user_id', user.id)
      .single();

    if (deviceError || !device) {
      throw new Error('Device not found');
    }

    // Update device status based on action
    let newStatus = device.settings || {};
    
    switch (action) {
      case 'on':
        newStatus.power = 'on';
        break;
      case 'off':
        newStatus.power = 'off';
        break;
      case 'set_value':
        newStatus.value = value;
        break;
      case 'toggle':
        newStatus.power = newStatus.power === 'on' ? 'off' : 'on';
        break;
    }

    // Update device in database
    const { data: updatedDevice, error: updateError } = await supabaseClient
      .from('smart_home_devices')
      .update({
        settings: newStatus,
        last_seen: new Date().toISOString(),
      })
      .eq('id', deviceId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    console.log('Device updated successfully:', updatedDevice);

    // In a real implementation, you would also send commands to the actual device
    // via their respective APIs (Philips Hue, Google Home, etc.)

    return new Response(JSON.stringify({ 
      success: true,
      device: updatedDevice 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error controlling device:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to control device' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
