declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export class VoiceCommandProcessor {
  private recognition: any = null;
  private isListening = false;
  private onResult: (transcript: string, confidence: number) => void;
  private onError: (error: string) => void;
  private onStatusChange: (status: 'listening' | 'idle' | 'processing') => void;
  private onCommandProcessed: (command: any) => void;

  constructor(
    onResult: (transcript: string, confidence: number) => void,
    onError: (error: string) => void,
    onStatusChange: (status: 'listening' | 'idle' | 'processing') => void,
    onCommandProcessed: (command: any) => void
  ) {
    this.onResult = onResult;
    this.onError = onError;
    this.onStatusChange = onStatusChange;
    this.onCommandProcessed = onCommandProcessed;
    this.initializeRecognition();
  }

  private initializeRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      this.onError('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.onStatusChange('listening');
    };

    this.recognition.onresult = (event) => {
      const result = event.results[0];
      const transcript = result[0].transcript.toLowerCase().trim();
      const confidence = result[0].confidence;
      
      this.onStatusChange('processing');
      this.onResult(transcript, confidence);
      
      // Let the external handler process the command through the AI
      this.onCommandProcessed({ transcript, confidence });
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      this.onStatusChange('idle');
      this.onError(`Speech recognition error: ${event.error}`);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.onStatusChange('idle');
    };
  }

  public startListening() {
    if (!this.recognition || this.isListening) return;
    
    try {
      this.recognition.start();
    } catch (error) {
      this.onError('Failed to start voice recognition');
    }
  }

  public stopListening() {
    if (!this.recognition || !this.isListening) return;
    
    this.recognition.stop();
  }

  public isCurrentlyListening() {
    return this.isListening;
  }
}