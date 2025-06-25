
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import UserTable from "@/components/admin/UserTable";
import PublicacionesTable from "@/components/admin/PublicacionesTable";
import { useToast } from "@/components/ui/use-toast";

type UserData = {
  id: string;
  nombre: string;
  telefono: string;
  rol: string;
  limite: number;
  vigencia_hasta: string | null;
};

type Publicacion = {
  id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  tipo_publicacion: string;
  imagenes: string[];
  fecha_creacion: string;
  aprobada: boolean;
  estados: { nombre: string };
  municipios: { nombre: string };
  categorias: { nombre: string };
};

const AdminPanel = () => {
  const [usersData, setUsersData] = useState<UserData[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [loadingPublicaciones, setLoadingPublicaciones] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsersData();
    fetchPublicaciones();
    // eslint-disable-next-line
  }, []);

  const fetchUsersData = async () => {
    setLoadingUsers(true);
    try {
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id");
      if (usersError || !users) {
        setUsersData([]);
        setLoadingUsers(false);
        return;
      }
      const list = await Promise.all(
        users.map(async (user: any) => {
          const { data: roleRow } = await supabase
            .from("roles")
            .select("rol, nombre, telefono")
            .eq("user_id", user.id)
            .maybeSingle();

          const { data: limiteRow } = await supabase
            .from("limites")
            .select("limite, vigencia_hasta")
            .eq("user_id", user.id)
            .maybeSingle();

          return {
            id: user.id,
            rol: roleRow?.rol ?? "usuario",
            nombre: roleRow?.nombre ?? "Sin nombre",
            telefono: roleRow?.telefono ?? "Sin teléfono",
            limite: limiteRow?.limite ?? 1,
            vigencia_hasta: limiteRow?.vigencia_hasta ?? null,
          };
        })
      );
      setUsersData(list);
    } catch (error) {
      setUsersData([]);
    }
    setLoadingUsers(false);
  };

  const fetchPublicaciones = async () => {
    setLoadingPublicaciones(true);
    try {
      const { data, error } = await supabase
        .from("publicaciones")
        .select(`
          *,
          estados (nombre),
          municipios (nombre),
          categorias (nombre)
        `)
        .order("fecha_creacion", { ascending: false });

      setPublicaciones(data || []);
    } catch (error) {
      setPublicaciones([]);
    }
    setLoadingPublicaciones(false);
  };

  if (loadingUsers || loadingPublicaciones) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Administración</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Usuarios</h2>
        <UserTable usersData={usersData} fetchUsers={fetchUsersData} />
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Publicaciones</h2>
        <PublicacionesTable publicaciones={publicaciones} />
      </section>
    </div>
  );
};

export default AdminPanel;
