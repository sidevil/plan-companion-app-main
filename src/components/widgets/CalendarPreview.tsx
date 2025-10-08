import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { useCalendar } from '@/hooks/useCalendar';

// Placeholder data - will be replaced with real calendar API data in Phase 6
const mockEvents = [
  {
    id: 1,
    title: 'Team Standup',
    time: '9:00 AM',
    duration: '30 min'
  },
  {
    id: 2,
    title: 'Project Review',
    time: '2:00 PM',
    duration: '1 hour'
  },
  {
    id: 3,
    title: 'Doctor Appointment',
    time: '4:30 PM',
    duration: '45 min'
  }
];

interface CalendarPreviewProps {
  config?: {
    icalUrl?: string;
    daysAhead?: string;
    showAllDay?: boolean;
  };
}

export const CalendarPreview: React.FC<CalendarPreviewProps> = ({ config = {} }) => {
  const icalUrl = config.icalUrl || '';
  const { events: calendarEvents, loading } = useCalendar(icalUrl);

  // Get today and upcoming events only
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const upcomingEvents = calendarEvents
    .filter(event => new Date(event.start) >= startOfToday)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5); // Show next 5 upcoming events

  // Format events for display
  const displayEvents = upcomingEvents.map(event => {
    const eventDate = new Date(event.start);
    const eventEndDate = new Date(event.end);
    
    // Check if it's an all-day event (no time component or exactly 24 hours)
    const isAllDay = eventDate.getHours() === 0 && eventDate.getMinutes() === 0 && 
                     (eventEndDate.getTime() - eventDate.getTime() >= 24 * 60 * 60 * 1000 - 1);
    
    return {
      id: event.id,
      title: event.title,
      date: eventDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: eventDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      }),
      isAllDay,
      isToday: eventDate.toDateString() === now.toDateString()
    };
  });

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-accent" />
          Upcoming Events
        </CardTitle>
        {icalUrl && (
          <p className="text-xs text-muted-foreground">
            From iCal feed
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="text-center py-4 text-muted-foreground">
            <p className="text-sm">Loading events...</p>
          </div>
        ) : displayEvents.length > 0 ? (
          displayEvents.map((event) => (
            <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-accent" />
                <div>
                  <div className="font-medium text-sm">{event.title}</div>
                  {event.isToday && (
                    <div className="text-xs text-accent font-medium">Today</div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{event.date}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              {icalUrl && !loading 
                ? 'No upcoming events' 
                : 'No events scheduled'}
            </p>
            {!icalUrl && (
              <p className="text-xs mt-1">Configure iCal URL in widget settings</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};