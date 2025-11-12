import { Button } from "@/components/ui/button";
import { useLocation, useRoute } from "wouter";

export default function PatientDetail() {
  const [, params] = useRoute("/patients/:id");
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" onClick={() => setLocation("/patients")}>← Voltar</Button>
          <h1 className="text-3xl font-bold mt-4">Detalhes do Paciente</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-8 px-6">
        <p>Paciente ID: {params?.id}</p>
      </main>
    </div>
  );
}
