import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ForecastDay {
  date: string;
  temperature: number;
  condition: string;
  description: string;
  icon: string;
}

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  forecast?: ForecastDay[];
}

export const useWeather = (location: string = 'New York', units: string = 'fahrenheit') => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: functionError } = await supabase.functions.invoke('fetch-weather', {
        body: { location, units }
      });

      if (functionError) {
        throw functionError;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setWeather(data);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather');
      
      // Fallback to cached data if available
      if (weather) {
        console.log('Using cached weather data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    
    // Refresh weather every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [location, units]);

  return { weather, loading, error, refetch: fetchWeather };
};
