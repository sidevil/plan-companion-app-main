import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Shield, Eye, Trash2, Download, Lock } from 'lucide-react';

export const PrivacyControls = () => {
  const [privacySettings, setPrivacySettings] = useState({
    dataCollection: true,
    analytics: false,
    locationTracking: true,
    voiceRecording: false,
    personalizedAds: false,
    shareWithPartners: false,
    crashReporting: true,
    usageStatistics: true
  });

  const [permissions, setPermissions] = useState({
    camera: false,
    microphone: true,
    location: true,
    notifications: true,
    storage: true
  });

  const handlePrivacyToggle = (setting: string, value: boolean) => {
    setPrivacySettings(prev => ({ ...prev, [setting]: value }));
  };

  const handlePermissionToggle = (permission: string, value: boolean) => {
    setPermissions(prev => ({ ...prev, [permission]: value }));
  };

  const exportData = () => {
    // Simulate data export
    const data = {
      profile: 'User profile data...',
      settings: 'User settings...',
      widgets: 'Widget configurations...',
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'smartmirror-data-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAllData = () => {
    // Clear all user data
    localStorage.clear();
    sessionStorage.clear();
    console.log('All user data cleared');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Data Privacy Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(privacySettings).map(([setting, enabled]) => (
            <div key={setting} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="capitalize">
                  {setting.replace(/([A-Z])/g, ' $1').trim()}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {setting === 'dataCollection' && 'Allow SmartMirror to collect usage data for improvements'}
                  {setting === 'analytics' && 'Share anonymous analytics with developers'}
                  {setting === 'locationTracking' && 'Use location for weather, traffic, and local services'}
                  {setting === 'voiceRecording' && 'Store voice commands for improving recognition'}
                  {setting === 'personalizedAds' && 'Show personalized advertisements based on usage'}
                  {setting === 'shareWithPartners' && 'Share data with trusted third-party partners'}
                  {setting === 'crashReporting' && 'Send crash reports to help fix issues'}
                  {setting === 'usageStatistics' && 'Collect statistics about feature usage'}
                </p>
              </div>
              <Switch
                checked={enabled}
                onCheckedChange={(checked) => handlePrivacyToggle(setting, checked)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Device Permissions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(permissions).map(([permission, granted]) => (
            <div key={permission} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="capitalize">{permission}</Label>
                <p className="text-sm text-muted-foreground">
                  {permission === 'camera' && 'Access camera for video features and gesture recognition'}
                  {permission === 'microphone' && 'Access microphone for voice commands and recognition'}
                  {permission === 'location' && 'Access location for weather, traffic, and local information'}
                  {permission === 'notifications' && 'Show browser notifications and alerts'}
                  {permission === 'storage' && 'Store data locally for offline functionality'}
                </p>
              </div>
              <Switch
                checked={granted}
                onCheckedChange={(checked) => handlePermissionToggle(permission, checked)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Data Transparency
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">What data do we collect?</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Widget preferences and layout configurations</li>
                <li>• Device settings and display preferences</li>
                <li>• Usage patterns and feature interactions</li>
                <li>• Voice commands (if enabled)</li>
                <li>• Location data (for weather and traffic)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">How is your data used?</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Personalizing your SmartMirror experience</li>
                <li>• Providing location-based services</li>
                <li>• Improving voice recognition accuracy</li>
                <li>• Enhancing app performance and features</li>
                <li>• Troubleshooting and customer support</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Data retention</h4>
              <p className="text-sm text-muted-foreground">
                User data is retained for as long as your account is active. 
                Analytics data is anonymized after 90 days. Voice recordings 
                are deleted after 30 days unless saved for training purposes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-auto flex-col items-start p-4"
              onClick={exportData}
            >
              <div className="flex items-center gap-2 mb-2">
                <Download className="h-4 w-4" />
                <span className="font-medium">Export My Data</span>
              </div>
              <p className="text-sm text-muted-foreground text-left">
                Download a copy of all your data in JSON format
              </p>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="h-auto flex-col items-start p-4 border-red-200 hover:border-red-300"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Trash2 className="h-4 w-4 text-red-500" />
                    <span className="font-medium text-red-700">Delete All Data</span>
                  </div>
                  <p className="text-sm text-muted-foreground text-left">
                    Permanently delete all stored data and settings
                  </p>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete All Data</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your 
                    data, including profile information, widget configurations, and settings.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={clearAllData}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete Everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">View Privacy Policy</Button>
        <Button>Save Privacy Settings</Button>
      </div>
    </div>
  );
};