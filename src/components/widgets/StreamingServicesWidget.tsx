import React, { useState } from 'react';
import { X, Youtube, Tv, Film } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const STREAMING_SERVICES = [
  {
    name: 'YouTube',
    url: 'https://www.youtube.com',
    icon: Youtube,
    color: 'bg-red-600 hover:bg-red-700'
  },
  {
    name: 'Netflix',
    url: 'https://www.netflix.com',
    icon: Film,
    color: 'bg-red-800 hover:bg-red-900'
  },
  {
    name: 'Prime Video',
    url: 'https://www.primevideo.com',
    icon: Tv,
    color: 'bg-blue-600 hover:bg-blue-700'
  },
  {
    name: 'Disney+ Hotstar',
    url: 'https://www.hotstar.com',
    icon: Tv,
    color: 'bg-blue-800 hover:bg-blue-900'
  },
  {
    name: 'Hulu',
    url: 'https://www.hulu.com',
    icon: Tv,
    color: 'bg-green-600 hover:bg-green-700'
  },
  {
    name: 'HBO Max',
    url: 'https://www.max.com',
    icon: Film,
    color: 'bg-purple-600 hover:bg-purple-700'
  }
];

export const StreamingServicesWidget = () => {
  const [activeService, setActiveService] = useState<typeof STREAMING_SERVICES[0] | null>(null);

  const handleServiceClick = (service: typeof STREAMING_SERVICES[0]) => {
    setActiveService(service);
  };

  const handleClose = () => {
    setActiveService(null);
  };

  if (activeService) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="outline"
            size="icon"
            onClick={handleClose}
            className="rounded-full bg-background/80 backdrop-blur-sm"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <iframe
          src={activeService.url}
          className="w-full h-full border-0"
          title={activeService.name}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <Card className="p-6 h-full">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Streaming Services</h3>
      <div className="grid grid-cols-2 gap-4">
        {STREAMING_SERVICES.map((service) => {
          const Icon = service.icon;
          return (
            <button
              key={service.name}
              onClick={() => handleServiceClick(service)}
              className={`${service.color} text-white rounded-lg p-6 flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95`}
            >
              <Icon className="h-10 w-10" />
              <span className="text-sm font-medium text-center">{service.name}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
};
