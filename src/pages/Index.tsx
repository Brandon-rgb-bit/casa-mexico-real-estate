
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";
import { Search } from "lucide-react";
import FeaturedPublicationCard from "@/components/FeaturedPublicationCard";
import PublicationDetailModal from "@/components/PublicationDetailModal";
import { useFeaturedPublications } from "@/hooks/useFeaturedPublications";
import { Publication } from "@/types/Publication";

const Index = () => {
  const { user } = useSupabaseSession();
  const [busqueda, setBusqueda] = useState("");
  const [busquedaId, setBusquedaId] = useState(""); // filtro por id
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { publicaciones, loading } = useFeaturedPublications();

  // Actualiza la lógica de filtrado basada en los props incluyendo user_id
  const filteredPublicaciones = publicaciones.filter((pub) => {
    if (busquedaId.trim().length > 0) {
      const searchTerm = busquedaId.trim().toLowerCase();
      return pub.id.toLowerCase().includes(searchTerm) ||
             (pub.user_id && pub.user_id.toLowerCase().includes(searchTerm));
    }
    return (
      pub.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      pub.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      pub.categorias?.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
  });

  const handleContactar = (telefono?: string | number) => {
    if (telefono) {
      window.open(`https://wa.me/${telefono}`, "_blank");
    } else {
      alert("Número de teléfono no disponible");
    }
  };

  const handleViewDetails = (pub: Publication) => {
    setSelectedPublication(pub);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPublication(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Cargando publicaciones destacadas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-green-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">Inmuebles MX</h1>
          <p className="text-xl mb-8">
            La plataforma líder para compra, venta y renta de inmuebles en México
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            {/* Nuevo filtro de búsqueda por ID */}
            <div className="relative flex-1 w-full max-w-[180px]">
              <Input
                placeholder="Buscar por ID"
                value={busquedaId}
                onChange={(e) => setBusquedaId(e.target.value)}
                className="py-3 text-lg"
                maxLength={36}
                autoComplete="off"
              />
            </div>
            {/* Búsqueda por texto normal */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar Casa, Departamento, Oficina, etc..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10 py-3 text-lg"
                autoComplete="off"
                disabled={busquedaId.trim().length > 0}
              />
            </div>
            {!user && (
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="whitespace-nowrap">
                  Publicar Gratis
                </Button>
              </Link>
            )}
            {user && (
              <Link to="/publicar">
                <Button size="lg" variant="secondary" className="whitespace-nowrap">
                  Publicar Gratis
                </Button>
              </Link>
            )}
          </div>
          <div className="mt-2">
            {busquedaId && (
              <span className="text-sm bg-white/10 text-white px-3 py-1 rounded">Filtrando por ID</span>
            )}
          </div>
        </div>
      </div>
      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center bg-white shadow-lg">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {publicaciones.length}
              </div>
              <p className="text-gray-600">Anuncios Activos</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-white shadow-lg">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
              <p className="text-gray-600">Disponibilidad</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-white shadow-lg">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">100%</div>
              <p className="text-gray-600">Verificado</p>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Publicaciones Destacadas / Espacio disponible */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Inmuebles Destacados
          </h2>
          <Link to="/listado">
            <Button variant="outline">Ver Todo</Button>
          </Link>
        </div>
        {filteredPublicaciones.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center py-16 transition bg-yellow-50 dark:bg-[#22220f] border-2 border-dashed border-yellow-400 rounded-xl">
            <div className="text-3xl font-bold mb-4 text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
              Espacio destacado disponible
            </div>
            <div className="text-lg mb-6 text-gray-700 dark:text-gray-300 max-w-md mx-auto text-center">
              ¿Quieres que tu inmueble aparezca aquí? 
              <br />
              <span className="font-semibold">Contácta al administrador</span> por WhatsApp para información sobre espacios destacados.
            </div>
            <a
              href="https://wa.me/7717789580"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex gap-2 items-center px-6 py-3 bg-green-600 hover:bg-green-700 transition rounded-xl shadow-md text-white font-bold text-xl"
            >
              WhatsApp: 7717789580
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPublicaciones.slice(0, 6).map((pub) => (
              <FeaturedPublicationCard
                key={pub.id}
                pub={pub}
                onContactar={handleContactar}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>
      {/* CTA Section */}
      {!user && (
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h3 className="text-3xl font-bold mb-4">
              ¿Tienes inmuebles para vender o rentar?
            </h3>
            <p className="text-xl mb-8">
              Únete a miles de anunciantes y llega a más clientes
            </p>
            <Link to="/auth">
              <Button size="lg" variant="secondary">
                Registrarse Gratis
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Footer Section - EDITABLE */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Columna 1 - Logo y descripción */}
            <div className="col-span-1 md:col-span-2">
              {/* Logo y título */}
              <h3 className="text-2xl font-bold mb-4">Inmuebles MX</h3>
              {/* Descripción de la empresa */}
              <p className="text-gray-300 mb-4">
                La plataforma líder para compra venta y renta de inmuebles en México. 
                Conectamos vendedores y compradores de manera segura y eficiente.
              </p>
              {/* Redes sociales - Descomenta y edita los enlaces */}
              {/*
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Facebook
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Twitter
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Instagram
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  LinkedIn
                </a>
              </div>
              */}
            </div>

            {/* Columna 2 - Enlaces rápidos */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2">
                {/* Edita estos enlaces según tus necesidades */}
                <li>
                  <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link to="/listado" className="text-gray-300 hover:text-white transition-colors">
                    Ver Inmuebles
                  </Link>
                </li>
                <li>
                  <Link to="/destacados" className="text-gray-300 hover:text-white transition-colors">
                    Destacados
                  </Link>
                </li>
                {/* Descomenta si quieres agregar más enlaces */}
                {/*
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    Sobre Nosotros
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    Contacto
                  </a>
                </li>
                */}
              </ul>
            </div>

            {/* Columna 3 - Información de contacto */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <div className="space-y-2 text-gray-300">
                {/* Edita la información de contacto */}
                <p>WhatsApp: 7717789580</p>
                {/* Descomenta y edita según necesites */}
                {/*
                <p>Email: info@maquinariamx.com</p>
                <p>Teléfono: +52 123 456 7890</p>
                <p>
                  Dirección: Calle Principal #123,<br />
                  Ciudad de México, CDMX
                </p>
                */}
              </div>
            </div>
          </div>

          {/* Línea divisoria */}
          <hr className="border-gray-700 my-8" />

          {/* Copyright y enlaces legales */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-300 text-sm">
              {/* Edita el año y nombre de la empresa */}
              © 2024 Inmuebles MX. Todos los derechos reservados.
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              {/* Descomenta y edita los enlaces legales según necesites */}
              {/*
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                Términos y Condiciones
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                Política de Privacidad
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                Cookies
              </a>
              */}
            </div>
          </div>
        </div>
      </footer>

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

export default Index;
