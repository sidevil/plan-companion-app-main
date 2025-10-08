import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RotateCcw, Download, Upload } from 'lucide-react';
import { WidgetGallery } from '@/components/widgets/WidgetGallery';
import { ActiveWidgetsList } from '@/components/widgets/ActiveWidgetsList';
import { WidgetSettings } from '@/components/widgets/WidgetSettings';
import { useWidgets, Widget } from '@/contexts/WidgetContext';
import { WIDGET_REGISTRY } from '@/components/widgets/registry';
import { useToast } from '@/hooks/use-toast';

const Widgets = () => {
  const { addWidget, resetToDefault, widgets } = useWidgets();
  const { toast } = useToast();
  const [configureWidget, setConfigureWidget] = useState<Widget | null>(null);

  const handleAddWidget = (widgetTypeId: string) => {
    const widgetType = WIDGET_REGISTRY.find(w => w.id === widgetTypeId);
    if (!widgetType) return;

    // Check if widget already exists
    const existingWidget = widgets.find(w => w.type === widgetTypeId);
    if (existingWidget) {
      toast({
        title: "Widget Already Added",
        description: "This widget is already in your dashboard.",
        variant: "destructive"
      });
      return;
    }

    const newWidget: Widget = {
      id: `${widgetTypeId}-${Date.now()}`,
      type: widgetTypeId,
      title: widgetType.name,
      size: widgetType.defaultSize,
      position: widgets.length,
      enabled: true,
      page: 1,
      config: {}
    };

    addWidget(newWidget);
    toast({
      title: "Widget Added",
      description: `${widgetType.name} has been added to your dashboard.`
    });
  };

  const handleExportConfig = () => {
    const config = JSON.stringify(widgets, null, 2);
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'smartmirror-widgets.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Configuration Exported",
      description: "Your widget configuration has been downloaded."
    });
  };

  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedWidgets = JSON.parse(e.target?.result as string);
        // TODO: Implement import functionality
        toast({
          title: "Import Successful",
          description: "Widget configuration has been imported."
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Invalid configuration file.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const handleResetToDefault = () => {
    if (confirm('Are you sure you want to reset to default widgets? This will remove all your customizations.')) {
      resetToDefault();
      toast({
        title: "Reset Complete",
        description: "Widgets have been reset to default configuration."
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Widget Configuration</h1>
          <p className="text-muted-foreground">Customize your dashboard widgets</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportConfig}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button variant="outline" asChild>
            <label className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={handleImportConfig}
                className="hidden"
              />
            </label>
          </Button>
          
          <Button variant="outline" onClick={handleResetToDefault}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <Tabs defaultValue="gallery" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gallery">Widget Gallery</TabsTrigger>
          <TabsTrigger value="active">Active Widgets</TabsTrigger>
        </TabsList>
        
        <TabsContent value="gallery">
          <WidgetGallery
            onAddWidget={handleAddWidget}
            onConfigureWidget={setConfigureWidget}
          />
        </TabsContent>
        
        <TabsContent value="active">
          <ActiveWidgetsList
            onConfigureWidget={setConfigureWidget}
          />
        </TabsContent>
      </Tabs>

      <WidgetSettings
        widget={configureWidget}
        open={!!configureWidget}
        onClose={() => setConfigureWidget(null)}
      />
    </div>
  );
};

export default Widgets;