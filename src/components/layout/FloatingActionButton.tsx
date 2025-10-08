import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { VoiceCommandProcessor } from '@/services/VoiceCommandProcessor';
import { useToast } from '@/components/ui/use-toast';
import { useVoiceCommand } from '@/hooks/useVoiceCommand';

export const FloatingActionButton = () => {
  const [status, setStatus] = useState<'listening' | 'idle' | 'processing'>('idle');
  const [processor, setProcessor] = useState<VoiceCommandProcessor | null>(null);
  const { toast } = useToast();
  const { processCommand, processing } = useVoiceCommand();

  useEffect(() => {
    if (processing) {
      setStatus('processing');
    } else if (status === 'processing') {
      setStatus('idle');
    }
  }, [processing]);

  const handleVoiceActivation = () => {
    if (!processor) {
      const newProcessor = new VoiceCommandProcessor(
        (transcript, confidence) => {
          toast({
            title: "Voice Command Recognized",
            description: `"${transcript}" (${Math.round(confidence * 100)}% confidence)`,
          });
        },
        (error) => {
          toast({
            title: "Voice Error",
            description: error,
            variant: "destructive",
          });
        },
        setStatus,
        async (data) => {
          // Process the command through AI
          await processCommand(data.transcript);
        }
      );
      setProcessor(newProcessor);
      newProcessor.startListening();
    } else {
      if (status === 'listening') {
        processor.stopListening();
      } else {
        processor.startListening();
      }
    }
  };

  const isActive = status === 'listening' || status === 'processing';

  return (
    <Button
      onClick={handleVoiceActivation}
      className={cn(
        'fixed bottom-20 right-6 h-14 w-14 rounded-full shadow-lg z-50 transition-all duration-300',
        status === 'listening' && 'bg-red-500 hover:bg-red-600 animate-pulse',
        status === 'processing' && 'bg-yellow-500 hover:bg-yellow-600 animate-bounce',
        status === 'idle' && 'bg-primary hover:bg-primary/90'
      )}
      size="icon"
      disabled={status === 'processing'}
    >
      {status === 'listening' ? (
        <MicOff className="h-6 w-6" />
      ) : (
        <Mic className="h-6 w-6" />
      )}
    </Button>
  );
};