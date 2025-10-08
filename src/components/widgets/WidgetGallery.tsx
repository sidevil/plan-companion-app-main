import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings } from 'lucide-react';
import { WIDGET_REGISTRY } from './registry';
import { useWidgets, Widget } from '@/contexts/WidgetContext';

interface WidgetGalleryProps {
  onAddWidget?: (widgetType: string) => void;
  onConfigureWidget?: (widget: Widget) => void;
}

export const WidgetGallery: React.FC<WidgetGalleryProps> = ({
  onAddWidget,
  onConfigureWidget
}) => {
  const { widgets } = useWidgets();

  const categories = [...new Set(WIDGET_REGISTRY.map(w => w.category))];

  const isWidgetAdded = (widgetTypeId: string) => {
    return widgets.some(w => w.type === widgetTypeId && w.enabled);
  };

  const getAddedWidget = (widgetTypeId: string) => {
    return widgets.find(w => w.type === widgetTypeId && w.enabled);
  };

  return (
    <div className="space-y-8">
      {categories.map(category => (
        <div key={category}>
          <h3 className="text-lg font-semibold text-foreground mb-4">{category}</h3>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {WIDGET_REGISTRY
              .filter(widget => widget.category === category)
              .map(widgetType => {
                const isAdded = isWidgetAdded(widgetType.id);
                const addedWidget = getAddedWidget(widgetType.id);

                return (
                  <Card key={widgetType.id} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{widgetType.name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {widgetType.description}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {widgetType.defaultSize}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        {isAdded ? (
                          <>
                            <Badge variant="secondary" className="text-xs">
                              Added
                            </Badge>
                            {widgetType.configurable && addedWidget && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onConfigureWidget?.(addedWidget)}
                                className="flex items-center gap-1"
                              >
                                <Settings className="h-3 w-3" />
                                Configure
                              </Button>
                            )}
                          </>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onAddWidget?.(widgetType.id)}
                            className="flex items-center gap-1"
                          >
                            <Plus className="h-3 w-3" />
                            Add Widget
                          </Button>
                        )}
                      </div>
                      
                      {widgetType.configurable && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            Configurable
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
};