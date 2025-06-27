
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import PublicationCard from "@/components/PublicationCard";
import PublicationDetailModal from "@/components/PublicationDetailModal";
import ListadoFilters from "@/components/ListadoFilters";

type Publicacion = {
  id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  tipo_publicacion: string;
  imagenes: string[];
  frecuencia_pago?: string | null;
  condicion?: string | null;
  fecha_creacion: string;
  estados: { nombre: string };
  municipios: { nombre: string };
  categorias: { nombre: string };
  user_id?: string;
};

const ListadoPage = () => {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPublication, setSelectedPublication] = useState<Publicacion | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filtros, setFiltros] = useState({
    busqueda: "",
    tipo: "",
    categoria: "",
    estado: "",
    municipio: "",
    condicion: "",
  });
  const [busquedaId, setBusquedaId] = useState("");

  useEffect(() => {
    fetchPublicaciones();
  }, []);

  const fetchPublicaciones = async () => {
    try {
      const { data, error } = await supabase
        .from("publicaciones")
        .select(
          `
          *,
          estados (nombre),
          municipios (nombre),
          categorias (nombre)
        `
        )
        .eq("aprobada", true)
        .order("fecha_creacion", { ascending: false });

      if (error) {
        console.error("Error fetching publications:", error);
      } else {
        setPublicaciones(data || []);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Únicos para selects
  const categorias = [...new Set(publicaciones.map((p) => p.categorias?.nombre).filter(Boolean))];
  const estados = [...new Set(publicaciones.map((p) => p.estados?.nombre).filter(Boolean))];
  const municipios = [...new Set(publicaciones.map((p) => p.municipios?.nombre).filter(Boolean))];
  const condiciones = [...new Set(publicaciones.map((p) => p.condicion).filter(Boolean))];

  // Filtrado mejorado para incluir búsqueda por user_id
  const filteredPublicaciones = publicaciones.filter((pub) => {
    if (busquedaId.trim().length > 0) {
      const searchTerm = busquedaId.trim().toLowerCase();
      return pub.id.toLowerCase().includes(searchTerm) ||
             (pub.user_id && pub.user_id.toLowerCase().includes(searchTerm));
    }
    const matchesBusqueda =
      pub.titulo.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      pub.descripcion.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      pub.categorias?.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase());
    const matchesTipo = !filtros.tipo || pub.tipo_publicacion === filtros.tipo;
    const matchesCategoria = !filtros.categoria || pub.categorias?.nombre === filtros.categoria;
    const matchesEstado = !filtros.estado || pub.estados?.nombre === filtros.estado;
    const matchesMunicipio = !filtros.municipio || pub.municipios?.nombre === filtros.municipio;
    const matchesCondicion = !filtros.condicion || pub.condicion === filtros.condicion;

    return (
      matchesBusqueda &&
      matchesTipo &&
      matchesCategoria &&
      matchesEstado &&
      matchesMunicipio &&
      matchesCondicion
    );
  });

  const handleContactar = (telefono?: string) => {
    if (telefono) {
      window.open(`https://wa.me/${telefono}`, "_blank");
    } else {
      alert("Número de teléfono no disponible");
    }
  };

  const handleViewDetails = (pub: Publicacion) => {
    setSelectedPublication(pub);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPublication(null);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto mt-8 p-6">
        <div className="text-center">Cargando publicaciones...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Catálogo Completo de Inmuebles
      </h1>

      <ListadoFilters
        busquedaId={busquedaId}
        setBusquedaId={setBusquedaId}
        filtros={filtros}
        setFiltros={setFiltros}
        categorias={categorias}
        estados={estados}
        municipios={municipios}
        condiciones={condiciones}
        disabled={busquedaId.trim().length > 0}
      />

      <div className="mb-4 text-gray-600 dark:text-gray-300">
        <span className="font-semibold">{filteredPublicaciones.length}</span> publicaciones encontradas
      </div>

      {/* Grid de publicaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPublicaciones.map((pub) => (
          <PublicationCard
            key={pub.id}
            pub={pub}
            onContactar={handleContactar}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {filteredPublicaciones.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No se encontraron publicaciones que coincidan con los filtros seleccionados.
          </p>
        </div>
      )}

      {/* Modal de detalles */}
      <PublicationDetailModal
        pub={selectedPublication}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onContactar={handleContactar}
      />
    </div>
  );
};

export default ListadoPage;
