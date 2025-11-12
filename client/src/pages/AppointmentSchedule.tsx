import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function AppointmentSchedule() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { data: appointments, isLoading, refetch } = trpc.appointments.getByDate.useQuery({
    date: selectedDate,
  });
  const { data: patients } = trpc.patients.list.useQuery();
  const { data: rooms } = trpc.rooms.list.useQuery();
  const createAppointmentMutation = trpc.appointments.create.useMutation();

  const [formData, setFormData] = useState({
    patientId: "",
    roomId: "",
    appointmentDate: "",
    duration: 30,
    notes: "",
  });

  const handleCreateAppointment = async () => {
    try {
      await createAppointmentMutation.mutateAsync({
        patientId: parseInt(formData.patientId),
        roomId: formData.roomId ? parseInt(formData.roomId) : undefined,
        appointmentDate: new Date(formData.appointmentDate),
        duration: formData.duration,
        notes: formData.notes,
      });
      setShowCreateDialog(false);
      setFormData({
        patientId: "",
        roomId: "",
        appointmentDate: "",
        duration: 30,
        notes: "",
      });
      refetch();
    } catch (error) {
      console.error("Erro ao criar consulta:", error);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Agenda de Consultas</h1>
            <p className="text-gray-600 mt-1">Gerencie as consultas agendadas</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            Nova Consulta
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Consultas de {formatDate(selectedDate)}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handlePreviousDay}>
                  ← Anterior
                </Button>
                <Button variant="outline" size="sm" onClick={handleNextDay}>
                  Próximo →
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-gray-600">Carregando...</p>
            ) : appointments && appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((appointment: any) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-semibold">Paciente ID: {appointment.patientId}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(appointment.appointmentDate).toLocaleTimeString("pt-BR")} - {appointment.duration} min
                      </p>
                      {appointment.notes && (
                        <p className="text-sm text-gray-500 mt-1">{appointment.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        appointment.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {appointment.status === "scheduled" && "Agendada"}
                        {appointment.status === "completed" && "Concluída"}
                        {appointment.status === "cancelled" && "Cancelada"}
                        {appointment.status === "no-show" && "Não compareceu"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Nenhuma consulta agendada para este dia</p>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Create Appointment Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Consulta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Paciente *</Label>
                <select
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Selecione um paciente</option>
                  {patients?.map((patient: any) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Sala</Label>
                <select
                  value={formData.roomId}
                  onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Selecione uma sala</option>
                  {rooms?.map((room: any) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Data e Hora *</Label>
                <Input
                  type="datetime-local"
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                />
              </div>
              <div>
                <Label>Duração (minutos)</Label>
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  min="15"
                  step="15"
                />
              </div>
              <div className="col-span-2">
                <Label>Observações</Label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Observações sobre a consulta"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-4 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateAppointment}
                disabled={!formData.patientId || !formData.appointmentDate}
              >
                Agendar Consulta
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
