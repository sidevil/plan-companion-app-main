import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Link2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface CalendarSyncProps {
  icalUrl?: string;
  onIcalUrlChange?: (url: string) => void;
}

export const CalendarSync = ({ icalUrl = '', onIcalUrlChange }: CalendarSyncProps) => {
  const [localIcalUrl, setLocalIcalUrl] = useState(icalUrl);
  const { toast } = useToast();

  const handleSaveIcalUrl = () => {
    if (onIcalUrlChange) {
      onIcalUrlChange(localIcalUrl);
      toast({
        title: "iCal URL Saved",
        description: "Your calendar will now sync with the provided iCal link",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Calendar Source</h2>
        <p className="text-muted-foreground">Connect your calendar using iCal format link</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-accent" />
            iCal Calendar Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ical-url">iCal URL</Label>
            <div className="flex gap-2">
              <Input
                id="ical-url"
                type="url"
                placeholder="https://example.com/calendar.ics"
                value={localIcalUrl}
                onChange={(e) => setLocalIcalUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSaveIcalUrl}>
                Save
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter your iCal calendar link to sync events automatically. The calendar will refresh every 15 minutes.
            </p>
          </div>
          {icalUrl && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>iCal calendar connected and syncing</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};