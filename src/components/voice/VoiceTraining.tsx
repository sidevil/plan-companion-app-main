import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Mic, CheckCircle, RotateCcw, Play } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const trainingPhrases = [
  { id: 1, phrase: "Go to dashboard", category: "Navigation" },
  { id: 2, phrase: "Turn on the lights", category: "Smart Home" },
  { id: 3, phrase: "What's the weather like?", category: "Information" },
  { id: 4, phrase: "Show me widgets", category: "Navigation" },
  { id: 5, phrase: "Activate good morning scene", category: "Smart Home" },
  { id: 6, phrase: "What time is it?", category: "Information" }
];

export const VoiceTraining = () => {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [completedPhrases, setCompletedPhrases] = useState<number[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [recognitionAccuracy, setRecognitionAccuracy] = useState(85);
  const { toast } = useToast();

  const handleStartTraining = () => {
    setIsTraining(true);
    
    // Simulate training process
    setTimeout(() => {
      setIsTraining(false);
      setCompletedPhrases(prev => [...prev, trainingPhrases[currentPhrase].id]);
      setRecognitionAccuracy(prev => Math.min(100, prev + Math.floor(Math.random() * 5) + 2));
      
      toast({
        title: "Training Complete",
        description: `Successfully trained phrase: "${trainingPhrases[currentPhrase].phrase}"`,
      });
      
      if (currentPhrase < trainingPhrases.length - 1) {
        setCurrentPhrase(prev => prev + 1);
      }
    }, 3000);
  };

  const handleRetryPhrase = () => {
    setCompletedPhrases(prev => prev.filter(id => id !== trainingPhrases[currentPhrase].id));
    handleStartTraining();
  };

  const handleNextPhrase = () => {
    if (currentPhrase < trainingPhrases.length - 1) {
      setCurrentPhrase(prev => prev + 1);
    }
  };

  const handlePreviousPhrase = () => {
    if (currentPhrase > 0) {
      setCurrentPhrase(prev => prev - 1);
    }
  };

  const isCurrentPhraseCompleted = completedPhrases.includes(trainingPhrases[currentPhrase].id);
  const completedCount = completedPhrases.length;
  const progressPercentage = (completedCount / trainingPhrases.length) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Voice Training</h2>
        <p className="text-muted-foreground">
          Train the system to better recognize your voice by practicing key phrases.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Training Progress</span>
            <Badge variant="outline">
              {completedCount}/{trainingPhrases.length} Complete
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={progressPercentage} className="w-full" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{completedCount}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{trainingPhrases.length - completedCount}</p>
                <p className="text-sm text-muted-foreground">Remaining</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{recognitionAccuracy}%</p>
                <p className="text-sm text-muted-foreground">Accuracy</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">6</p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span>Phrase {currentPhrase + 1} of {trainingPhrases.length}</span>
            {isCurrentPhraseCompleted && (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
            <Badge variant="secondary" className="ml-auto">
              {trainingPhrases[currentPhrase].category}
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center p-8 bg-muted/30 rounded-lg">
            <div className="text-3xl font-mono font-bold text-foreground mb-4">
              "{trainingPhrases[currentPhrase].phrase}"
            </div>
            <p className="text-muted-foreground">
              Click the microphone and repeat this phrase clearly
            </p>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleStartTraining}
              size="lg"
              disabled={isTraining}
              className={`w-24 h-24 rounded-full transition-all duration-300 ${
                isTraining ? 'animate-pulse bg-red-500 hover:bg-red-600' : ''
              }`}
            >
              {isTraining ? (
                <div className="flex flex-col items-center">
                  <Mic className="h-8 w-8 mb-1" />
                  <span className="text-xs">Listening...</span>
                </div>
              ) : (
                <Mic className="h-8 w-8" />
              )}
            </Button>
          </div>

          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={handlePreviousPhrase}
              disabled={currentPhrase === 0 || isTraining}
            >
              Previous
            </Button>
            
            {isCurrentPhraseCompleted ? (
              <Button variant="outline" onClick={handleRetryPhrase} disabled={isTraining}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            ) : null}
            
            <Button
              variant="outline"
              onClick={handleNextPhrase}
              disabled={currentPhrase === trainingPhrases.length - 1 || isTraining}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
        <CardContent className="p-6">
          <h4 className="font-semibold text-foreground mb-2">🎯 Training Tips</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Find a quiet environment for training</li>
            <li>• Speak at your normal volume and pace</li>
            <li>• Hold the device at a consistent distance</li>
            <li>• Complete all phrases for best results</li>
            <li>• Retrain periodically to maintain accuracy</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};