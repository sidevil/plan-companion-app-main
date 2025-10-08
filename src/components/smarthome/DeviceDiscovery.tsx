import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Wifi, Plus, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const mockDiscoveredDevices = [
  {
    id: 'disc_1',
    name: 'Phillips Hue Bridge',
    type: 'Hub',
    manufacturer: 'Phillips',
    status: 'available',
    signalStrength: 85
  },
  {
    id: 'disc_2',
    name: 'Smart Bulb - Kitchen',
    type: 'Light',
    manufacturer: 'LIFX',
    status: 'available',
    signalStrength: 92
  },
  {
    id: 'disc_3',
    name: 'Nest Thermostat',
    type: 'Climate',
    manufacturer: 'Google',
    status: 'available',
    signalStrength: 78
  },
  {
    id: 'disc_4',
    name: 'Ring Doorbell',
    type: 'Security',
    manufacturer: 'Ring',
    status: 'paired',
    signalStrength: 88
  }
];

export const DeviceDiscovery = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState(mockDiscoveredDevices);
  const { toast } = useToast();

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scanning
    setTimeout(() => {
      setIsScanning(false);
      toast({
        title: "Scan Complete",
        description: `Found ${devices.filter(d => d.status === 'available').length} available devices`,
      });
    }, 3000);
  };

  const handleAddDevice = (deviceId: string) => {
    setDevices(prev => 
      prev.map(device => 
        device.id === deviceId 
          ? { ...device, status: 'paired' }
          : device
      )
    );
    
    const device = devices.find(d => d.id === deviceId);
    toast({
      title: "Device Added",
      description: `${device?.name} has been added to your smart home`,
    });
  };

  const getSignalColor = (strength: number) => {
    if (strength >= 80) return 'text-green-500';
    if (strength >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Device Discovery</h2>
          <p className="text-muted-foreground">Find and connect new smart home devices</p>
        </div>
        
        <Button 
          onClick={handleScan} 
          disabled={isScanning}
          className="w-full sm:w-auto"
        >
          {isScanning ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Scan for Devices
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-4">
        {devices.map((device) => (
          <Card key={device.id} className="transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{device.name}</CardTitle>
                <Badge variant={device.status === 'paired' ? 'default' : 'secondary'}>
                  {device.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{device.type}</p>
                  <p className="text-sm text-muted-foreground">{device.manufacturer}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Wifi className={`h-4 w-4 ${getSignalColor(device.signalStrength)}`} />
                  <span className="text-sm font-medium">{device.signalStrength}%</span>
                </div>
                
                <div className="flex justify-end">
                  {device.status === 'available' ? (
                    <Button 
                      size="sm" 
                      onClick={() => handleAddDevice(device.id)}
                      className="w-full sm:w-auto"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Device
                    </Button>
                  ) : (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Connected
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};