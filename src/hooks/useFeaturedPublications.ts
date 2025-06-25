
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Publication } from "@/types/Publication";

export function useFeaturedPublications() {
  const [publicaciones, setPublicaciones] = useState<Publication[]>([]);
  const [destacadasIds, setDestacadasIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDestacadas();
  }, []);

  const fetchDestacadas = async () => {
    setLoading(true);
    try {
      const { data: destacados, error: destError } = await supabase
        .from("destacados")
        .select("publicacion_id,is_active")
        .eq("is_active", true);
      if (destError) {
        setDestacadasIds([]);
        setLoading(false);
        return;
      }
      const ids = destacados ? destacados.map((d: any) => d.publicacion_id) : [];
      setDestacadasIds(ids);

      if (ids.length > 0) {
        await fetchPublicacionesDestacadas(ids);
      } else {
        setPublicaciones([]);
        setLoading(false);
      }
    } catch (error) {
      setDestacadasIds([]);
      setPublicaciones([]);
      setLoading(false);
    }
  };

  const fetchPublicacionesDestacadas = async (ids: string[]) => {
    try {
      const { data, error } = await supabase
        .from("publicaciones")
        .select(
          "id,titulo,descripcion,precio,tipo_publicacion,imagenes,frecuencia_pago,condicion,fecha_creacion,estados (nombre),municipios (nombre),categorias (nombre),telefono,user_id"
        )
        .in("id", ids)
        .eq("aprobada", true);

      if (error) {
        setPublicaciones([]);
      } else {
        const publicationsData = data || [];
        const ordenadas = ids
          .map((id) => publicationsData.find((d) => d.id === id))
          .filter(Boolean)
          .map((p) => ({
            ...p,
            telefono: p.telefono ? String(p.telefono) : null,
          }));

        setPublicaciones(ordenadas as unknown as Publication[]);
      }
    } catch {
      setPublicaciones([]);
    } finally {
      setLoading(false);
    }
  };

  return { publicaciones, destacadasIds, loading };
}
