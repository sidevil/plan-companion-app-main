import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { BaseWidget } from './BaseWidget';
import { useWidgets, Widget } from '@/contexts/WidgetContext';
import { WIDGET_REGISTRY } from './registry';
import { cn } from '@/lib/utils';

interface DraggableWidgetGridProps {
  showControls?: boolean;
  onConfigureWidget?: (widget: Widget) => void;
  currentPage?: number;
}

export const DraggableWidgetGrid: React.FC<DraggableWidgetGridProps> = ({
  showControls = false,
  onConfigureWidget,
  currentPage = 1
}) => {
  const { widgets, reorderWidgets, removeWidget, updateWidget } = useWidgets();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    // Filter only widgets on current page for reordering
    const pageWidgets = widgets.filter(w => w.enabled && (w.page || 1) === currentPage);
    const items = Array.from(pageWidgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update positions for widgets on current page
    const updatedPageWidgets = items.map((item, index) => ({ ...item, position: index }));
    
    // Merge with widgets from other pages
    const otherPageWidgets = widgets.filter(w => (w.page || 1) !== currentPage);
    reorderWidgets([...otherPageWidgets, ...updatedPageWidgets]);
  };

  const handleResize = (widgetId: string, size: 'small' | 'medium' | 'large') => {
    updateWidget(widgetId, { size });
  };

  const enabledWidgets = widgets
    .filter(w => w.enabled && (w.page || 1) === currentPage)
    .sort((a, b) => a.position - b.position);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="widget-grid" direction="horizontal">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr',
              snapshot.isDraggingOver && 'bg-accent/5 rounded-lg transition-colors'
            )}
          >
            {enabledWidgets.map((widget, index) => {
              const widgetType = WIDGET_REGISTRY.find(w => w.id === widget.type);
              if (!widgetType) return null;

              const sizeClasses = {
                small: 'col-span-1 row-span-1',
                medium: 'col-span-1 md:col-span-1 row-span-1',
                large: 'col-span-1 md:col-span-2 row-span-1'
              };

              return (
                <Draggable key={widget.id} draggableId={widget.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={cn(sizeClasses[widget.size])}
                      style={{
                        ...provided.draggableProps.style,
                        transform: snapshot.isDragging 
                          ? provided.draggableProps.style?.transform 
                          : 'none'
                      }}
                    >
                      <BaseWidget
                        widget={widget}
                        showControls={showControls}
                        isDragging={snapshot.isDragging}
                        onConfigure={() => onConfigureWidget?.(widget)}
                        onRemove={() => removeWidget(widget.id)}
                        onResize={(size) => handleResize(widget.id, size)}
                        className="cursor-grab active:cursor-grabbing h-full"
                      >
                        <widgetType.component config={widget.config} />
                      </BaseWidget>
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
  );
};