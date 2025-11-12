import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState, useEffect } from "react";

export default function StudentAttendance() {
  const { user } = useAuth();
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // TODO: Get student ID from user
  const studentId = 1; // Placeholder

  const { data: attendanceRecords, refetch } = trpc.attendance.getByStudent.useQuery({
    studentId,
  });

  const checkInMutation = trpc.attendance.checkIn.useMutation();
  const checkOutMutation = trpc.attendance.checkOut.useMutation();

  useEffect(() => {
    // Find today's attendance record
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayRecord = attendanceRecords?.find((record: any) => {
      const recordDate = new Date(record.date);
      recordDate.setHours(0, 0, 0, 0);
      return recordDate.getTime() === today.getTime();
    });

    setTodayAttendance(todayRecord || null);
    setIsLoading(false);
  }, [attendanceRecords]);

  const handleCheckIn = async () => {
    try {
      await checkInMutation.mutateAsync({ studentId });
      refetch();
    } catch (error) {
      console.error("Erro ao registrar entrada:", error);
    }
  };

  const handleCheckOut = async () => {
    if (!todayAttendance) return;
    try {
      await checkOutMutation.mutateAsync({ attendanceId: todayAttendance.id });
      refetch();
    } catch (error) {
      console.error("Erro ao registrar saída:", error);
    }
  };

  const calculateHours = (checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut) return "0h";
    const start = new Date(checkIn).getTime();
    const end = new Date(checkOut).getTime();
    const hours = Math.floor((end - start) / (1000 * 60 * 60));
    const minutes = Math.floor(((end - start) % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Registro de Ponto</h1>
          <p className="text-gray-600 mt-1">Registre sua entrada e saída diária</p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-8 px-6">
        {/* Today's Attendance */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Ponto de Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-gray-600">Carregando...</p>
            ) : todayAttendance ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Entrada</p>
                    <p className="text-2xl font-bold">
                      {todayAttendance.checkInTime
                        ? new Date(todayAttendance.checkInTime).toLocaleTimeString("pt-BR")
                        : "-"}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Saída</p>
                    <p className="text-2xl font-bold">
                      {todayAttendance.checkOutTime
                        ? new Date(todayAttendance.checkOutTime).toLocaleTimeString("pt-BR")
                        : "-"}
                    </p>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total de Horas</p>
                  <p className="text-2xl font-bold">
                    {calculateHours(todayAttendance.checkInTime, todayAttendance.checkOutTime)}
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button disabled className="flex-1">
                    ✓ Entrada Registrada
                  </Button>
                  {todayAttendance.checkOutTime ? (
                    <Button disabled className="flex-1">
                      ✓ Saída Registrada
                    </Button>
                  ) : (
                    <Button onClick={handleCheckOut} className="flex-1">
                      Registrar Saída
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600">Você ainda não registrou entrada hoje</p>
                <Button onClick={handleCheckIn} size="lg" className="w-full">
                  Registrar Entrada
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attendance History */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Ponto</CardTitle>
          </CardHeader>
          <CardContent>
            {attendanceRecords && attendanceRecords.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold">Data</th>
                      <th className="text-left py-3 px-4 font-semibold">Entrada</th>
                      <th className="text-left py-3 px-4 font-semibold">Saída</th>
                      <th className="text-left py-3 px-4 font-semibold">Total</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.map((record: any) => (
                      <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          {new Date(record.date).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="py-3 px-4">
                          {record.checkInTime
                            ? new Date(record.checkInTime).toLocaleTimeString("pt-BR")
                            : "-"}
                        </td>
                        <td className="py-3 px-4">
                          {record.checkOutTime
                            ? new Date(record.checkOutTime).toLocaleTimeString("pt-BR")
                            : "-"}
                        </td>
                        <td className="py-3 px-4">
                          {calculateHours(record.checkInTime, record.checkOutTime)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            record.status === "present"
                              ? "bg-green-100 text-green-800"
                              : record.status === "absent"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {record.status === "present" && "Presente"}
                            {record.status === "absent" && "Ausente"}
                            {record.status === "late" && "Atrasado"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">Nenhum registro de ponto</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

