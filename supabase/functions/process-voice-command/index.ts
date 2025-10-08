import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transcript } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    if (!transcript) {
      throw new Error('transcript is required');
    }

    console.log('Processing voice command:', transcript);

    // Use Lovable AI to process the voice command
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a smart mirror assistant. Parse voice commands and return structured JSON responses. Available commands:
- Navigation: go to [home/widgets/smart home/settings/news/calendar/voice help]
- Widget control: add/remove widget
- Device control: turn on/off [lights/thermostat]
- Scene activation: activate [morning/night/away/movie] scene
- Queries: what time is it, what's the weather

Respond only with valid JSON in this format:
{
  "type": "navigate|widget|device|scene|query|unknown",
  "action": "the action to perform",
  "params": { any additional parameters },
  "response": "natural language response to user"
}`
          },
          {
            role: 'user',
            content: transcript
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI response:', aiResponse);

    // Parse the AI response
    let command;
    try {
      command = JSON.parse(aiResponse);
    } catch (e) {
      // If AI didn't return valid JSON, create a generic response
      command = {
        type: 'unknown',
        response: aiResponse,
      };
    }

    return new Response(JSON.stringify(command), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing voice command:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to process voice command',
        type: 'error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
