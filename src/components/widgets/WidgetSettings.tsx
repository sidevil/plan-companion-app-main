import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useWidgets, Widget } from '@/contexts/WidgetContext';
import { WIDGET_REGISTRY } from './registry';

interface WidgetSettingsProps {
  widget: Widget | null;
  open: boolean;
  onClose: () => void;
}

export const WidgetSettings: React.FC<WidgetSettingsProps> = ({
  widget,
  open,
  onClose
}) => {
  const { updateWidget } = useWidgets();
  const [localConfig, setLocalConfig] = useState<Record<string, any>>({});

  React.useEffect(() => {
    if (widget) {
      setLocalConfig(widget.config || {});
    }
  }, [widget]);

  if (!widget) return null;

  const widgetType = WIDGET_REGISTRY.find(w => w.id === widget.type);
  if (!widgetType) return null;

  const handleSave = () => {
    updateWidget(widget.id, { config: localConfig });
    // Force a small delay to ensure state updates properly
    setTimeout(() => {
      onClose();
    }, 100);
  };

  const updateConfig = (key: string, value: any) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }));
  };

  const renderConfigOptions = () => {
    switch (widget.type) {
      case 'weather':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="location">City</Label>
              <Select
                value={localConfig.location || 'New York'}
                onValueChange={(value) => updateConfig('location', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <SelectItem value="New York">New York, USA</SelectItem>
                  <SelectItem value="Los Angeles">Los Angeles, USA</SelectItem>
                  <SelectItem value="Chicago">Chicago, USA</SelectItem>
                  <SelectItem value="Miami">Miami, USA</SelectItem>
                  <SelectItem value="San Francisco">San Francisco, USA</SelectItem>
                  <SelectItem value="London">London, UK</SelectItem>
                  <SelectItem value="Paris">Paris, France</SelectItem>
                  <SelectItem value="Berlin">Berlin, Germany</SelectItem>
                  <SelectItem value="Madrid">Madrid, Spain</SelectItem>
                  <SelectItem value="Rome">Rome, Italy</SelectItem>
                  <SelectItem value="Amsterdam">Amsterdam, Netherlands</SelectItem>
                  <SelectItem value="Tokyo">Tokyo, Japan</SelectItem>
                  <SelectItem value="Beijing">Beijing, China</SelectItem>
                  <SelectItem value="Shanghai">Shanghai, China</SelectItem>
                  <SelectItem value="Hong Kong">Hong Kong</SelectItem>
                  <SelectItem value="Seoul">Seoul, South Korea</SelectItem>
                  <SelectItem value="Singapore">Singapore</SelectItem>
                  <SelectItem value="Mumbai">Mumbai, India</SelectItem>
                  <SelectItem value="Delhi">Delhi, India</SelectItem>
                  <SelectItem value="Bangalore">Bangalore, India</SelectItem>
                  <SelectItem value="Pune">Pune, India</SelectItem>
                  <SelectItem value="Sydney">Sydney, Australia</SelectItem>
                  <SelectItem value="Melbourne">Melbourne, Australia</SelectItem>
                  <SelectItem value="Dubai">Dubai, UAE</SelectItem>
                  <SelectItem value="Istanbul">Istanbul, Turkey</SelectItem>
                  <SelectItem value="Moscow">Moscow, Russia</SelectItem>
                  <SelectItem value="Toronto">Toronto, Canada</SelectItem>
                  <SelectItem value="Vancouver">Vancouver, Canada</SelectItem>
                  <SelectItem value="Mexico City">Mexico City, Mexico</SelectItem>
                  <SelectItem value="São Paulo">São Paulo, Brazil</SelectItem>
                  <SelectItem value="Rio de Janeiro">Rio de Janeiro, Brazil</SelectItem>
                  <SelectItem value="Buenos Aires">Buenos Aires, Argentina</SelectItem>
                  <SelectItem value="Cairo">Cairo, Egypt</SelectItem>
                  <SelectItem value="Cape Town">Cape Town, South Africa</SelectItem>
                  <SelectItem value="Lagos">Lagos, Nigeria</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="units">Temperature Units</Label>
              <Select
                value={localConfig.units || 'fahrenheit'}
                onValueChange={(value) => updateConfig('units', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fahrenheit">Fahrenheit</SelectItem>
                  <SelectItem value="celsius">Celsius</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-forecast"
                checked={localConfig.showForecast || false}
                onCheckedChange={(checked) => updateConfig('showForecast', checked)}
              />
              <Label htmlFor="show-forecast">Show 5-day forecast</Label>
            </div>
          </div>
        );

      case 'news':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="rss-url">RSS Feed URL (optional)</Label>
              <Input
                id="rss-url"
                placeholder="https://example.com/feed.xml"
                value={localConfig.rssUrl || ''}
                onChange={(e) => updateConfig('rssUrl', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter an RSS feed URL to show custom news. Leave empty for default news.
              </p>
            </div>
            {!localConfig.rssUrl && (
              <>
                <div>
                  <Label htmlFor="sources">News Sources</Label>
                  <Input
                    id="sources"
                    placeholder="Enter news sources (comma-separated)"
                    value={localConfig.sources || ''}
                    onChange={(e) => updateConfig('sources', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={localConfig.category || 'general'}
                    onValueChange={(value) => updateConfig('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            <div>
              <Label htmlFor="refresh-interval">Refresh Interval (minutes)</Label>
              <Select
                value={localConfig.refreshInterval || '15'}
                onValueChange={(value) => updateConfig('refreshInterval', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'calendar':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="calendar-source">Calendar Source</Label>
              <p className="text-sm text-muted-foreground mb-2">iCal Format Only</p>
            </div>
            <div>
              <Label htmlFor="ical-url">iCal URL</Label>
              <Input
                id="ical-url"
                type="url"
                placeholder="https://example.com/calendar.ics"
                value={localConfig.icalUrl || ''}
                onChange={(e) => updateConfig('icalUrl', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter your iCal calendar link to fetch and display events
              </p>
            </div>
            <div>
              <Label htmlFor="days-ahead">Days to Show</Label>
              <Select
                value={localConfig.daysAhead || '7'}
                onValueChange={(value) => updateConfig('daysAhead', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Today only</SelectItem>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="7">1 week</SelectItem>
                  <SelectItem value="14">2 weeks</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-all-day"
                checked={localConfig.showAllDay || true}
                onCheckedChange={(checked) => updateConfig('showAllDay', checked)}
              />
              <Label htmlFor="show-all-day">Show all-day events</Label>
            </div>
          </div>
        );

      case 'stocks':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="symbols">Stock Symbols</Label>
              <Input
                id="symbols"
                placeholder="AAPL, GOOGL, TSLA"
                value={localConfig.symbols || ''}
                onChange={(e) => updateConfig('symbols', e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-chart"
                checked={localConfig.showChart || false}
                onCheckedChange={(checked) => updateConfig('showChart', checked)}
              />
              <Label htmlFor="show-chart">Show mini charts</Label>
            </div>
          </div>
        );

      case 'traffic':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="home-address">Home Address</Label>
              <Input
                id="home-address"
                placeholder="Enter your home address"
                value={localConfig.homeAddress || ''}
                onChange={(e) => updateConfig('homeAddress', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="work-address">Work Address</Label>
              <Input
                id="work-address"
                placeholder="Enter your work address"
                value={localConfig.workAddress || ''}
                onChange={(e) => updateConfig('workAddress', e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="avoid-tolls"
                checked={localConfig.avoidTolls || false}
                onCheckedChange={(checked) => updateConfig('avoidTolls', checked)}
              />
              <Label htmlFor="avoid-tolls">Avoid tolls</Label>
            </div>
          </div>
        );

      case 'social':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="platforms">Social Platforms</Label>
              <div className="space-y-2">
                {['twitter', 'instagram', 'facebook'].map(platform => (
                  <div key={platform} className="flex items-center space-x-2">
                    <Switch
                      id={platform}
                      checked={localConfig.platforms?.[platform] || false}
                      onCheckedChange={(checked) => updateConfig('platforms', {
                        ...localConfig.platforms,
                        [platform]: checked
                      })}
                    />
                    <Label htmlFor={platform} className="capitalize">{platform}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="post-limit">Posts to Show</Label>
              <Select
                value={localConfig.postLimit || '5'}
                onValueChange={(value) => updateConfig('postLimit', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 posts</SelectItem>
                  <SelectItem value="5">5 posts</SelectItem>
                  <SelectItem value="10">10 posts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'photos':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="slideshow-speed">Slideshow Speed</Label>
              <Select
                value={localConfig.slideshowSpeed || '4000'}
                onValueChange={(value) => updateConfig('slideshowSpeed', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2000">2 seconds</SelectItem>
                  <SelectItem value="4000">4 seconds</SelectItem>
                  <SelectItem value="6000">6 seconds</SelectItem>
                  <SelectItem value="10000">10 seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-play"
                checked={localConfig.autoPlay !== false}
                onCheckedChange={(checked) => updateConfig('autoPlay', checked)}
              />
              <Label htmlFor="auto-play">Auto-play slideshow</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-captions"
                checked={localConfig.showCaptions || false}
                onCheckedChange={(checked) => updateConfig('showCaptions', checked)}
              />
              <Label htmlFor="show-captions">Show photo captions</Label>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-4 text-muted-foreground">
            <p>No configuration options available for this widget.</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Configure {widget.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="widget-title">Widget Title</Label>
            <Input
              id="widget-title"
              value={widget.title}
              onChange={(e) => updateWidget(widget.id, { title: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="widget-size">Widget Size</Label>
            <Select
              value={widget.size}
              onValueChange={(value: 'small' | 'medium' | 'large') => 
                updateWidget(widget.id, { size: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="widget-page">Dashboard Page</Label>
            <Select
              value={String(widget.page || 1)}
              onValueChange={(value) => 
                updateWidget(widget.id, { page: parseInt(value) })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Page 1</SelectItem>
                <SelectItem value="2">Page 2</SelectItem>
                <SelectItem value="3">Page 3</SelectItem>
                <SelectItem value="4">Page 4</SelectItem>
                <SelectItem value="5">Page 5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {widgetType.configurable && renderConfigOptions()}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};