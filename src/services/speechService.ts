// Web Speech API Voice Recognition and Text-To-Speech Service

export interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

class SpeechService {
  private recognition: any = null;
  private isListening = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
      }
    }
  }

  public isVoiceSupported(): boolean {
    return Boolean(this.recognition);
  }

  public startListening(
    language: 'en' | 'ta' | 'hi' = 'en',
    onResult: (result: SpeechRecognitionResult) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): boolean {
    if (!this.recognition) {
      onError('Voice recognition is not supported in this browser. Please use text input.');
      return false;
    }

    if (this.isListening) {
      this.stopListening();
    }

    // Map language code
    const langMap = {
      en: 'en-US',
      ta: 'ta-IN',
      hi: 'hi-IN',
    };
    this.recognition.lang = langMap[language] || 'en-US';

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      onResult({
        transcript: finalTranscript || interimTranscript,
        isFinal: Boolean(finalTranscript),
      });
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      onError(event.error || 'Voice recognition encountered an issue.');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd();
    };

    try {
      this.recognition.start();
      return true;
    } catch (e: any) {
      onError(e.message || 'Could not start voice recognition.');
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  public speak(text: string, lang: 'en' | 'ta' | 'hi' = 'en'): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const langMap = {
      en: 'en-US',
      ta: 'ta-IN',
      hi: 'hi-IN',
    };
    utterance.lang = langMap[lang] || 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }
}

export const speechService = new SpeechService();
