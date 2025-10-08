import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Settings, Trash2, GripVertical } from 'lucide-react';
import { useWidgets, Widget } from '@/contexts/WidgetContext';
import { WIDGET_REGISTRY } from './registry';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface ActiveWidgetsListProps {
  onConfigureWidget?: (widget: Widget) => void;
}

export const ActiveWidgetsList: React.FC<ActiveWidgetsListProps> = ({
  onConfigureWidget
}) => {
  const { widgets, updateWidget, removeWidget, reorderWidgets } = useWidgets();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update positions
    const updatedItems = items.map((item, index) => ({ ...item, position: index }));
    reorderWidgets(updatedItems);
  };

  const toggleWidget = (widgetId: string, enabled: boolean) => {
    updateWidget(widgetId, { enabled });
  };

  const handleRemoveWidget = (widgetId: string) => {
    if (confirm('Are you sure you want to remove this widget?')) {
      removeWidget(widgetId);
    }
  };

  const sortedWidgets = [...widgets].sort((a, b) => a.position - b.position);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Widgets</CardTitle>
        <p className="text-sm text-muted-foreground">
          Manage your dashboard widgets and their order
        </p>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="active-widgets">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-3"
              >
                {sortedWidgets.map((widget, index) => {
                  const widgetType = WIDGET_REGISTRY.find(w => w.id === widget.type);
                  if (!widgetType) return null;

                  return (
                    <Draggable key={widget.id} draggableId={widget.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`p-4 rounded-lg border ${
                            snapshot.isDragging ? 'shadow-lg' : 'bg-card'
                          } transition-shadow`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-grab hover:text-accent"
                              >
                                <GripVertical className="h-4 w-4" />
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium text-sm">{widget.title}</h4>
                                  <Badge variant="outline" className="text-xs">
                                    {widget.size}
                                  </Badge>
                                  {widgetType.configurable && (
                                    <Badge variant="secondary" className="text-xs">
                                      Configurable
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {widgetType.description}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Switch
                                checked={widget.enabled}
                                onCheckedChange={(enabled) => toggleWidget(widget.id, enabled)}
                              />
                              
                              {widgetType.configurable && widget.enabled && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onConfigureWidget?.(widget)}
                                >
                                  <Settings className="h-3 w-3" />
                                </Button>
                              )}
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveWidget(widget.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {sortedWidgets.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No widgets added yet. Add some widgets to get started!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};