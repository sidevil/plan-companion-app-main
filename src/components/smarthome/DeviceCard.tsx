import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Lightbulb, Thermometer, Shield, Power } from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: 'light' | 'thermostat' | 'security';
  status: string;
  value?: number;
  room: string;
}

interface DeviceCardProps {
  device: Device;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => {
  const [localDevice, setLocalDevice] = useState(device);

  const getDeviceIcon = () => {
    switch (device.type) {
      case 'light':
        return <Lightbulb className="h-5 w-5" />;
      case 'thermostat':
        return <Thermometer className="h-5 w-5" />;
      case 'security':
        return <Shield className="h-5 w-5" />;
      default:
        return <Power className="h-5 w-5" />;
    }
  };

  const handleToggle = () => {
    const newStatus = localDevice.status === 'on' || localDevice.status === 'heating' || localDevice.status === 'unlocked' 
      ? (device.type === 'light' ? 'off' : device.type === 'thermostat' ? 'off' : 'locked')
      : (device.type === 'light' ? 'on' : device.type === 'thermostat' ? 'heating' : 'unlocked');
    
    setLocalDevice(prev => ({ ...prev, status: newStatus }));
  };

  const handleValueChange = (value: number[]) => {
    setLocalDevice(prev => ({ ...prev, value: value[0] }));
  };

  const isActive = localDevice.status === 'on' || localDevice.status === 'heating' || localDevice.status === 'unlocked';

  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            {getDeviceIcon()}
            {device.name}
          </div>
          <Switch 
            checked={isActive}
            onCheckedChange={handleToggle}
            aria-label={`Toggle ${device.name}`}
          />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Status:</span>
          <span className={`font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
            {localDevice.status}
          </span>
        </div>
        
        {device.type === 'light' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Brightness:</span>
              <span className="font-medium">{localDevice.value}%</span>
            </div>
            <Slider
              value={[localDevice.value || 0]}
              onValueChange={handleValueChange}
              max={100}
              step={1}
              className="w-full"
              disabled={!isActive}
            />
          </div>
        )}
        
        {device.type === 'thermostat' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Temperature:</span>
              <span className="font-medium">{localDevice.value}°F</span>
            </div>
            <Slider
              value={[localDevice.value || 70]}
              onValueChange={handleValueChange}
              min={60}
              max={85}
              step={1}
              className="w-full"
              disabled={!isActive}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};