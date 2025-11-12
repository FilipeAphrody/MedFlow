import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { useLocation } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Carregando...</h1>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    // Redirect to appropriate dashboard based on role
    const dashboards: Record<string, string> = {
      admin: "/admin",
      receptionist: "/reception",
      doctor: "/medical-records",
      teacher: "/teacher",
      student: "/student",
    };

    const dashboardUrl = dashboards[user.role] || "/";

    return (
      <div className="min-h-screen flex flex-col">
        <header className="bg-blue-600 text-white py-4 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              {APP_LOGO && <img src={APP_LOGO} alt="Logo" className="h-8 w-8" />}
              <h1 className="text-2xl font-bold">{APP_TITLE}</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm">Bem-vindo, {user.name || "Usuário"}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logout();
                  setLocation("/");
                }}
              >
                Sair
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 bg-gray-50">
          <div className="max-w-7xl mx-auto py-12 px-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-3xl font-bold mb-6">Bem-vindo ao MedFlow</h2>
              <p className="text-gray-600 mb-8">
                Sistema de gestão clínica para clínicas médicas e clínicas-escola.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Receptionist Dashboard */}
                {(user.role === "receptionist" || user.role === "admin") && (
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <h3 className="text-xl font-semibold mb-2">Recepção</h3>
                    <p className="text-gray-600 mb-4">
                      Gerencie pacientes, agende consultas e visualize a agenda.
                    </p>
                    <Button
                      onClick={() => setLocation("/reception")}
                      className="w-full"
                    >
                      Ir para Recepção
                    </Button>
                  </div>
                )}

                {/* Doctor Dashboard */}
                {(user.role === "doctor" || user.role === "teacher" || user.role === "admin") && (
                  <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                    <h3 className="text-xl font-semibold mb-2">Registros Médicos</h3>
                    <p className="text-gray-600 mb-4">
                      Registre atendimentos e gerencie prontuários de pacientes.
                    </p>
                    <Button
                      onClick={() => setLocation("/medical-records")}
                      className="w-full"
                    >
                      Ir para Registros
                    </Button>
                  </div>
                )}

                {/* Student Dashboard */}
                {(user.role === "student" || user.role === "admin") && (
                  <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                    <h3 className="text-xl font-semibold mb-2">Meu Estágio</h3>
                    <p className="text-gray-600 mb-4">
                      Registre ponto, visualize seu desempenho e envie relatórios.
                    </p>
                    <Button
                      onClick={() => setLocation("/student")}
                      className="w-full"
                    >
                      Ir para Estágio
                    </Button>
                  </div>
                )}

                {/* Teacher Dashboard */}
                {(user.role === "teacher" || user.role === "admin") && (
                  <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                    <h3 className="text-xl font-semibold mb-2">Supervisão</h3>
                    <p className="text-gray-600 mb-4">
                      Acompanhe alunos e avalie relatórios acadêmicos.
                    </p>
                    <Button
                      onClick={() => setLocation("/teacher")}
                      className="w-full"
                    >
                      Ir para Supervisão
                    </Button>
                  </div>
                )}

                {/* Admin Dashboard */}
                {user.role === "admin" && (
                  <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                    <h3 className="text-xl font-semibold mb-2">Administração</h3>
                    <p className="text-gray-600 mb-4">
                      Gerencie usuários, salas e visualize estatísticas da clínica.
                    </p>
                    <Button
                      onClick={() => setLocation("/admin")}
                      className="w-full"
                    >
                      Ir para Admin
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Not authenticated - show login
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          {APP_LOGO && <img src={APP_LOGO} alt="Logo" className="h-8 w-8" />}
          <h1 className="text-2xl font-bold">{APP_TITLE}</h1>
        </div>
      </header>

      <main className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h2 className="text-3xl font-bold text-center mb-2">MedFlow</h2>
          <p className="text-gray-600 text-center mb-8">
            Sistema de gestão clínica para clínicas médicas e clínicas-escola
          </p>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Faça login para acessar o sistema e gerenciar suas atividades clínicas e acadêmicas.
            </p>

            <Button
              size="lg"
              className="w-full"
              onClick={() => {
                window.location.href = getLoginUrl();
              }}
            >
              Entrar com Manus
            </Button>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="font-semibold mb-4">Funcionalidades Principais:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✓ Cadastro e gestão de pacientes</li>
              <li>✓ Agenda digital de consultas</li>
              <li>✓ Prontuários eletrônicos</li>
              <li>✓ Controle de ponto de alunos</li>
              <li>✓ Relatórios acadêmicos</li>
              <li>✓ Estatísticas de produtividade</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

