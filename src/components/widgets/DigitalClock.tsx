import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const DigitalClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all duration-300">
      <CardContent className="p-6 text-center">
        <div className="space-y-2">
          <div className="text-4xl md:text-5xl font-bold text-foreground font-mono tracking-wider">
            {formatTime(currentTime)}
          </div>
          <div className="text-lg text-muted-foreground">
            {formatDate(currentTime)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};