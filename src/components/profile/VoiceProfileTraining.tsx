import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Mic, MicOff, Volume2, RotateCcw, Play } from 'lucide-react';

export const VoiceProfileTraining = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [trainingProgress, setTrainingProgress] = useState(45);
  const [completedPhrases, setCompletedPhrases] = useState([0, 1, 2]);

  const trainingPhrases = [
    "Hey SmartMirror, show me today's weather",
    "Turn on the living room lights",
    "What's on my calendar for today",
    "Play my favorite music",
    "Set a reminder for 3 PM",
    "Show me the latest news",
    "Turn up the thermostat to 72 degrees",
    "Good morning SmartMirror"
  ];

  const voiceSettings = [
    { id: 'sensitivity', label: 'Voice Sensitivity', value: 75 },
    { id: 'noiseReduction', label: 'Noise Reduction', value: 80 },
    { id: 'wakeWord', label: 'Wake Word Detection', value: 90 }
  ];

  const handleStartRecording = () => {
    setIsRecording(true);
    // Simulate recording for 3 seconds
    setTimeout(() => {
      setIsRecording(false);
      if (!completedPhrases.includes(currentPhrase)) {
        setCompletedPhrases(prev => [...prev, currentPhrase]);
        setTrainingProgress(prev => Math.min(prev + 12.5, 100));
      }
    }, 3000);
  };

  const handlePlayPhrase = () => {
    // Play the phrase using text-to-speech
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(trainingPhrases[currentPhrase]);
      speechSynthesis.speak(utterance);
    }
  };

  const resetTraining = () => {
    setCompletedPhrases([]);
    setTrainingProgress(0);
    setCurrentPhrase(0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Voice Training Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Training Progress</span>
              <span>{trainingProgress}%</span>
            </div>
            <Progress value={trainingProgress} className="w-full" />
            <p className="text-sm text-muted-foreground">
              Complete voice training to improve recognition accuracy
            </p>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              Phrase {currentPhrase + 1} of {trainingPhrases.length}
            </span>
            <Button variant="outline" size="sm" onClick={resetTraining}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Practice Phrase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Badge variant={completedPhrases.includes(currentPhrase) ? "default" : "secondary"}>
                {completedPhrases.includes(currentPhrase) ? "Completed" : "Pending"}
              </Badge>
              <Button variant="ghost" size="sm" onClick={handlePlayPhrase}>
                <Play className="h-4 w-4 mr-1" />
                Listen
              </Button>
            </div>
            <p className="text-lg font-medium text-center py-4">
              "{trainingPhrases[currentPhrase]}"
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <Button
              size="lg"
              onClick={handleStartRecording}
              disabled={isRecording}
              className={`w-32 h-32 rounded-full ${isRecording ? 'bg-red-500 hover:bg-red-600' : ''}`}
            >
              {isRecording ? (
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-2" />
                  <span className="text-sm">Recording...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Mic className="h-8 w-8 mb-2" />
                  <span className="text-sm">Record</span>
                </div>
              )}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              {isRecording ? 'Say the phrase clearly into your microphone' : 'Click to start recording the phrase above'}
            </p>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentPhrase(Math.max(0, currentPhrase - 1))}
              disabled={currentPhrase === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPhrase(Math.min(trainingPhrases.length - 1, currentPhrase + 1))}
              disabled={currentPhrase === trainingPhrases.length - 1}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Voice Recognition Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {voiceSettings.map((setting) => (
              <div key={setting.id} className="space-y-2">
                <div className="flex justify-between">
                  <Label>{setting.label}</Label>
                  <span className="text-sm text-muted-foreground">{setting.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${setting.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Training Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{completedPhrases.length}</div>
              <div className="text-sm text-muted-foreground">Phrases Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">85%</div>
              <div className="text-sm text-muted-foreground">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">12</div>
              <div className="text-sm text-muted-foreground">Training Sessions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">2.5h</div>
              <div className="text-sm text-muted-foreground">Total Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};