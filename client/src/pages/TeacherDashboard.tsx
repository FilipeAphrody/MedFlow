import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Supervisão de Alunos</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-8 px-6">
        <Card>
          <CardHeader>
            <CardTitle>Alunos Supervisionados</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Nenhum aluno supervisionado</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
