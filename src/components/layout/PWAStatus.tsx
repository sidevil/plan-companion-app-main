import React, { useState, useEffect } from 'react';
import { InstallPrompt, OfflineIndicator, UpdateBanner, SyncStatus, ConnectionStatus, BatteryStatus } from '@/components/ui/pwa';

interface PWAStatusProps {
  className?: string;
}

export const PWAStatus: React.FC<PWAStatusProps> = ({ className = '' }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error' | 'offline'>('synced');
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [batteryInfo, setBatteryInfo] = useState<{ level: number; charging: boolean }>({ level: 100, charging: false });
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Network status listeners
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus('synced');
      setLastSync(new Date());
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // PWA install prompt listener
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Service worker update listener
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setShowUpdateBanner(true);
      });
    }

    // Battery API (if available)
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryInfo({
          level: Math.round(battery.level * 100),
          charging: battery.charging
        });

        battery.addEventListener('levelchange', () => {
          setBatteryInfo(prev => ({
            ...prev,
            level: Math.round(battery.level * 100)
          }));
        });

        battery.addEventListener('chargingchange', () => {
          setBatteryInfo(prev => ({
            ...prev,
            charging: battery.charging
          }));
        });
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleUpdate = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration?.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    }
    setShowUpdateBanner(false);
    window.location.reload();
  };

  return (
    <div className={className}>
      {/* Offline Indicator */}
      <OfflineIndicator isOnline={isOnline} />

      {/* Install Prompt */}
      {showInstallPrompt && (
        <InstallPrompt
          onInstall={handleInstall}
          onDismiss={() => setShowInstallPrompt(false)}
        />
      )}

      {/* Update Banner */}
      {showUpdateBanner && (
        <UpdateBanner
          onUpdate={handleUpdate}
          onDismiss={() => setShowUpdateBanner(false)}
        />
      )}

      {/* Status indicators in header */}
      <div className="flex items-center gap-4 text-sm">
        <SyncStatus status={syncStatus} lastSync={lastSync} />
        <ConnectionStatus isOnline={isOnline} />
        {'getBattery' in navigator && (
          <BatteryStatus level={batteryInfo.level} isCharging={batteryInfo.charging} />
        )}
      </div>
    </div>
  );
};