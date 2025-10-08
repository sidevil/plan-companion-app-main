import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { ProfileSetup } from '@/components/profile/ProfileSetup';
import { PreferenceSelection } from '@/components/profile/PreferenceSelection';
import { DeviceLinking } from '@/components/profile/DeviceLinking';
import { VoiceProfileTraining } from '@/components/profile/VoiceProfileTraining';
import { Upload, User, Settings, Mic, Smartphone } from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('setup');
  const [guestMode, setGuestMode] = useState(false);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">User Profile</h1>
        <p className="text-muted-foreground">Customize your SmartMirror experience</p>
      </div>

      <div className="flex justify-end mb-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="guest-mode">Guest Mode</Label>
          <Switch
            id="guest-mode"
            checked={guestMode}
            onCheckedChange={setGuestMode}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setup" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Setup
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="devices" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Devices
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            Voice
          </TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          <ProfileSetup guestMode={guestMode} />
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <PreferenceSelection />
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <DeviceLinking />
        </TabsContent>

        <TabsContent value="voice" className="space-y-6">
          <VoiceProfileTraining />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;