import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import DashboardLayout from "./components/DashboardLayout";
import ReceptionDashboard from "./pages/ReceptionDashboard";
import PatientsList from "./pages/PatientsList";
import PatientDetail from "./pages/PatientDetail";
import AppointmentSchedule from "./pages/AppointmentSchedule";
import MedicalRecords from "./pages/MedicalRecords";
import StudentDashboard from "./pages/StudentDashboard";
import StudentAttendance from "./pages/StudentAttendance";
import StudentReports from "./pages/StudentReports";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { useAuth } from "./_core/hooks/useAuth";

function ProtectedRoute({ component: Component, requiredRole }: any) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  if (!user) {
    return <NotFound />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <NotFound />;
  }

  return <Component />;
}

function Router() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  // Routes based on user role
  if (user) {
    return (
      <Switch>
        {/* Reception Routes */}
        {(user.role === "receptionist" || user.role === "admin") && (
          <>
            <Route path="/reception" component={ReceptionDashboard} />
            <Route path="/patients" component={PatientsList} />
            <Route path="/patients/:id" component={PatientDetail} />
            <Route path="/appointments" component={AppointmentSchedule} />
          </>
        )}

        {/* Doctor/Teacher Routes */}
        {(user.role === "doctor" || user.role === "teacher" || user.role === "admin") && (
          <>
            <Route path="/medical-records" component={MedicalRecords} />
            <Route path="/appointments" component={AppointmentSchedule} />
          </>
        )}

        {/* Student Routes */}
        {(user.role === "student" || user.role === "admin") && (
          <>
            <Route path="/student" component={StudentDashboard} />
            <Route path="/attendance" component={StudentAttendance} />
            <Route path="/my-reports" component={StudentReports} />
          </>
        )}

        {/* Teacher/Supervisor Routes */}
        {(user.role === "teacher" || user.role === "admin") && (
          <>
            <Route path="/teacher" component={TeacherDashboard} />
          </>
        )}

        {/* Admin Routes */}
        {user.role === "admin" && (
          <>
            <Route path="/admin" component={AdminDashboard} />
          </>
        )}

        {/* Default route */}
        <Route path="/" component={Home} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Public routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

