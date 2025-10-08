import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Database, Upload, Download, RotateCcw, HardDrive, Cloud, RefreshCw } from 'lucide-react';

export const DataManagement = () => {
  const [storageData] = useState({
    total: 1024, // MB
    used: 342,
    widgets: 45,
    settings: 12,
    cache: 285,
    voice: 0
  });

  const [syncStatus, setSyncStatus] = useState({
    lastSync: '2024-01-15T10:30:00Z',
    status: 'synced',
    conflicts: 0
  });

  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      const data = {
        profile: JSON.parse(localStorage.getItem('smartmirror-profile') || '{}'),
        widgets: JSON.parse(localStorage.getItem('smartmirror-widgets') || '[]'),
        settings: JSON.parse(localStorage.getItem('smartmirror-settings') || '{}'),
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smartmirror-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setIsExporting(false);
    }, 2000);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Validate data structure
        if (data.profile) localStorage.setItem('smartmirror-profile', JSON.stringify(data.profile));
        if (data.widgets) localStorage.setItem('smartmirror-widgets', JSON.stringify(data.widgets));
        if (data.settings) localStorage.setItem('smartmirror-settings', JSON.stringify(data.settings));
        
        setTimeout(() => {
          setIsImporting(false);
          window.location.reload(); // Reload to apply imported settings
        }, 1500);
      } catch (error) {
        console.error('Failed to import data:', error);
        setIsImporting(false);
      }
    };
    
    reader.readAsText(file);
  };

  const handleClearCache = () => {
    // Clear cache data
    localStorage.removeItem('smartmirror-cache');
    sessionStorage.clear();
    // Force reload to clear memory cache
    window.location.reload();
  };

  const handleResetSettings = () => {
    localStorage.removeItem('smartmirror-settings');
    localStorage.removeItem('smartmirror-widgets');
    window.location.reload();
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 MB';
    const mb = bytes;
    return `${mb} MB`;
  };

  const getStoragePercentage = (): number => {
    return (storageData.used / storageData.total) * 100;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'synced': return 'bg-green-100 text-green-800';
      case 'syncing': return 'bg-blue-100 text-blue-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Storage Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Storage Used</span>
              <span>{formatBytes(storageData.used)} / {formatBytes(storageData.total)}</span>
            </div>
            <Progress value={getStoragePercentage()} className="w-full" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{formatBytes(storageData.widgets)}</div>
              <div className="text-sm text-muted-foreground">Widgets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{formatBytes(storageData.settings)}</div>
              <div className="text-sm text-muted-foreground">Settings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{formatBytes(storageData.cache)}</div>
              <div className="text-sm text-muted-foreground">Cache</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{formatBytes(storageData.voice)}</div>
              <div className="text-sm text-muted-foreground">Voice Data</div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button variant="outline" onClick={handleClearCache}>
              Clear Cache ({formatBytes(storageData.cache)})
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Data Synchronization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-medium">Sync Status</span>
                <Badge className={getStatusColor(syncStatus.status)}>
                  {syncStatus.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Last synced: {new Date(syncStatus.lastSync).toLocaleString()}
              </p>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Now
            </Button>
          </div>

          {syncStatus.conflicts > 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="font-medium text-yellow-800">Sync Conflicts Detected</span>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                  {syncStatus.conflicts}
                </Badge>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Some settings have conflicts between devices. Click to resolve.
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                Resolve Conflicts
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Backup & Restore
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handleExportData}
              disabled={isExporting}
              className="h-auto flex-col items-start p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Download className="h-4 w-4" />
                <span className="font-medium">
                  {isExporting ? 'Exporting...' : 'Export Data'}
                </span>
              </div>
              <p className="text-sm opacity-90 text-left">
                Download a complete backup of your SmartMirror data
              </p>
              {isExporting && (
                <Progress value={75} className="w-full mt-2" />
              )}
            </Button>

            <div>
              <label htmlFor="import-file">
                <Button
                  variant="outline"
                  disabled={isImporting}
                  className="h-auto flex-col items-start p-4 w-full"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Upload className="h-4 w-4" />
                    <span className="font-medium">
                      {isImporting ? 'Importing...' : 'Import Data'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground text-left">
                    Restore your SmartMirror data from a backup file
                  </p>
                  {isImporting && (
                    <Progress value={45} className="w-full mt-2" />
                  )}
                </Button>
              </label>
              <input
                id="import-file"
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImportData}
                disabled={isImporting}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-medium">Quick Actions</h4>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                Export Settings Only
              </Button>
              <Button variant="outline" size="sm">
                Export Widget Config
              </Button>
              <Button variant="outline" size="sm">
                Backup Voice Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reset Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="h-auto flex-col items-start p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <RotateCcw className="h-4 w-4" />
                    <span className="font-medium">Reset Settings</span>
                  </div>
                  <p className="text-sm text-muted-foreground text-left">
                    Reset all settings to default values
                  </p>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Settings</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reset all your settings to default values. Your profile data 
                    and widget configurations will be preserved.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetSettings}>
                    Reset Settings
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="h-auto flex-col items-start p-4 border-red-200 hover:border-red-300"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <RotateCcw className="h-4 w-4 text-red-500" />
                    <span className="font-medium text-red-700">Factory Reset</span>
                  </div>
                  <p className="text-sm text-muted-foreground text-left">
                    Remove all data and return to initial state
                  </p>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Factory Reset</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your data, 
                    settings, and configurations, returning SmartMirror to its initial state.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => {
                      localStorage.clear();
                      sessionStorage.clear();
                      window.location.reload();
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Factory Reset
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};