
import React, { useState } from "react";
import { useFeaturedPublications } from "@/hooks/useFeaturedPublications";
import PublicationCard from "@/components/PublicationCard";
import PublicationDetailModal from "@/components/PublicationDetailModal";
import ListadoFilters from "@/components/ListadoFilters";
import { toast } from "@/components/ui/sonner";

const DestacadosPage = () => {
  const { publicaciones, loading } = useFeaturedPublications();
  const [selectedPublication, setSelectedPublication] = useState<any>(null);
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

  const handleContactar = (telefono?: string) => {
    if (telefono) {
      window.open(`https://wa.me/${telefono}`, "_blank");
    } else {
      toast.error("Número de teléfono no disponible.");
    }
  };

  const handleViewDetails = (pub: any) => {
    setSelectedPublication(pub);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPublication(null);
  };

  // Únicos para selects
  const categorias = [...new Set(publicaciones.map((p) => p.categorias?.nombre).filter(Boolean))];
  const estados = [...new Set(publicaciones.map((p) => p.estados?.nombre).filter(Boolean))];
  const municipios = [...new Set(publicaciones.map((p) => p.municipios?.nombre).filter(Boolean))];
  const condiciones = [...new Set(publicaciones.map((p) => p.condicion).filter(Boolean))];

  const filteredPublicaciones = publicaciones.filter((pub) => {
    if (busquedaId.trim().length > 0) {
      return pub.id.toLowerCase().includes(busquedaId.trim().toLowerCase());
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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto mt-8 p-6">
        <div className="text-center">
          <p className="text-lg">Cargando publicaciones destacadas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Publicaciones Destacadas
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
        <span className="font-semibold">{filteredPublicaciones.length}</span> publicaciones destacadas encontradas
      </div>

      {filteredPublicaciones.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {publicaciones.length === 0 
              ? "No hay publicaciones destacadas en este momento."
              : "No se encontraron publicaciones destacadas que coincidan con los filtros seleccionados."
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPublicaciones.map((pub) => (
            <PublicationCard
              key={pub.id}
              pub={pub as any}
              onContactar={handleContactar}
              onViewDetails={handleViewDetails}
            />
          ))}
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

export default DestacadosPage;
