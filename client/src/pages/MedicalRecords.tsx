import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function MedicalRecords() {
  const { data: patients } = trpc.patients.list.useQuery();
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const createRecordMutation = trpc.medicalRecords.create.useMutation();

  const [formData, setFormData] = useState({
    complaint: "",
    diagnosis: "",
    treatment: "",
    prescription: "",
    notes: "",
  });

  const selectedPatient = patients?.find((p: any) => p.id === selectedPatientId);
  const { data: records, refetch } = trpc.medicalRecords.getByPatient.useQuery(
    { patientId: selectedPatientId || 0 },
    { enabled: !!selectedPatientId }
  );

  const filteredPatients = patients?.filter((patient: any) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.cpf.includes(searchTerm)
  ) || [];

  const handleCreateRecord = async () => {
    if (!selectedPatientId) return;
    try {
      await createRecordMutation.mutateAsync({
        appointmentId: 1, // TODO: Link to actual appointment
        patientId: selectedPatientId,
        complaint: formData.complaint,
        diagnosis: formData.diagnosis,
        treatment: formData.treatment,
        prescription: formData.prescription,
        notes: formData.notes,
      });
      setShowCreateDialog(false);
      setFormData({
        complaint: "",
        diagnosis: "",
        treatment: "",
        prescription: "",
        notes: "",
      });
      refetch();
    } catch (error) {
      console.error("Erro ao criar registro:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Registros Médicos</h1>
          <p className="text-gray-600 mt-1">Gerencie prontuários dos pacientes</p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-8 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Pacientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="Buscar paciente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredPatients.map((patient: any) => (
                  <button
                    key={patient.id}
                    onClick={() => setSelectedPatientId(patient.id)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                      selectedPatientId === patient.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className="font-semibold text-sm">{patient.name}</p>
                    <p className="text-xs text-gray-600">{patient.cpf}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Patient Records */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>
                {selectedPatient ? `Prontuário - ${selectedPatient.name}` : "Selecione um paciente"}
              </CardTitle>
              {selectedPatient && (
                <Button size="sm" onClick={() => setShowCreateDialog(true)}>
                  Novo Registro
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {!selectedPatient ? (
                <p className="text-gray-600">Selecione um paciente para visualizar os registros</p>
              ) : records && records.length > 0 ? (
                <div className="space-y-4">
                  {records.map((record: any) => (
                    <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-semibold text-gray-600">Queixa Principal</p>
                          <p>{record.complaint || "-"}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-600">Diagnóstico</p>
                          <p>{record.diagnosis || "-"}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-600">Tratamento</p>
                          <p>{record.treatment || "-"}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-600">Prescrição</p>
                          <p>{record.prescription || "-"}</p>
                        </div>
                        {record.notes && (
                          <div className="col-span-2">
                            <p className="font-semibold text-gray-600">Observações</p>
                            <p>{record.notes}</p>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-4">
                        {new Date(record.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Nenhum registro encontrado</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Create Record Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo Registro Médico</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Queixa Principal</Label>
              <Input
                value={formData.complaint}
                onChange={(e) => setFormData({ ...formData, complaint: e.target.value })}
                placeholder="Descreva a queixa do paciente"
              />
            </div>
            <div>
              <Label>Diagnóstico</Label>
              <Input
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                placeholder="Diagnóstico identificado"
              />
            </div>
            <div>
              <Label>Tratamento</Label>
              <textarea
                value={formData.treatment}
                onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                placeholder="Descreva o tratamento recomendado"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>
            <div>
              <Label>Prescrição</Label>
              <textarea
                value={formData.prescription}
                onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
                placeholder="Medicamentos e dosagens"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>
            <div>
              <Label>Observações</Label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Observações adicionais"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={2}
              />
            </div>

            <div className="flex gap-4 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreateRecord}>
                Salvar Registro
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

