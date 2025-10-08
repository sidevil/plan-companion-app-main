import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  location?: string;
  attendees?: string[];
}

function parseICalDate(dateStr: string): Date {
  // Parse iCal date format: YYYYMMDDTHHMMSSZ or YYYYMMDD
  if (dateStr.includes('T')) {
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1;
    const day = parseInt(dateStr.substring(6, 8));
    const hour = parseInt(dateStr.substring(9, 11));
    const minute = parseInt(dateStr.substring(11, 13));
    const second = parseInt(dateStr.substring(13, 15));
    return new Date(Date.UTC(year, month, day, hour, minute, second));
  } else {
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1;
    const day = parseInt(dateStr.substring(6, 8));
    return new Date(year, month, day);
  }
}

function parseICalData(icalData: string): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const lines = icalData.split('\n').map(line => line.trim());
  
  let currentEvent: Partial<CalendarEvent> | null = null;
  let currentField = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line === 'BEGIN:VEVENT') {
      currentEvent = {};
    } else if (line === 'END:VEVENT' && currentEvent) {
      if (currentEvent.title && currentEvent.start && currentEvent.end) {
        events.push({
          id: currentEvent.id || `event-${events.length}`,
          title: currentEvent.title,
          start: currentEvent.start,
          end: currentEvent.end,
          description: currentEvent.description,
          location: currentEvent.location,
          attendees: currentEvent.attendees,
        });
      }
      currentEvent = null;
    } else if (currentEvent && line) {
      // Handle line continuation (lines starting with space or tab)
      if (line.startsWith(' ') || line.startsWith('\t')) {
        if (currentField && currentEvent[currentField as keyof CalendarEvent]) {
          (currentEvent as any)[currentField] += line.trim();
        }
        continue;
      }
      
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) continue;
      
      let field = line.substring(0, colonIndex);
      const value = line.substring(colonIndex + 1).trim();
      
      // Remove parameters from field name (e.g., DTSTART;VALUE=DATE:20240115)
      const semicolonIndex = field.indexOf(';');
      if (semicolonIndex !== -1) {
        field = field.substring(0, semicolonIndex);
      }
      
      currentField = field;
      
      switch (field) {
        case 'UID':
          currentEvent.id = value;
          break;
        case 'SUMMARY':
          currentEvent.title = value;
          break;
        case 'DTSTART':
          currentEvent.start = parseICalDate(value).toISOString();
          break;
        case 'DTEND':
          currentEvent.end = parseICalDate(value).toISOString();
          break;
        case 'DESCRIPTION':
          currentEvent.description = value.replace(/\\n/g, '\n').replace(/\\,/g, ',');
          break;
        case 'LOCATION':
          currentEvent.location = value;
          break;
        case 'ATTENDEE':
          if (!currentEvent.attendees) {
            currentEvent.attendees = [];
          }
          // Extract email from MAILTO: format
          const email = value.replace('mailto:', '').split(';')[0];
          currentEvent.attendees.push(email);
          break;
      }
    }
  }
  
  return events;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { icalUrl } = await req.json();
    
    if (!icalUrl) {
      return new Response(
        JSON.stringify({ error: 'iCal URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching iCal data from:', icalUrl);

    // Fetch the iCal file
    const response = await fetch(icalUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch iCal file: ${response.statusText}`);
    }

    const icalData = await response.text();
    console.log('iCal data fetched, parsing...');

    // Parse the iCal data
    const events = parseICalData(icalData);
    console.log(`Parsed ${events.length} events`);

    return new Response(
      JSON.stringify({ events }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching calendar:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to fetch calendar data',
        events: []
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
