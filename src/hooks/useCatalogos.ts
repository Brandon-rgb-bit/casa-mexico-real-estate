
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Hook para estados, municipios, categorías
export function useCatalogos() {
  // Estados
  const { data: estados, isLoading: loadingEstados } = useQuery({
    queryKey: ["estados"],
    queryFn: async () =>
      supabase.from("estados").select("*").then(r => r.data || []),
  });

  // Categorías
  const { data: categorias, isLoading: loadingCategorias } = useQuery({
    queryKey: ["categorias"],
    queryFn: async () =>
      supabase.from("categorias").select("*").then(r => r.data || []),
  });

  // Municipios, solo se consultan con estado_id
  const getMunicipiosByEstado = async (estado_id: number) => {
    const { data } = await supabase
      .from("municipios")
      .select("*")
      .eq("estado_id", estado_id)
      .order("nombre");
    return data || [];
  };

  return { estados, loadingEstados, categorias, loadingCategorias, getMunicipiosByEstado };
}
