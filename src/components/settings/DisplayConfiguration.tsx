import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Monitor, Sun, Moon, Eye, Palette } from 'lucide-react';
import { toast } from 'sonner';

const STORAGE_KEY = 'smartmirror-display-settings';

const loadSettings = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load display settings', e);
    }
  }
  return {
    brightness: [80],
    contrast: [75],
    mirrorMode: false,
    autoAdjustBrightness: true,
    highContrastMode: false,
    screenTimeout: '30',
    orientation: 'landscape',
    resolution: 'auto',
    fontScale: [100],
    animationSpeed: [75],
    reduceMotion: false,
    focusIndicators: true,
    screenReaderSupport: true
  };
};

export const DisplayConfiguration = () => {
  const [displaySettings, setDisplaySettings] = useState(loadSettings);

  const handleSettingChange = (key: string, value: any) => {
    setDisplaySettings(prev => ({ ...prev, [key]: value }));
  };

  const applySettings = (settings: typeof displaySettings) => {
    const root = document.documentElement;
    
    // Apply brightness
    root.style.setProperty('--display-brightness', `${settings.brightness[0]}%`);
    root.style.filter = `brightness(${settings.brightness[0] / 100}) contrast(${settings.contrast[0] / 100})`;
    
    // Apply font scale
    root.style.fontSize = `${settings.fontScale[0]}%`;
    
    // Apply animation speed
    const speed = settings.animationSpeed[0];
    if (speed === 0) {
      root.style.setProperty('--animation-duration', '0s');
    } else {
      const duration = 300 / (speed / 75); // Base 300ms at 75%
      root.style.setProperty('--animation-duration', `${duration}ms`);
    }
    
    // Apply reduce motion
    if (settings.reduceMotion) {
      root.style.setProperty('--animation-duration', '0.01s');
    }
    
    // Apply mirror mode
    if (settings.mirrorMode) {
      document.body.classList.add('mirror-mode');
    } else {
      document.body.classList.remove('mirror-mode');
    }
    
    // Apply high contrast mode
    if (settings.highContrastMode) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(displaySettings));
    applySettings(displaySettings);
    toast.success('Display settings saved successfully');
  };

  const handleReset = () => {
    const defaultSettings = loadSettings();
    setDisplaySettings(defaultSettings);
    localStorage.removeItem(STORAGE_KEY);
    applySettings(defaultSettings);
    toast.success('Display settings reset to defaults');
  };

  // Apply settings on mount and when they change
  useEffect(() => {
    applySettings(displaySettings);
  }, [displaySettings.brightness, displaySettings.contrast, displaySettings.fontScale, 
      displaySettings.animationSpeed, displaySettings.mirrorMode, displaySettings.highContrastMode,
      displaySettings.reduceMotion]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Screen Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Brightness</Label>
                <span className="text-sm text-muted-foreground">{displaySettings.brightness[0]}%</span>
              </div>
              <Slider
                value={displaySettings.brightness}
                onValueChange={(value) => handleSettingChange('brightness', value)}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Contrast</Label>
                <span className="text-sm text-muted-foreground">{displaySettings.contrast[0]}%</span>
              </div>
              <Slider
                value={displaySettings.contrast}
                onValueChange={(value) => handleSettingChange('contrast', value)}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-adjust Brightness</Label>
                <p className="text-sm text-muted-foreground">Adjust brightness based on ambient light</p>
              </div>
              <Switch
                checked={displaySettings.autoAdjustBrightness}
                onCheckedChange={(checked) => handleSettingChange('autoAdjustBrightness', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mirror Mode</Label>
                <p className="text-sm text-muted-foreground">Transparent overlay for mirror displays</p>
              </div>
              <Switch
                checked={displaySettings.mirrorMode}
                onCheckedChange={(checked) => handleSettingChange('mirrorMode', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>High Contrast Mode</Label>
                <p className="text-sm text-muted-foreground">Enhanced visibility for low-light conditions</p>
              </div>
              <Switch
                checked={displaySettings.highContrastMode}
                onCheckedChange={(checked) => handleSettingChange('highContrastMode', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Screen Timeout</Label>
              <Select 
                value={displaySettings.screenTimeout} 
                onValueChange={(value) => handleSettingChange('screenTimeout', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timeout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="15">15 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="60">1 minute</SelectItem>
                  <SelectItem value="300">5 minutes</SelectItem>
                  <SelectItem value="600">10 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Orientation</Label>
              <Select 
                value={displaySettings.orientation} 
                onValueChange={(value) => handleSettingChange('orientation', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select orientation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="landscape">Landscape</SelectItem>
                  <SelectItem value="portrait">Portrait</SelectItem>
                  <SelectItem value="auto">Auto-rotate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Font Scale</Label>
                <span className="text-sm text-muted-foreground">{displaySettings.fontScale[0]}%</span>
              </div>
              <Slider
                value={displaySettings.fontScale}
                onValueChange={(value) => handleSettingChange('fontScale', value)}
                min={50}
                max={200}
                step={10}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Animation Speed</Label>
                <span className="text-sm text-muted-foreground">
                  {displaySettings.animationSpeed[0] === 0 ? 'Off' : 
                   displaySettings.animationSpeed[0] < 50 ? 'Slow' :
                   displaySettings.animationSpeed[0] > 100 ? 'Fast' : 'Normal'}
                </span>
              </div>
              <Slider
                value={displaySettings.animationSpeed}
                onValueChange={(value) => handleSettingChange('animationSpeed', value)}
                min={0}
                max={150}
                step={25}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Accessibility
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Reduce Motion</Label>
                <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
              </div>
              <Switch 
                checked={displaySettings.reduceMotion}
                onCheckedChange={(checked) => handleSettingChange('reduceMotion', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Focus Indicators</Label>
                <p className="text-sm text-muted-foreground">Enhanced focus outlines for navigation</p>
              </div>
              <Switch 
                checked={displaySettings.focusIndicators}
                onCheckedChange={(checked) => handleSettingChange('focusIndicators', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Screen Reader Support</Label>
                <p className="text-sm text-muted-foreground">Optimize for assistive technologies</p>
              </div>
              <Switch 
                checked={displaySettings.screenReaderSupport}
                onCheckedChange={(checked) => handleSettingChange('screenReaderSupport', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={handleReset}>Reset to Defaults</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};