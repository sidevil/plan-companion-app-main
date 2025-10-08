import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  attendees?: string[];
}

export const useCalendar = (icalUrl?: string) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCalendar = async () => {
    if (!icalUrl) {
      setEvents([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: functionError } = await supabase.functions.invoke('fetch-calendar', {
        body: { icalUrl }
      });

      if (functionError) {
        throw functionError;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      // Convert date strings to Date objects
      const parsedEvents = (data.events || []).map((event: any) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      }));

      setEvents(parsedEvents);
    } catch (err) {
      console.error('Error fetching calendar:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch calendar');
      
      // Keep cached events on error
      if (events.length > 0) {
        console.log('Using cached calendar data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
    
    // Refresh calendar every 15 minutes
    const interval = setInterval(fetchCalendar, 15 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [icalUrl]);

  return { events, loading, error, refetch: fetchCalendar };
};
