import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Bell, Volume2, Clock, AlertTriangle } from 'lucide-react';

export const NotificationSettings = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    enabled: true,
    sound: true,
    volume: [75],
    vibration: false,
    doNotDisturb: false,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '07:00'
    },
    categories: {
      calendar: true,
      weather: true,
      news: false,
      smarthome: true,
      system: true,
      updates: false
    }
  });

  const handleCategoryToggle = (category: string, enabled: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      categories: { ...prev.categories, [category]: enabled }
    }));
  };

  const handleQuietHoursToggle = (enabled: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      quietHours: { ...prev.quietHours, enabled }
    }));
  };

  const testNotification = () => {
    // Test notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('SmartMirror Test', {
        body: 'This is a test notification from your SmartMirror.',
        icon: '/favicon.ico'
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('SmartMirror Test', {
            body: 'This is a test notification from your SmartMirror.',
            icon: '/favicon.ico'
          });
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            General Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications from SmartMirror</p>
            </div>
            <Switch
              checked={notificationSettings.enabled}
              onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, enabled: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Sound Notifications</Label>
              <p className="text-sm text-muted-foreground">Play sounds with notifications</p>
            </div>
            <Switch
              checked={notificationSettings.sound}
              onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, sound: checked }))}
            />
          </div>

          {notificationSettings.sound && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  Volume
                </Label>
                <span className="text-sm text-muted-foreground">{notificationSettings.volume[0]}%</span>
              </div>
              <Slider
                value={notificationSettings.volume}
                onValueChange={(value) => setNotificationSettings(prev => ({ ...prev, volume: value }))}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Vibration (Mobile)</Label>
              <p className="text-sm text-muted-foreground">Vibrate on mobile devices</p>
            </div>
            <Switch
              checked={notificationSettings.vibration}
              onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, vibration: checked }))}
            />
          </div>

          <div className="flex justify-between items-center">
            <div>
              <Label>Test Notifications</Label>
              <p className="text-sm text-muted-foreground">Send a test notification</p>
            </div>
            <Button variant="outline" size="sm" onClick={testNotification}>
              Test
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Quiet Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Quiet Hours</Label>
              <p className="text-sm text-muted-foreground">Mute notifications during specified hours</p>
            </div>
            <Switch
              checked={notificationSettings.quietHours.enabled}
              onCheckedChange={handleQuietHoursToggle}
            />
          </div>

          {notificationSettings.quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Select
                  value={notificationSettings.quietHours.start}
                  onValueChange={(value) => setNotificationSettings(prev => ({
                    ...prev,
                    quietHours: { ...prev.quietHours, start: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, '0');
                      return (
                        <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                          {hour}:00
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Select
                  value={notificationSettings.quietHours.end}
                  onValueChange={(value) => setNotificationSettings(prev => ({
                    ...prev,
                    quietHours: { ...prev.quietHours, end: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, '0');
                      return (
                        <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                          {hour}:00
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Notification Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(notificationSettings.categories).map(([category, enabled]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</Label>
                  <p className="text-sm text-muted-foreground">
                    {category === 'calendar' && 'Upcoming events and appointments'}
                    {category === 'weather' && 'Weather alerts and updates'}
                    {category === 'news' && 'Breaking news and headlines'}
                    {category === 'smarthome' && 'Smart home device status and alerts'}
                    {category === 'system' && 'System messages and errors'}
                    {category === 'updates' && 'App updates and new features'}
                  </p>
                </div>
                <Switch
                  checked={enabled}
                  onCheckedChange={(checked) => handleCategoryToggle(category, checked)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Settings</Button>
      </div>
    </div>
  );
};