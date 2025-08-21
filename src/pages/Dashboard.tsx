import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AppointmentModal } from '@/components/appointments/AppointmentModal';
import { useAppointments } from '@/hooks/useDatabase';
import type { Appointment } from '@/types/database';
import { Helmet } from 'react-helmet-async';

export function DashboardPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getAppointments, createAppointment, updateAppointment, deleteAppointment } = useAppointments();

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      const data = await getAppointments();
      setAppointments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (appointment: Omit<Appointment, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      if (selectedAppointment) {
        await updateAppointment(selectedAppointment.id, appointment);
      } else {
        await createAppointment(appointment);
      }
      await loadAppointments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save appointment');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAppointment(id);
      await loadAppointments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete appointment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 text-center text-gray-400">
            Loading appointments...
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - AipaFlow</title>
        <meta
          name="description"
          content="Manage your appointments and schedule with AipaFlow's intelligent assistant."
        />
      </Helmet>

      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-primary-400" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-white">
                  Your Appointments
                </h1>
                <p className="text-gray-400">
                  Manage your schedule and upcoming meetings
                </p>
              </div>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              New Appointment
            </Button>
          </div>

          {error && (
            <div className="mb-8 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appointment) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    {appointment.title}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setIsModalOpen(true);
                      }}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(appointment.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                {appointment.description && (
                  <p className="text-gray-300 mb-4">
                    {appointment.description}
                  </p>
                )}

                <div className="space-y-2 text-sm text-gray-400">
                  <div>
                    Start: {new Date(appointment.start_time).toLocaleString()}
                  </div>
                  <div>
                    End: {new Date(appointment.end_time).toLocaleString()}
                  </div>
                  <div className="capitalize">
                    Status: {appointment.status}
                  </div>
                </div>
              </motion.div>
            ))}

            {appointments.length === 0 && (
              <div className="lg:col-span-3 glass-card p-8 text-center">
                <p className="text-gray-400">
                  No appointments scheduled. Click "New Appointment" to create one.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAppointment(undefined);
        }}
        onSubmit={handleSubmit}
        appointment={selectedAppointment}
      />
    </>
  );
}