import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreVertical, Settings, X, Maximize2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Widget } from '@/contexts/WidgetContext';

interface BaseWidgetProps {
  widget: Widget;
  children: React.ReactNode;
  onConfigure?: () => void;
  onRemove?: () => void;
  onResize?: (size: 'small' | 'medium' | 'large') => void;
  isDragging?: boolean;
  className?: string;
  showControls?: boolean;
}

export const BaseWidget: React.FC<BaseWidgetProps> = ({
  widget,
  children,
  onConfigure,
  onRemove,
  onResize,
  isDragging = false,
  className,
  showControls = false
}) => {
  const [showResizeUI, setShowResizeUI] = useState(false);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowResizeUI(true);
  };

  const handleResizeSelect = (size: 'small' | 'medium' | 'large') => {
    onResize?.(size);
    setShowResizeUI(false);
  };

  return (
    <Card
        className={cn(
          'h-full transition-all duration-300 group relative',
          'bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70',
          isDragging && 'opacity-50 scale-105 shadow-2xl z-50',
          !widget.enabled && 'opacity-50'
        )}
        onDoubleClick={handleDoubleClick}
      >
        {showControls && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                {onConfigure && (
                  <DropdownMenuItem onClick={onConfigure} className="cursor-pointer">
                    <Settings className="h-3 w-3 mr-2" />
                    Configure
                  </DropdownMenuItem>
                )}
                {onRemove && (
                  <DropdownMenuItem onClick={onRemove} className="cursor-pointer text-destructive">
                    <X className="h-3 w-3 mr-2" />
                    Remove
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        
        {children}

        {/* Resize UI Overlay */}
        {showResizeUI && (
          <div 
            className="absolute inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200"
            onClick={() => setShowResizeUI(false)}
          >
            <div className="text-center space-y-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Maximize2 className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Resize Widget</h3>
              </div>
              <div className="flex gap-3 justify-center">
                <Button
                  variant={widget.size === 'small' ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => handleResizeSelect('small')}
                  className="flex flex-col h-auto py-4 px-6"
                >
                  <div className="w-12 h-12 border-2 border-current rounded mb-2" />
                  <span>Small</span>
                </Button>
                <Button
                  variant={widget.size === 'medium' ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => handleResizeSelect('medium')}
                  className="flex flex-col h-auto py-4 px-6"
                >
                  <div className="w-16 h-16 border-2 border-current rounded mb-2" />
                  <span>Medium</span>
                </Button>
                <Button
                  variant={widget.size === 'large' ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => handleResizeSelect('large')}
                  className="flex flex-col h-auto py-4 px-6"
                >
                  <div className="w-20 h-20 border-2 border-current rounded mb-2" />
                  <span>Large</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Click outside or double-click again to cancel
              </p>
            </div>
          </div>
        )}
      </Card>
  );
};