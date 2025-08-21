import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useVoiceAgent } from '@/lib/voiceAgent';
import { useAppointments } from '@/hooks/useDatabase';
import type { Appointment } from '@/types/database';

export function VoiceAgent() {
  const { state, error, transcript, startListening, speak, processCommand } = useVoiceAgent();
  const { createAppointment, updateAppointment, deleteAppointment, getAppointments } = useAppointments();
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'assistant'; text: string }>>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    // Welcome message when component mounts
    addMessage('assistant', 'Hello! I\'m your AI appointment assistant. How can I help you today?');
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await getAppointments();
      setAppointments(data);
    } catch (err) {
      console.error('Failed to load appointments:', err);
    }
  };

  const addMessage = (type: 'user' | 'assistant', text: string) => {
    setMessages(prev => [...prev, { type, text }]);
    if (type === 'assistant') {
      speak(text);
    }
  };

  const handleMicClick = () => {
    if (state === 'idle') {
      startListening();
      addMessage('assistant', 'I\'m listening. Please tell me what you\'d like to do.');
    }
  };

  const findAppointmentByTitle = (title: string): Appointment | undefined => {
    return appointments.find(apt => 
      apt.title.toLowerCase().includes(title.toLowerCase())
    );
  };

  const parseDateTime = (date: string | undefined, time: string | undefined): Date | null => {
    if (!date && !time) return null;

    const now = new Date();
    let targetDate = now;

    if (date) {
      if (date.toLowerCase() === 'tomorrow') {
        targetDate = new Date(now.setDate(now.getDate() + 1));
      } else if (date.toLowerCase() === 'today') {
        targetDate = now;
      } else if (date.match(/next (monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i)) {
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const targetDay = dayNames.indexOf(date.split(' ')[1].toLowerCase());
        const currentDay = now.getDay();
        const daysToAdd = (targetDay + 7 - currentDay) % 7;
        targetDate = new Date(now.setDate(now.getDate() + daysToAdd));
      } else {
        // Handle MM/DD/YYYY or similar formats
        targetDate = new Date(date);
      }
    }

    if (time) {
      const timeMatch = time.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
        const meridiem = timeMatch[3]?.toLowerCase();

        if (meridiem === 'pm' && hours < 12) hours += 12;
        if (meridiem === 'am' && hours === 12) hours = 0;

        targetDate.setHours(hours, minutes, 0, 0);
      }
    }

    return targetDate;
  };

  const handleCommand = async (command: any) => {
    try {
      switch (command.intent) {
        case 'schedule': {
          const startDate = parseDateTime(command.parameters.date, command.parameters.time);
          if (!startDate) {
            addMessage('assistant', 'I need a date and time for the appointment. When would you like to schedule it?');
            return;
          }

          const duration = command.parameters.duration || 60; // Default to 1 hour
          const endDate = new Date(startDate.getTime() + duration * 60000);

          if (!command.parameters.title) {
            addMessage('assistant', 'What would you like to title this appointment?');
            return;
          }

          await createAppointment({
            title: command.parameters.title,
            description: command.parameters.description,
            start_time: startDate.toISOString(),
            end_time: endDate.toISOString(),
            status: 'scheduled'
          });

          addMessage('assistant', `I've scheduled "${command.parameters.title}" for ${startDate.toLocaleString()}.`);
          await loadAppointments();
          break;
        }

        case 'reschedule': {
          const appointment = findAppointmentByTitle(command.parameters.title || '');
          if (!appointment) {
            addMessage('assistant', 'I couldn\'t find that appointment. Could you specify which appointment you\'d like to reschedule?');
            return;
          }

          const startDate = parseDateTime(command.parameters.date, command.parameters.time);
          if (!startDate) {
            addMessage('assistant', 'When would you like to reschedule it to?');
            return;
          }

          const duration = command.parameters.duration || 
            (new Date(appointment.end_time).getTime() - new Date(appointment.start_time).getTime()) / 60000;
          const endDate = new Date(startDate.getTime() + duration * 60000);

          await updateAppointment(appointment.id, {
            start_time: startDate.toISOString(),
            end_time: endDate.toISOString(),
          });

          addMessage('assistant', `I've rescheduled "${appointment.title}" to ${startDate.toLocaleString()}.`);
          await loadAppointments();
          break;
        }

        case 'cancel': {
          const appointment = findAppointmentByTitle(command.parameters.title || '');
          if (!appointment) {
            addMessage('assistant', 'I couldn\'t find that appointment. Which appointment would you like to cancel?');
            return;
          }

          await deleteAppointment(appointment.id);
          addMessage('assistant', `I've cancelled your appointment "${appointment.title}".`);
          await loadAppointments();
          break;
        }

        case 'query': {
          const upcoming = appointments
            .filter(apt => new Date(apt.start_time) > new Date())
            .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

          if (upcoming.length === 0) {
            addMessage('assistant', 'You have no upcoming appointments.');
          } else {
            const nextAppointment = upcoming[0];
            addMessage('assistant', 
              `Your next appointment is "${nextAppointment.title}" on ${new Date(nextAppointment.start_time).toLocaleString()}.` +
              `\nYou have ${upcoming.length} upcoming appointment${upcoming.length === 1 ? '' : 's'} in total.`
            );
          }
          break;
        }
      }
    } catch (err) {
      addMessage('assistant', 'Sorry, I encountered an error processing your request. Please try again.');
      console.error('Command processing error:', err);
    }
  };

  useEffect(() => {
    if (transcript) {
      addMessage('user', transcript);
      processCommand(transcript).then(command => {
        if (command) {
          handleCommand(command);
        }
      });
    }
  }, [transcript]);

  if (!isOpen) {
    return (
      <div className="fixed bottom-8 right-8">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 rounded-full"
        >
          <Mic className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 w-96 max-w-[calc(100vw-2rem)]">
      <div className="glass-card rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 h-96 overflow-y-auto space-y-4">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.type === 'assistant' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.type === 'assistant'
                    ? 'bg-white/10 text-white'
                    : 'bg-primary-500 text-white'
                }`}
              >
                {message.text}
              </div>
            </motion.div>
          ))}

          {state === 'listening' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-gray-400"
            >
              Listening...
            </motion.div>
          )}
        </div>

        <div className="p-4 border-t border-white/10">
          <Button
            onClick={handleMicClick}
            className={`w-full justify-center ${
              state === 'listening' ? 'bg-red-500 hover:bg-red-600' : ''
            }`}
          >
            {state === 'listening' ? (
              <>
                <MicOff className="w-5 h-5 mr-2" />
                Stop Listening
              </>
            ) : state === 'processing' ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 mr-2" />
                Start Speaking
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}