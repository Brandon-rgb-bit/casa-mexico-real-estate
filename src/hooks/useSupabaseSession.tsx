
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserWithRole {
  id: string;
  email?: string;
  rol: string;
  [key: string]: any;
}

export function useSupabaseSession() {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Nueva función para actualizar estado de usuario y loading
  const updateUserWithRole = async (sessionUser: any) => {
    if (!sessionUser) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      // Buscar desde tabla roles
      const { data: roleData, error: roleError } = await supabase
        .from("roles")
        .select("rol")
        .eq("user_id", sessionUser.id)
        .maybeSingle();

      let rol: string;
      if (roleData?.rol) {
        rol = roleData.rol;
      } else {
        rol = sessionUser.user_metadata?.rol || "usuario";
      }
      setUser({ ...sessionUser, rol });
    } catch (err) {
      setUser({ ...sessionUser, rol: "usuario" });
      console.error("Fallo al obtener/establecer el rol:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    // Suscripción a cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sessionChange) => {
      if (!mounted) return;
      setSession(sessionChange);
      if (sessionChange?.user) {
        updateUserWithRole(sessionChange.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    // Sesión inicial
    async function checkInitial() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getSession:", error);
          setUser(null);
          setLoading(false);
          return;
        }
        setSession(data.session);
        if (data.session?.user) {
          updateUserWithRole(data.session.user);
        } else {
          setUser(null);
          setLoading(false);
        }
      } catch (err) {
        setUser(null);
        console.error("Excepción en getSession:", err);
        setLoading(false);
      }
    }
    checkInitial();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { session, user, loading };
}
