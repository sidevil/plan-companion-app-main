import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface VoiceCommand {
  type: 'navigate' | 'widget' | 'device' | 'scene' | 'query' | 'unknown' | 'error';
  action?: string;
  params?: any;
  response?: string;
}

export const useVoiceCommand = () => {
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const processCommand = useCallback(async (transcript: string) => {
    try {
      setProcessing(true);

      const { data, error } = await supabase.functions.invoke('process-voice-command', {
        body: { transcript }
      });

      if (error) {
        throw error;
      }

      const command: VoiceCommand = data;

      // Execute the command
      switch (command.type) {
        case 'navigate':
          if (command.params?.route) {
            navigate(command.params.route);
            toast({
              title: 'Navigation',
              description: command.response || `Navigating to ${command.params.route}`,
            });
          }
          break;

        case 'widget':
          // Dispatch event for widget management
          window.dispatchEvent(new CustomEvent('voiceCommand', {
            detail: command
          }));
          toast({
            title: 'Widget Command',
            description: command.response || 'Processing widget command',
          });
          break;

        case 'device':
          // Dispatch event for device control
          window.dispatchEvent(new CustomEvent('voiceCommand', {
            detail: command
          }));
          toast({
            title: 'Device Control',
            description: command.response || 'Controlling device',
          });
          break;

        case 'scene':
          // Dispatch event for scene activation
          window.dispatchEvent(new CustomEvent('voiceCommand', {
            detail: command
          }));
          toast({
            title: 'Scene Activation',
            description: command.response || 'Activating scene',
          });
          break;

        case 'query':
          toast({
            title: 'Query Response',
            description: command.response || 'Processing query',
          });
          break;

        default:
          toast({
            title: 'Voice Command',
            description: command.response || "I didn't understand that command",
            variant: 'destructive',
          });
      }

      return command;
    } catch (error) {
      console.error('Error processing voice command:', error);
      toast({
        title: 'Error',
        description: 'Failed to process voice command',
        variant: 'destructive',
      });
      return null;
    } finally {
      setProcessing(false);
    }
  }, [navigate, toast]);

  return { processCommand, processing };
};
