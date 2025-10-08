import React, { useState, useEffect } from 'react';
import { CalendarView } from '@/components/calendar/CalendarView';
import { EventCard } from '@/components/calendar/EventCard';
import { QuickEventCreation } from '@/components/calendar/QuickEventCreation';
import { CalendarSync } from '@/components/calendar/CalendarSync';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar as CalendarIcon, List } from 'lucide-react';
import { useCalendar } from '@/hooks/useCalendar';

const mockEvents = [
  {
    id: '1',
    title: 'Morning Meeting',
    start: new Date('2024-01-15T09:00:00'),
    end: new Date('2024-01-15T10:00:00'),
    description: 'Weekly team standup meeting',
    attendees: ['john@example.com', 'jane@example.com'],
    location: 'Conference Room A'
  },
  {
    id: '2',
    title: 'Doctor Appointment',
    start: new Date('2024-01-15T14:30:00'),
    end: new Date('2024-01-15T15:30:00'),
    description: 'Annual checkup',
    location: 'Medical Center'
  },
  {
    id: '3',
    title: 'Smart Home Setup',
    start: new Date('2024-01-16T10:00:00'),
    end: new Date('2024-01-16T12:00:00'),
    description: 'Install new smart devices',
    location: 'Home'
  }
];

const Calendar = () => {
  const [icalUrl, setIcalUrl] = useState<string>('');
  const { events: calendarEvents, loading } = useCalendar(icalUrl);
  const [localEvents, setLocalEvents] = useState(mockEvents);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventCreation, setShowEventCreation] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  // Combine calendar events with local events
  const events = [...calendarEvents, ...localEvents];

  const handleCreateEvent = (eventData: any) => {
    const newEvent = {
      id: Date.now().toString(),
      ...eventData,
    };
    setLocalEvents(prev => [...prev, newEvent]);
    setShowEventCreation(false);
  };

  const handleIcalUrlChange = (url: string) => {
    setIcalUrl(url);
    localStorage.setItem('calendar-ical-url', url);
  };

  // Load saved iCal URL on mount
  useEffect(() => {
    const savedUrl = localStorage.getItem('calendar-ical-url');
    if (savedUrl) {
      setIcalUrl(savedUrl);
    }
  }, []);

  const todaysEvents = events.filter(event => {
    const today = new Date();
    const eventDate = new Date(event.start);
    return eventDate.toDateString() === today.toDateString();
  });

  const upcomingEvents = events.filter(event => {
    const today = new Date();
    const eventDate = new Date(event.start);
    return eventDate > today;
  }).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Calendar</h1>
          <p className="text-muted-foreground">Manage your events and appointments</p>
        </div>
        
        <Button onClick={() => setShowEventCreation(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="sync">Sync</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-6">
          <CalendarView 
            events={events}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </TabsContent>
        
        <TabsContent value="events" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Today's Events</h3>
              {todaysEvents.length > 0 ? (
                <div className="space-y-3">
                  {todaysEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No events scheduled for today</p>
              )}
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Upcoming Events</h3>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No upcoming events</p>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="sync" className="space-y-6">
          <CalendarSync 
            icalUrl={icalUrl}
            onIcalUrlChange={handleIcalUrlChange}
          />
        </TabsContent>
      </Tabs>

      {showEventCreation && (
        <QuickEventCreation
          onEventCreate={handleCreateEvent}
          onClose={() => setShowEventCreation(false)}
        />
      )}
    </div>
  );
};

export default Calendar;