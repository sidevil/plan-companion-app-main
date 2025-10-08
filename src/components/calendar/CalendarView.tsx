import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, CalendarDays, Calendar, Clock } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
}

interface CalendarViewProps {
  events: Event[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  viewMode: 'month' | 'week' | 'day';
  onViewModeChange: (mode: 'month' | 'week' | 'day') => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  selectedDate,
  onDateSelect,
  viewMode,
  onViewModeChange
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    
    switch (viewMode) {
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    onDateSelect(newDate);
  };

  const getEventsForSelectedDate = () => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === selectedDate.toDateString();
    });
  };

  const selectedDateEvents = getEventsForSelectedDate();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-xl">{formatDate(selectedDate)}</CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant={viewMode === 'day' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onViewModeChange('day')}
              >
                <Clock className="h-4 w-4 mr-1" />
                Day
              </Button>
              <Button
                variant={viewMode === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onViewModeChange('week')}
              >
                <CalendarDays className="h-4 w-4 mr-1" />
                Week
              </Button>
              <Button
                variant={viewMode === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onViewModeChange('month')}
              >
                <Calendar className="h-4 w-4 mr-1" />
                Month
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="text-center p-8 border-2 border-dashed border-muted-foreground/20 rounded-lg">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View
              </h3>
              <p className="text-sm text-muted-foreground">
                Interactive calendar view will be implemented with full calendar library integration
              </p>
            </div>
            
            {selectedDateEvents.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">
                  Events for {selectedDate.toLocaleDateString()}
                </h4>
                {selectedDateEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-2 h-8 bg-primary rounded-full" />
                    <div className="flex-1">
                      <h5 className="font-medium text-foreground">{event.title}</h5>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{formatTime(event.start)} - {formatTime(event.end)}</span>
                        {event.location && <span>📍 {event.location}</span>}
                      </div>
                    </div>
                    <Badge variant="outline">
                      {Math.round((event.end.getTime() - event.start.getTime()) / (1000 * 60))}min
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};