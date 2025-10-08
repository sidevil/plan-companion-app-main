import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Play, Plus, Settings, Moon, Sun, Home, Bed } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const mockScenes = [
  {
    id: '1',
    name: 'Good Morning',
    icon: Sun,
    description: 'Turn on lights, adjust thermostat to 72°F',
    devices: ['Living Room Lights', 'Main Thermostat', 'Kitchen Lights'],
    isActive: false
  },
  {
    id: '2',
    name: 'Good Night',
    icon: Moon,
    description: 'Turn off all lights, lock doors, set security',
    devices: ['All Lights', 'Front Door Lock', 'Security System'],
    isActive: false
  },
  {
    id: '3',
    name: 'Away',
    icon: Home,
    description: 'Turn off all devices, activate security',
    devices: ['All Lights', 'Main Thermostat', 'Security System'],
    isActive: true
  },
  {
    id: '4',
    name: 'Movie Time',
    icon: Bed,
    description: 'Dim lights, close blinds',
    devices: ['Living Room Lights', 'TV Backlight'],
    isActive: false
  }
];

export const SceneManager = () => {
  const [scenes, setScenes] = useState(mockScenes);
  const [newSceneName, setNewSceneName] = useState('');
  const { toast } = useToast();

  const handleActivateScene = (sceneId: string) => {
    setScenes(prev => 
      prev.map(scene => ({
        ...scene,
        isActive: scene.id === sceneId
      }))
    );
    
    const scene = scenes.find(s => s.id === sceneId);
    toast({
      title: "Scene Activated",
      description: `"${scene?.name}" scene is now active`,
    });
  };

  const handleCreateScene = () => {
    if (!newSceneName.trim()) return;
    
    const newScene = {
      id: Date.now().toString(),
      name: newSceneName,
      icon: Settings,
      description: 'Custom scene - configure devices',
      devices: [],
      isActive: false
    };
    
    setScenes(prev => [...prev, newScene]);
    setNewSceneName('');
    
    toast({
      title: "Scene Created",
      description: `"${newSceneName}" scene has been created`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Scene Manager</h2>
        <p className="text-muted-foreground">Create and manage automation scenes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Create New Scene</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Scene name (e.g., Dinner Time)"
              value={newSceneName}
              onChange={(e) => setNewSceneName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateScene()}
            />
            <Button onClick={handleCreateScene} disabled={!newSceneName.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Create
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenes.map((scene) => {
          const IconComponent = scene.icon;
          return (
            <Card key={scene.id} className={`transition-all duration-300 hover:shadow-md ${scene.isActive ? 'ring-2 ring-primary' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{scene.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{scene.description}</p>
                    </div>
                  </div>
                  {scene.isActive && (
                    <Badge className="bg-primary text-primary-foreground">Active</Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Affected Devices:</p>
                  <div className="flex flex-wrap gap-1">
                    {scene.devices.map((device, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {device}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    className="flex-1"
                    variant={scene.isActive ? "secondary" : "default"}
                    onClick={() => handleActivateScene(scene.id)}
                    disabled={scene.isActive}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {scene.isActive ? 'Active' : 'Activate'}
                  </Button>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};