import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Sun, Thermometer, Droplets, Wind, CloudRain, CloudSnow, Loader2, AlertCircle } from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';
import { format } from 'date-fns';

interface WeatherWidgetProps {
  config?: {
    location?: string;
    units?: string;
    showForecast?: boolean;
  };
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ config = {} }) => {
  const location = config.location || 'New York';
  const units = config.units || 'fahrenheit';
  const showForecast = config.showForecast ?? true;
  const { weather, loading, error } = useWeather(location, units);
  
  const getWeatherIcon = (condition: string, size: string = "h-8 w-8") => {
    switch (condition.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return <Sun className={`${size} text-yellow-500`} />;
      case 'clouds':
      case 'partly cloudy':
        return <Cloud className={`${size} text-accent`} />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className={`${size} text-blue-500`} />;
      case 'snow':
        return <CloudSnow className={`${size} text-blue-300`} />;
      default:
        return <Cloud className={`${size} text-accent`} />;
    }
  };

  if (loading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="flex flex-col items-center justify-center h-48 gap-2">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-sm text-muted-foreground">
            {error || 'Unable to load weather'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          {getWeatherIcon(weather.condition)}
          Weather
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-foreground flex items-center justify-center gap-1">
            <Thermometer className="h-6 w-6" />
            {weather.temperature}°{units === 'celsius' ? 'C' : 'F'}
          </div>
          <div className="text-sm text-muted-foreground mt-1 capitalize">
            {weather.description}
          </div>
          <div className="text-xs text-muted-foreground">
            {weather.location}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-accent" />
            <span>{weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-accent" />
            <span>{weather.windSpeed} mph</span>
          </div>
        </div>

        {showForecast && weather.forecast && weather.forecast.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <h4 className="text-xs font-semibold mb-3 text-muted-foreground">5-Day Forecast</h4>
            <div className="grid grid-cols-5 gap-2">
              {weather.forecast.map((day, index) => (
                <div key={index} className="flex flex-col items-center gap-1 text-center">
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(day.date), 'EEE')}
                  </span>
                  {getWeatherIcon(day.condition, "h-5 w-5")}
                  <span className="text-xs font-semibold">
                    {day.temperature}°
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};