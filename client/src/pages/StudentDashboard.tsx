import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function StudentDashboard() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Meu Estágio</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-8 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Button variant="outline" size="lg" onClick={() => setLocation("/attendance")}>
            Registrar Ponto
          </Button>
          <Button variant="outline" size="lg" onClick={() => setLocation("/my-reports")}>
            Meus Relatórios
          </Button>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Horas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0h</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
