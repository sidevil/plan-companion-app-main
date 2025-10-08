import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DisplayConfiguration } from '@/components/settings/DisplayConfiguration';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { PrivacyControls } from '@/components/settings/PrivacyControls';
import { DataManagement } from '@/components/settings/DataManagement';
import { Monitor, Bell, Shield, Database, User } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('display');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Customize your SmartMirror experience</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="display" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Display
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Account
          </TabsTrigger>
        </TabsList>

        <TabsContent value="display" className="space-y-6">
          <DisplayConfiguration />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <PrivacyControls />
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <DataManagement />
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Account settings will be available after authentication is implemented.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;