import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Settings, Save } from 'lucide-react';

export const PreferenceSelection = () => {
  const [preferences, setPreferences] = useState({
    theme: 'auto',
    language: 'en',
    temperatureUnit: 'fahrenheit',
    timeFormat: '12h',
    autoUpdate: true,
    notifications: true,
    proximityDetection: true,
    voiceActivation: true,
    widgets: [] as string[],
    updateInterval: [30] as number[]
  });

  const availableWidgets = [
    { id: 'weather', label: 'Weather' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'news', label: 'News' },
    { id: 'stocks', label: 'Stock Market' },
    { id: 'traffic', label: 'Traffic' },
    { id: 'social', label: 'Social Media' },
    { id: 'tasks', label: 'Task Management' },
    { id: 'photos', label: 'Photo Slideshow' }
  ];

  const handleWidgetToggle = (widgetId: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      widgets: checked 
        ? [...prev.widgets, widgetId]
        : prev.widgets.filter(id => id !== widgetId)
    }));
  };

  const handleSave = () => {
    console.log('Saving preferences:', preferences);
    // Save preferences logic would go here
  };

  return (
    <div className="space-y-6">
      {/* Display Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Display Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select value={preferences.theme} onValueChange={(value) => setPreferences(prev => ({ ...prev, theme: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="mirror">Mirror Mode</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={preferences.language} onValueChange={(value) => setPreferences(prev => ({ ...prev, language: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature Unit</Label>
              <Select value={preferences.temperatureUnit} onValueChange={(value) => setPreferences(prev => ({ ...prev, temperatureUnit: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                  <SelectItem value="celsius">Celsius (°C)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeFormat">Time Format</Label>
              <Select value={preferences.timeFormat} onValueChange={(value) => setPreferences(prev => ({ ...prev, timeFormat: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12 Hour</SelectItem>
                  <SelectItem value="24h">24 Hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Update Interval (seconds): {preferences.updateInterval[0]}</Label>
            <Slider
              value={preferences.updateInterval}
              onValueChange={(value) => setPreferences(prev => ({ ...prev, updateInterval: value }))}
              min={10}
              max={300}
              step={10}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* System Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>System Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'autoUpdate', label: 'Auto Update Widgets', description: 'Automatically refresh widget data' },
            { key: 'notifications', label: 'Enable Notifications', description: 'Show system notifications and alerts' },
            { key: 'proximityDetection', label: 'Proximity Detection', description: 'Activate display when you approach' },
            { key: 'voiceActivation', label: 'Voice Activation', description: 'Enable voice commands and control' }
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor={setting.key}>{setting.label}</Label>
                <p className="text-sm text-muted-foreground">{setting.description}</p>
              </div>
              <Switch
                id={setting.key}
                checked={preferences[setting.key as keyof typeof preferences] as boolean}
                onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, [setting.key]: checked }))}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Widget Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Default Widgets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {availableWidgets.map((widget) => (
              <div key={widget.id} className="flex items-center space-x-2">
                <Checkbox
                  id={widget.id}
                  checked={preferences.widgets.includes(widget.id)}
                  onCheckedChange={(checked) => handleWidgetToggle(widget.id, checked as boolean)}
                />
                <Label htmlFor={widget.id} className="text-sm">{widget.label}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        Save Preferences
      </Button>
    </div>
  );
};