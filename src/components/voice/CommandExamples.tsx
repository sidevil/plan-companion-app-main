import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation, Grid, Home, Calendar, Newspaper, MessageCircle } from 'lucide-react';

const commandCategories = [
  {
    category: 'Navigation',
    icon: Navigation,
    description: 'Move between different sections of the app',
    commands: [
      { phrase: '"Go to dashboard"', action: 'Navigate to main dashboard' },
      { phrase: '"Show me widgets"', action: 'Open widget configuration' },
      { phrase: '"Navigate to smart home"', action: 'Open smart home controls' },
      { phrase: '"Go to settings"', action: 'Open settings page' },
      { phrase: '"Show me news"', action: 'Open news and information' },
      { phrase: '"Go to calendar"', action: 'Open calendar view' }
    ]
  },
  {
    category: 'Widget Control',
    icon: Grid,
    description: 'Manage and interact with dashboard widgets',
    commands: [
      { phrase: '"Add widget"', action: 'Open widget gallery to add new widgets' },
      { phrase: '"Remove widget"', action: 'Remove selected widget from dashboard' },
      { phrase: '"What time is it?"', action: 'Show current time information' },
      { phrase: '"Show me the weather"', action: 'Display weather information' }
    ]
  },
  {
    category: 'Smart Home',
    icon: Home,
    description: 'Control connected smart home devices',
    commands: [
      { phrase: '"Turn on the lights"', action: 'Turn on smart lights' },
      { phrase: '"Turn off all lights"', action: 'Turn off all connected lights' },
      { phrase: '"Set thermostat to 72 degrees"', action: 'Adjust thermostat temperature' },
      { phrase: '"Activate good morning scene"', action: 'Run morning automation scene' },
      { phrase: '"Run evening scene"', action: 'Activate evening automation' },
      { phrase: '"Activate away mode"', action: 'Set house to away mode' }
    ]
  },
  {
    category: 'Information Queries',
    icon: MessageCircle,
    description: 'Get information and updates',
    commands: [
      { phrase: '"What\'s the weather like?"', action: 'Get current weather conditions' },
      { phrase: '"What\'s on my calendar today?"', action: 'Show today\'s events' },
      { phrase: '"Read me the news"', action: 'Read latest news headlines' },
      { phrase: '"What time is it?"', action: 'Tell current time' }
    ]
  }
];

export const CommandExamples = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Voice Command Examples</h2>
        <p className="text-muted-foreground">
          Here are examples of voice commands you can use. Speak naturally and clearly.
        </p>
      </div>

      <div className="grid gap-6">
        {commandCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Card key={category.category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg">{category.category}</h3>
                    <p className="text-sm text-muted-foreground font-normal">
                      {category.description}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="grid gap-3">
                  {category.commands.map((command, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <Badge variant="outline" className="font-mono text-xs mb-2 sm:mb-0">
                          {command.phrase}
                        </Badge>
                      </div>
                      <div className="flex-2">
                        <p className="text-sm text-muted-foreground">
                          → {command.action}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <h4 className="font-semibold text-foreground mb-2">💡 Tips for Better Recognition</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Speak clearly and at a normal pace</li>
            <li>• Wait for the microphone to activate before speaking</li>
            <li>• Use the exact phrases shown above for best results</li>
            <li>• Avoid background noise when giving commands</li>
            <li>• If a command isn't recognized, try rephrasing it</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};