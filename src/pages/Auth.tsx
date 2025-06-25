import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

const AuthPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [authType, setAuthType] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAndRedirect = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
        }
        if (mounted) {
          if (session?.user) {
            navigate("/", { replace: true });
          } else {
            setCheckingSession(false);
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
        if (mounted) {
          setCheckingSession(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          if (session?.user) {
            navigate("/", { replace: true });
          } else if (event === 'SIGNED_OUT') {
            setCheckingSession(false);
          }
        }
      }
    );

    checkAndRedirect();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  // --- Helpers para actualizar cada tabla (pueden moverse a un archivo aparte si lo prefieres)
  async function updateUserDetails(userId: string, nombre: string, telefono: string, email: string) {
    const { error } = await supabase
      .from("users")
      .update({
        nombre,
        telefono,
        email: email.trim(),
      })
      .eq("id", userId);
    if (error) throw error;
  }

  async function updateLimiteEmail(userId: string, email: string) {
    const { error } = await supabase
      .from("limites")
      .update({
        email: email.trim(),
      })
      .eq("user_id", userId);
    if (error) throw error;
  }

  async function updateRoleDetails(userId: string, nombre: string, telefono: string) {
    const { error } = await supabase
      .from("roles")
      .update({
        nombre,
        telefono,
      })
      .eq("user_id", userId);
    if (error) throw error;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !email.trim() ||
      !password.trim() ||
      (authType === "register" && (!nombre.trim() || !telefono.trim()))
    ) {
      toast.error("Todos los campos son requeridos");
      return;
    }

    setLoading(true);

    try {
      if (authType === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          toast.error("Error de inicio de sesión: " + error.message);
        } else {
          toast.success("Sesión iniciada");
        }
      } else {
        const redirectTo = `${window.location.origin}/`;

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: redirectTo,
            data: {
              nombre: nombre.trim(),
              telefono: telefono.trim(),
              email: email.trim(),
            },
          },
        });

        if (error) {
          toast.error("Error al registrarse: " + error.message);
        } else {
          toast.success("Registro exitoso. Revisa tu email para confirmar.");
          setAuthType("login");
        }
      }
    } catch (error) {
      toast.error("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-background/70">
        <div className="text-center">
          <p className="text-lg">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-background/70">
      <div className="p-6 rounded shadow w-full max-w-sm bg-white dark:bg-zinc-950">
        <h1 className="text-lg font-bold mb-4 text-center text-gray-900 dark:text-white">
          {authType === "login" ? "Iniciar Sesión" : "Registro"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          {authType === "register" && (
            <>
              <Input
                placeholder="Nombre completo"
                type="text"
                autoComplete="name"
                value={nombre}
                required
                onChange={(e) => setNombre(e.target.value)}
                className="dark:bg-gray-800 dark:text-white"
              />
              <Input
                placeholder="Teléfono"
                type="tel"
                autoComplete="tel"
                value={telefono}
                required
                onChange={(e) => setTelefono(e.target.value)}
                className="dark:bg-gray-800 dark:text-white"
              />
            </>
          )}
          <Input
            placeholder="correo@ejemplo.com"
            type="email"
            autoComplete="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="dark:bg-gray-800 dark:text-white"
          />
          <Input
            placeholder="Contraseña"
            type="password"
            autoComplete={authType === "login" ? "current-password" : "new-password"}
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="dark:bg-gray-800 dark:text-white"
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Cargando..." : authType === "login" ? "Entrar" : "Registrar"}
          </Button>
        </form>
        <div className="text-center mt-4">
          {authType === "login" ? (
            <>
              <span className="text-gray-600 dark:text-gray-300">¿No tienes cuenta? </span>
              <button
                className="text-blue-600 hover:underline dark:text-blue-400"
                onClick={() => setAuthType("register")}
              >
                Regístrate
              </button>
            </>
          ) : (
            <>
              <span className="text-gray-600 dark:text-gray-300">¿Ya tienes cuenta? </span>
              <button
                className="text-blue-600 hover:underline dark:text-blue-400"
                onClick={() => setAuthType("login")}
              >
                Entrar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
