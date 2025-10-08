import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Clock, Calendar, Thermometer, Sun, Moon, Plus } from 'lucide-react';

const mockRules = [
  {
    id: '1',
    name: 'Morning Routine',
    trigger: 'Time: 7:00 AM',
    action: 'Turn on living room lights, set thermostat to 72°F',
    enabled: true,
    icon: Sun,
    type: 'time'
  },
  {
    id: '2',
    name: 'Evening Lights',
    trigger: 'Sunset',
    action: 'Turn on all exterior lights',
    enabled: true,
    icon: Moon,
    type: 'solar'
  },
  {
    id: '3',
    name: 'Away Mode',
    trigger: 'All phones leave home area',
    action: 'Activate away scene, arm security',
    enabled: false,
    icon: Calendar,
    type: 'presence'
  },
  {
    id: '4',
    name: 'Temperature Control',
    trigger: 'Temperature > 75°F',
    action: 'Lower thermostat to 72°F',
    enabled: true,
    icon: Thermometer,
    type: 'sensor'
  }
];

export const AutomationRules = () => {
  const [rules, setRules] = useState(mockRules);

  const handleToggleRule = (ruleId: string) => {
    setRules(prev => 
      prev.map(rule => 
        rule.id === ruleId 
          ? { ...rule, enabled: !rule.enabled }
          : rule
      )
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'time':
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'solar':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'presence':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'sensor':
        return 'bg-purple-500/10 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Automation Rules</h2>
          <p className="text-muted-foreground">Set up triggers and actions for your devices</p>
        </div>
        
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Create Rule
        </Button>
      </div>

      <div className="grid gap-4">
        {rules.map((rule) => {
          const IconComponent = rule.icon;
          return (
            <Card key={rule.id} className="transition-all duration-300 hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {rule.name}
                        <Badge variant="outline" className={getTypeColor(rule.type)}>
                          {rule.type}
                        </Badge>
                      </CardTitle>
                    </div>
                  </div>
                  <Switch 
                    checked={rule.enabled}
                    onCheckedChange={() => handleToggleRule(rule.id)}
                    aria-label={`Toggle ${rule.name}`}
                  />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">Trigger</h4>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                      {rule.trigger}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">Action</h4>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                      {rule.action}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <Badge variant={rule.enabled ? 'default' : 'secondary'}>
                    {rule.enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      Test
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};