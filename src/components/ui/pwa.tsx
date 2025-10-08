import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Monitor, Battery, Signal } from 'lucide-react';

interface InstallPromptProps {
  onInstall: () => void;
  onDismiss: () => void;
}

export const InstallPrompt: React.FC<InstallPromptProps> = ({ onInstall, onDismiss }) => {
  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 animate-slide-in-right">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Monitor className="h-5 w-5" />
          Install SmartMirror
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Install SmartMirror as an app for the best experience with offline support and notifications.
        </p>
        <div className="flex space-x-2">
          <Button onClick={onInstall} size="sm">
            Install
          </Button>
          <Button variant="outline" onClick={onDismiss} size="sm">
            Not now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface OfflineIndicatorProps {
  isOnline: boolean;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ isOnline }) => {
  if (isOnline) return null;

  return (
    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
      <Badge variant="destructive" className="flex items-center gap-2 px-3 py-1">
        <WifiOff className="h-3 w-3" />
        Offline Mode
      </Badge>
    </div>
  );
};

interface SyncStatusProps {
  status: 'synced' | 'syncing' | 'error' | 'offline';
  lastSync?: Date;
}

export const SyncStatus: React.FC<SyncStatusProps> = ({ status, lastSync }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'synced':
        return <Wifi className="h-3 w-3 text-green-500" />;
      case 'syncing':
        return <Signal className="h-3 w-3 text-blue-500 animate-pulse" />;
      case 'error':
        return <WifiOff className="h-3 w-3 text-red-500" />;
      case 'offline':
        return <WifiOff className="h-3 w-3 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'synced':
        return lastSync ? `Synced ${lastSync.toLocaleTimeString()}` : 'Synced';
      case 'syncing':
        return 'Syncing...';
      case 'error':
        return 'Sync failed';
      case 'offline':
        return 'Offline';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'synced':
        return 'text-green-600';
      case 'syncing':
        return 'text-blue-600';
      case 'error':
        return 'text-red-600';
      case 'offline':
        return 'text-gray-600';
    }
  };

  return (
    <div className="flex items-center gap-1">
      {getStatusIcon()}
      <span className={`text-xs ${getStatusColor()}`}>
        {getStatusText()}
      </span>
    </div>
  );
};

interface UpdateBannerProps {
  onUpdate: () => void;
  onDismiss: () => void;
}

export const UpdateBanner: React.FC<UpdateBannerProps> = ({ onUpdate, onDismiss }) => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-primary text-primary-foreground p-3 z-50 animate-fade-in">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-white/20 text-white">
            Update Available
          </Badge>
          <span className="text-sm">A new version of SmartMirror is available.</span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={onUpdate}
            className="bg-white/20 hover:bg-white/30 text-white"
          >
            Update Now
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDismiss}
            className="text-white hover:bg-white/20"
          >
            Later
          </Button>
        </div>
      </div>
    </div>
  );
};

interface ConnectionStatusProps {
  isOnline: boolean;
  connectionQuality?: 'poor' | 'good' | 'excellent';
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  isOnline, 
  connectionQuality = 'good' 
}) => {
  const getQualityColor = () => {
    if (!isOnline) return 'text-red-500';
    switch (connectionQuality) {
      case 'poor':
        return 'text-orange-500';
      case 'good':
        return 'text-yellow-500';
      case 'excellent':
        return 'text-green-500';
    }
  };

  const getQualityBars = () => {
    if (!isOnline) return 0;
    switch (connectionQuality) {
      case 'poor':
        return 1;
      case 'good':
        return 2;
      case 'excellent':
        return 3;
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-end gap-0.5">
        {[1, 2, 3].map((bar) => (
          <div
            key={bar}
            className={`w-1 bg-current transition-opacity ${
              bar <= getQualityBars() ? 'opacity-100' : 'opacity-30'
            } ${getQualityColor()}`}
            style={{ height: `${bar * 3 + 2}px` }}
          />
        ))}
      </div>
      <span className={`text-xs ${getQualityColor()}`}>
        {isOnline ? connectionQuality : 'offline'}
      </span>
    </div>
  );
};

interface BatteryStatusProps {
  level: number;
  isCharging: boolean;
}

export const BatteryStatus: React.FC<BatteryStatusProps> = ({ level, isCharging }) => {
  const getBatteryColor = () => {
    if (isCharging) return 'text-green-500';
    if (level <= 20) return 'text-red-500';
    if (level <= 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="flex items-center gap-1">
      <Battery className={`h-4 w-4 ${getBatteryColor()}`} />
      <span className={`text-xs ${getBatteryColor()}`}>
        {level}%{isCharging && ' ⚡'}
      </span>
    </div>
  );
};