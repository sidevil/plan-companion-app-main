import React, { useState } from 'react';
import { DeviceDiscovery } from '@/components/smarthome/DeviceDiscovery';
import { DeviceGrid } from '@/components/smarthome/DeviceGrid';
import { SceneManager } from '@/components/smarthome/SceneManager';
import { AutomationRules } from '@/components/smarthome/AutomationRules';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SmartHome = () => {
  const [activeTab, setActiveTab] = useState('devices');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Smart Home Control</h1>
        <p className="text-muted-foreground">Manage your connected devices and automation</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="discovery">Discovery</TabsTrigger>
          <TabsTrigger value="scenes">Scenes</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="devices" className="space-y-6">
          <DeviceGrid />
        </TabsContent>
        
        <TabsContent value="discovery" className="space-y-6">
          <DeviceDiscovery />
        </TabsContent>
        
        <TabsContent value="scenes" className="space-y-6">
          <SceneManager />
        </TabsContent>
        
        <TabsContent value="automation" className="space-y-6">
          <AutomationRules />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartHome;