import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, AlertTriangle, CheckCircle, Mic, Volume2, Wifi, Settings } from 'lucide-react';

const troubleshootingItems = [
  {
    id: 1,
    category: 'Common Issues',
    icon: AlertTriangle,
    issues: [
      {
        problem: 'Voice commands not recognized',
        solution: 'Ensure microphone permissions are granted. Check browser settings and allow microphone access for this site.',
        steps: [
          'Click the microphone icon in your browser address bar',
          'Select "Always allow" for microphone access',
          'Refresh the page and try again',
          'Speak clearly and wait for the listening indicator'
        ]
      },
      {
        problem: 'Commands work sometimes but not always',
        solution: 'This is usually due to background noise or unclear speech. Try the voice training feature.',
        steps: [
          'Go to the Voice Training tab',
          'Complete training for all phrases',
          'Find a quieter environment',
          'Speak at a consistent volume and pace'
        ]
      }
    ]
  },
  {
    id: 2,
    category: 'Technical Issues',
    icon: Settings,
    issues: [
      {
        problem: 'Microphone not working',
        solution: 'Check your device microphone settings and browser permissions.',
        steps: [
          'Test your microphone in other applications',
          'Check Windows/Mac microphone privacy settings',
          'Ensure microphone is not muted',
          'Try refreshing the browser page'
        ]
      },
      {
        problem: 'Browser compatibility issues',
        solution: 'Voice recognition works best in Chrome, Edge, and Safari. Firefox has limited support.',
        steps: [
          'Use Chrome or Edge for best experience',
          'Update your browser to the latest version',
          'Clear browser cache and cookies',
          'Disable browser extensions that might interfere'
        ]
      }
    ]
  },
  {
    id: 3,
    category: 'Performance Issues',
    icon: Wifi,
    issues: [
      {
        problem: 'Slow response times',
        solution: 'Voice processing requires a stable internet connection and sufficient device resources.',
        steps: [
          'Check your internet connection speed',
          'Close unnecessary browser tabs',
          'Restart your browser',
          'Try using a wired internet connection'
        ]
      },
      {
        problem: 'Commands execute incorrectly',
        solution: 'The system might be misunderstanding your commands. Use exact phrases from the command examples.',
        steps: [
          'Refer to the Command Examples tab for exact phrases',
          'Speak more slowly and clearly',
          'Use the voice training feature',
          'Check for conflicting browser extensions'
        ]
      }
    ]
  }
];

const systemChecks = [
  { name: 'Microphone Access', status: 'checking', description: 'Browser microphone permissions' },
  { name: 'Speech Recognition', status: 'checking', description: 'Web Speech API support' },
  { name: 'Network Connection', status: 'checking', description: 'Internet connectivity' },
  { name: 'Browser Compatibility', status: 'checking', description: 'Voice feature support' }
];

export const TroubleshootingGuide = () => {
  const [openSections, setOpenSections] = useState<number[]>([]);
  const [checks, setChecks] = useState(systemChecks);
  const [runningDiagnostics, setRunningDiagnostics] = useState(false);

  const toggleSection = (id: number) => {
    setOpenSections(prev => 
      prev.includes(id) 
        ? prev.filter(sectionId => sectionId !== id)
        : [...prev, id]
    );
  };

  const runDiagnostics = async () => {
    setRunningDiagnostics(true);
    
    // Simulate diagnostic checks
    for (let i = 0; i < checks.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setChecks(prev => 
        prev.map((check, index) => 
          index === i 
            ? { 
                ...check, 
                status: Math.random() > 0.2 ? 'success' : 'error' // 80% success rate
              }
            : check
        )
      );
    }
    
    setRunningDiagnostics(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'checking':
        return <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'checking':
        return 'text-blue-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Troubleshooting Guide</h2>
        <p className="text-muted-foreground">
          Having issues with voice commands? Use this guide to diagnose and fix common problems.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Settings className="h-5 w-5" />
            System Diagnostics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {checks.map((check, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(check.status)}
                  <div>
                    <p className="font-medium text-foreground">{check.name}</p>
                    <p className="text-sm text-muted-foreground">{check.description}</p>
                  </div>
                </div>
                <Badge variant="outline" className={getStatusColor(check.status)}>
                  {check.status === 'checking' ? 'Checking...' : check.status}
                </Badge>
              </div>
            ))}
          </div>
          
          <Button 
            onClick={runDiagnostics} 
            disabled={runningDiagnostics}
            className="w-full"
          >
            {runningDiagnostics ? 'Running Diagnostics...' : 'Run Diagnostics'}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {troubleshootingItems.map((category) => {
          const IconComponent = category.icon;
          const isOpen = openSections.includes(category.id);
          
          return (
            <Card key={category.id}>
              <Collapsible>
                <CollapsibleTrigger 
                  className="w-full"
                  onClick={() => toggleSection(category.id)}
                >
                  <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-5 w-5 text-primary" />
                        {category.category}
                        <Badge variant="outline">{category.issues.length} issues</Badge>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    {category.issues.map((issue, index) => (
                      <div key={index} className="space-y-3 p-4 bg-muted/20 rounded-lg">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">
                            ❓ {issue.problem}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            {issue.solution}
                          </p>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-foreground mb-2">Steps to resolve:</h5>
                          <ol className="space-y-1">
                            {issue.steps.map((step, stepIndex) => (
                              <li key={stepIndex} className="text-sm text-muted-foreground flex gap-2">
                                <span className="font-medium text-primary">{stepIndex + 1}.</span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>

      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <h4 className="font-semibold text-foreground mb-2">📞 Still Need Help?</h4>
          <p className="text-sm text-muted-foreground mb-4">
            If you're still experiencing issues after trying these solutions, here are additional resources:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Check browser console for error messages (F12 → Console)</li>
            <li>• Try using the application in an incognito/private browser window</li>
            <li>• Test with a different microphone or headset</li>
            <li>• Ensure your operating system has the latest updates</li>
            <li>• Contact support with specific error messages or behavior descriptions</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};