
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "@/pages/Auth";
import ListadoPage from "@/pages/Listado";
import PublicarPage from "@/pages/Publicar";
import MisPublicacionesPage from "@/pages/MisPublicaciones";
import AdminPanel from "@/pages/Admin";
import ComprobantePage from "@/pages/Comprobante";
import { NavBar } from "@/components/NavBar";
import { ThemeProvider } from "next-themes";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";
import DestacadosPage from "@/pages/Destacados";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";

const queryClient = new QueryClient();

const App = () => {
  const { user, loading } = useSupabaseSession();

  if (loading) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg">Cargando...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <NavBar user={user} />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/listado" element={<ListadoPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/publicar" element={<PublicarPage />} />
              <Route path="/mis-publicaciones" element={<MisPublicacionesPage />} />
              <Route path="/destacados" element={<DestacadosPage />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedAdminRoute>
                    <AdminPanel />
                  </ProtectedAdminRoute>
                } 
              />
              <Route path="/comprobante" element={<ComprobantePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
