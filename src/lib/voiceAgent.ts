import { useCallback, useState } from 'react';
import type { Appointment } from '@/types/database';

type VoiceAgentState = 'idle' | 'listening' | 'processing' | 'speaking';
type VoiceCommand = {
  intent: 'schedule' | 'reschedule' | 'cancel' | 'query';
  parameters: {
    date?: string;
    time?: string;
    duration?: number;
    title?: string;
    appointmentId?: string;
    description?: string;
  };
};

export function useVoiceAgent() {
  const [state, setState] = useState<VoiceAgentState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');

  const startListening = useCallback(() => {
    setState('listening');
    setError(null);
    setTranscript('');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser');
      setState('idle');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const currentTranscript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      
      setTranscript(currentTranscript);

      if (event.results[0].isFinal) {
        processCommand(currentTranscript);
      }
    };

    recognition.onerror = (event) => {
      setError(`Speech recognition error: ${event.error}`);
      setState('idle');
    };

    recognition.start();
  }, []);

  const extractDateTime = (text: string) => {
    const dateTimeInfo = {
      date: undefined as string | undefined,
      time: undefined as string | undefined,
      duration: undefined as number | undefined,
    };

    // Match dates in various formats
    const datePatterns = [
      /\b\d{1,2}\/\d{1,2}\/\d{4}\b/, // MM/DD/YYYY
      /\b\d{1,2}-\d{1,2}-\d{4}\b/, // MM-DD-YYYY
      /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* \d{1,2}(?:st|nd|rd|th)?,? \d{4}\b/i, // January 1st, 2024
      /\b(?:tomorrow|next (?:monday|tuesday|wednesday|thursday|friday|saturday|sunday))\b/i, // tomorrow, next Monday
      /\b(?:today|tonight)\b/i, // today, tonight
    ];

    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        dateTimeInfo.date = match[0];
        break;
      }
    }

    // Match times in various formats
    const timePatterns = [
      /\b(?:1[0-2]|0?[1-9])(?::[0-5][0-9])?\s*(?:am|pm)\b/i, // 3:30pm, 11am
      /\b(?:1[0-2]|0?[1-9]):[0-5][0-9]\b/, // 15:30, 9:00
      /\b(?:morning|afternoon|evening|noon|midnight)\b/i, // morning, afternoon
    ];

    for (const pattern of timePatterns) {
      const match = text.match(pattern);
      if (match) {
        dateTimeInfo.time = match[0];
        break;
      }
    }

    // Match duration
    const durationMatch = text.match(/\b(?:for\s+)?(\d+)\s*(?:min(?:ute)?s?|hours?)\b/i);
    if (durationMatch) {
      const value = parseInt(durationMatch[1]);
      const unit = durationMatch[0].toLowerCase().includes('hour') ? 60 : 1;
      dateTimeInfo.duration = value * unit;
    }

    return dateTimeInfo;
  };

  const processCommand = async (text: string): Promise<VoiceCommand | null> => {
    setState('processing');
    try {
      const command: VoiceCommand = {
        intent: 'query',
        parameters: {},
      };

      // Determine intent
      if (text.match(/\b(?:schedule|book|set up|arrange|make)\b/i)) {
        command.intent = 'schedule';
      } else if (text.match(/\b(?:reschedule|change|move|update)\b/i)) {
        command.intent = 'reschedule';
      } else if (text.match(/\b(?:cancel|delete|remove)\b/i)) {
        command.intent = 'cancel';
      }

      // Extract date, time, and duration
      const { date, time, duration } = extractDateTime(text);
      if (date) command.parameters.date = date;
      if (time) command.parameters.time = time;
      if (duration) command.parameters.duration = duration;

      // Extract title and description
      const titleMatch = text.match(/\b(?:for|about|regarding)\s+(.+?)(?:\s+(?:on|at|with|tomorrow|next|in|for|about)\s+|$)/i);
      if (titleMatch) {
        command.parameters.title = titleMatch[1].trim();
      }

      const descriptionMatch = text.match(/\bdescription\s+(?:is\s+)?(.+?)(?:\s+(?:on|at|with|tomorrow|next|in|for|about)\s+|$)/i);
      if (descriptionMatch) {
        command.parameters.description = descriptionMatch[1].trim();
      }

      setState('idle');
      return command;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process voice command');
      setState('idle');
      return null;
    }
  };

  const speak = useCallback(async (text: string) => {
    setState('speaking');
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setState('idle');
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to synthesize speech');
      setState('idle');
    }
  }, []);

  return {
    state,
    error,
    transcript,
    startListening,
    processCommand,
    speak,
  };
}