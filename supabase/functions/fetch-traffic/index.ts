import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { origin, destinations } = await req.json();
    const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');

    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('GOOGLE_MAPS_API_KEY is not configured');
    }

    if (!origin || !destinations || !Array.isArray(destinations)) {
      throw new Error('origin and destinations array are required');
    }

    console.log('Fetching traffic data from:', origin, 'to:', destinations);

    // Fetch distance matrix data
    const destinationsStr = destinations.map(d => d.address).join('|');
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destinationsStr)}&departure_time=now&traffic_model=best_guess&key=${GOOGLE_MAPS_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Google Maps API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Google Maps API returned status: ${data.status}`);
    }

    // Transform the data into our format
    const routes = data.rows[0].elements.map((element: any, index: number) => {
      if (element.status !== 'OK') {
        return null;
      }

      const duration = element.duration_in_traffic || element.duration;
      const trafficLevel = getTrafficLevel(duration.value, element.duration.value);

      return {
        destination: destinations[index].name,
        address: destinations[index].address,
        duration: duration.text,
        durationValue: duration.value,
        distance: element.distance.text,
        distanceValue: element.distance.value,
        traffic: trafficLevel,
      };
    }).filter((route: any) => route !== null);

    console.log(`Fetched ${routes.length} routes successfully`);

    return new Response(JSON.stringify({ routes }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching traffic:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to fetch traffic' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function getTrafficLevel(trafficDuration: number, normalDuration: number): string {
  const ratio = trafficDuration / normalDuration;
  
  if (ratio < 1.2) {
    return 'light';
  } else if (ratio < 1.5) {
    return 'moderate';
  } else {
    return 'heavy';
  }
}
