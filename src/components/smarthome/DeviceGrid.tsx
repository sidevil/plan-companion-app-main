import React from 'react';
import { DeviceCard } from './DeviceCard';

const mockDevices = [
  {
    id: '1',
    name: 'Living Room Lights',
    type: 'light' as const,
    status: 'on',
    value: 75,
    room: 'Living Room'
  },
  {
    id: '2',
    name: 'Main Thermostat',
    type: 'thermostat' as const,
    status: 'heating',
    value: 72,
    room: 'Hallway'
  },
  {
    id: '3',
    name: 'Front Door Lock',
    type: 'security' as const,
    status: 'locked',
    room: 'Entrance'
  },
  {
    id: '4',
    name: 'Bedroom Lights',
    type: 'light' as const,
    status: 'off',
    value: 0,
    room: 'Bedroom'
  }
] as const;

export const DeviceGrid = () => {
  const groupedDevices = mockDevices.reduce((acc, device) => {
    if (!acc[device.room]) {
      acc[device.room] = [];
    }
    acc[device.room].push(device);
    return acc;
  }, {} as Record<string, Array<typeof mockDevices[number]>>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedDevices).map(([room, devices]) => (
        <div key={room} className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">{room}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};