import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation, Clock, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { useTraffic } from '@/hooks/useTraffic';

interface TrafficWidgetProps {
  config?: {
    homeAddress?: string;
    workAddress?: string;
    avoidTolls?: boolean;
  };
}

export const TrafficWidget: React.FC<TrafficWidgetProps> = ({ config = {} }) => {
  const homeAddress = config.homeAddress || '';
  const destinations = config.workAddress ? [
    { name: 'Work', address: config.workAddress }
  ] : [];

  const { routes, loading, error } = useTraffic(homeAddress, destinations);

  if (loading) {
    return (
      <>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Navigation className="h-5 w-5 text-accent" />
            Traffic & Routes
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </CardContent>
      </>
    );
  }

  if (error || !homeAddress) {
    return (
      <>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Navigation className="h-5 w-5 text-accent" />
            Traffic & Routes
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-32 gap-2">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-sm text-muted-foreground">
            {!homeAddress ? 'Set home address in settings' : 'Unable to load traffic'}
          </p>
        </CardContent>
      </>
    );
  }
  const getTrafficColor = (traffic: string) => {
    switch (traffic) {
      case 'light': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'heavy': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Navigation className="h-5 w-5 text-accent" />
          Traffic & Routes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-3">
          {routes.map((route, index) => (
            <div key={index} className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-accent mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">{route.destination}</div>
                    <div className="text-xs text-muted-foreground">{route.address}</div>
                    <div className="text-xs text-muted-foreground mt-1">{route.distance}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <Clock className="h-3 w-3" />
                    {route.duration}
                  </div>
                  <div className={`text-xs capitalize ${getTrafficColor(route.traffic)}`}>
                    {route.traffic} traffic
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center pt-2">
          <button className="text-sm text-accent hover:text-accent/80 font-medium transition-colors">
            View All Routes →
          </button>
        </div>
      </CardContent>
    </>
  );
};