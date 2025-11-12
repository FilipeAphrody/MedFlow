import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StudentReports() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold">Meus Relatórios</h1>
          <Button>Novo Relatório</Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-8 px-6">
        <Card>
          <CardHeader>
            <CardTitle>Relatórios Acadêmicos</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Nenhum relatório enviado</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
