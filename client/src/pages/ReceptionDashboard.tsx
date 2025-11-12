import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function ReceptionDashboard() {
  const [, setLocation] = useLocation();
  const { data: patients, isLoading } = trpc.patients.list.useQuery();

  const todayAppointments = trpc.appointments.getByDate.useQuery({
    date: new Date(),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Recepção</h1>
          <p className="text-gray-600 mt-1">Gerencie pacientes e consultas</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button
            size="lg"
            className="h-auto py-4"
            onClick={() => setLocation("/patients")}
          >
            <div className="text-left">
              <div className="font-semibold">Pacientes</div>
              <div className="text-sm opacity-90">Gerenciar pacientes</div>
            </div>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="h-auto py-4"
            onClick={() => setLocation("/appointments")}
          >
            <div className="text-left">
              <div className="font-semibold">Agenda</div>
              <div className="text-sm opacity-90">Ver consultas</div>
            </div>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="h-auto py-4"
          >
            <div className="text-left">
              <div className="font-semibold">Novo Paciente</div>
              <div className="text-sm opacity-90">Cadastrar paciente</div>
            </div>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="h-auto py-4"
          >
            <div className="text-left">
              <div className="font-semibold">Nova Consulta</div>
              <div className="text-sm opacity-90">Agendar consulta</div>
            </div>
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total de Pacientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoading ? "-" : patients?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Consultas Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {todayAppointments.isLoading ? "-" : todayAppointments.data?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Status do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">Ativo</div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Consultas de Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            {todayAppointments.isLoading ? (
              <p className="text-gray-600">Carregando...</p>
            ) : todayAppointments.data && todayAppointments.data.length > 0 ? (
              <div className="space-y-4">
                {todayAppointments.data.map((appointment: any) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-semibold">Paciente ID: {appointment.patientId}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(appointment.appointmentDate).toLocaleTimeString("pt-BR")}
                      </p>
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
              <p className="text-gray-600">Nenhuma consulta agendada para hoje</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

