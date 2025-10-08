import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Destination {
  name: string;
  address: string;
}

interface TrafficRoute {
  destination: string;
  address: string;
  duration: string;
  durationValue: number;
  distance: string;
  distanceValue: number;
  traffic: 'light' | 'moderate' | 'heavy';
}

export const useTraffic = (origin: string, destinations: Destination[]) => {
  const [routes, setRoutes] = useState<TrafficRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTraffic = async () => {
    if (!origin || destinations.length === 0) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: functionError } = await supabase.functions.invoke('fetch-traffic', {
        body: { origin, destinations }
      });

      if (functionError) {
        throw functionError;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setRoutes(data.routes);
    } catch (err) {
      console.error('Error fetching traffic:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch traffic');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTraffic();
    
    // Refresh traffic every 10 minutes
    const interval = setInterval(fetchTraffic, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [origin, JSON.stringify(destinations)]);

  return { routes, loading, error, refetch: fetchTraffic };
};
