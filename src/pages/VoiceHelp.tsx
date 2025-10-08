import React, { useState } from 'react';
import { CommandExamples } from '@/components/voice/CommandExamples';
import { VoiceTraining } from '@/components/voice/VoiceTraining';
import { TroubleshootingGuide } from '@/components/voice/TroubleshootingGuide';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, BookOpen, Settings, HelpCircle } from 'lucide-react';

const VoiceHelp = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Voice Commands Help</h1>
        <p className="text-muted-foreground">Learn how to use voice commands effectively</p>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Mic className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Voice Commands are Active
              </h3>
              <p className="text-sm text-muted-foreground">
                Click the microphone button in the bottom right to start giving voice commands.
                Speak clearly and wait for the system to process your request.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="commands" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="commands" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Commands
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Training
          </TabsTrigger>
          <TabsTrigger value="troubleshooting" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Help
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="commands" className="space-y-6">
          <CommandExamples />
        </TabsContent>
        
        <TabsContent value="training" className="space-y-6">
          <VoiceTraining />
        </TabsContent>
        
        <TabsContent value="troubleshooting" className="space-y-6">
          <TroubleshootingGuide />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VoiceHelp;