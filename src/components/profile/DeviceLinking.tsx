import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Smartphone, Wifi, Plus, Trash2, Check, X } from 'lucide-react';

export const DeviceLinking = () => {
  const [devices, setDevices] = useState([
    { id: '1', name: 'Living Room Display', type: 'SmartMirror', status: 'connected', ip: '192.168.1.100' },
    { id: '2', name: 'Bedroom Mirror', type: 'SmartMirror', status: 'disconnected', ip: '192.168.1.101' },
    { id: '3', name: 'Kitchen Tablet', type: 'Tablet', status: 'connected', ip: '192.168.1.102' }
  ]);

  const [newDevice, setNewDevice] = useState({ name: '', ip: '', type: 'SmartMirror' });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddDevice = () => {
    if (newDevice.name && newDevice.ip) {
      const device = {
        id: Date.now().toString(),
        ...newDevice,
        status: 'connecting' as const
      };
      setDevices(prev => [...prev, device]);
      setNewDevice({ name: '', ip: '', type: 'SmartMirror' });
      setIsAdding(false);
      
      // Simulate connection attempt
      setTimeout(() => {
        setDevices(prev => prev.map(d => 
          d.id === device.id ? { ...d, status: 'connected' } : d
        ));
      }, 2000);
    }
  };

  const handleRemoveDevice = (deviceId: string) => {
    setDevices(prev => prev.filter(d => d.id !== deviceId));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'connecting':
        return <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
      case 'disconnected':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Wifi className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'connecting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'disconnected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Linked Devices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {devices.map((device) => (
              <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">{device.name}</h4>
                    <p className="text-sm text-muted-foreground">{device.type} • {device.ip}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(device.status)}
                    <Badge variant="outline" className={getStatusColor(device.status)}>
                      {device.status}
                    </Badge>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveDevice(device.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          {!isAdding ? (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Device
            </Button>
          ) : (
            <div className="space-y-4 border rounded-lg p-4">
              <h4 className="font-medium">Add New Device</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deviceName">Device Name</Label>
                  <Input
                    id="deviceName"
                    value={newDevice.name}
                    onChange={(e) => setNewDevice(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Kitchen Mirror"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deviceIp">IP Address</Label>
                  <Input
                    id="deviceIp"
                    value={newDevice.ip}
                    onChange={(e) => setNewDevice(prev => ({ ...prev, ip: e.target.value }))}
                    placeholder="e.g., 192.168.1.100"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleAddDevice} disabled={!newDevice.name || !newDevice.ip}>
                  Add Device
                </Button>
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Device Sync Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Sync Widget Layouts</Label>
              <p className="text-sm text-muted-foreground">Keep widget arrangements synchronized across devices</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded border-gray-300" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Sync User Preferences</Label>
              <p className="text-sm text-muted-foreground">Share theme, language, and display settings</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded border-gray-300" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Sync Voice Profiles</Label>
              <p className="text-sm text-muted-foreground">Share voice recognition training across devices</p>
            </div>
            <input type="checkbox" className="rounded border-gray-300" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};