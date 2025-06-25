import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, MessageCircle, Calendar, Tag, Info, X, ChevronLeft, ChevronRight } from "lucide-react";
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
  estados: {
    nombre: string;
  };
  municipios: {
    nombre: string;
  };
  categorias: {
    nombre: string;
  };
  telefono?: string;
  user_id?: string;
};
type Props = {
  pub: Publicacion | null;
  isOpen: boolean;
  onClose: () => void;
  onContactar: (tel?: string) => void;
};
const PublicationDetailModal: React.FC<Props> = ({
  pub,
  isOpen,
  onClose,
  onContactar
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  if (!pub) return null;
  const telefonoMostrar = typeof pub.telefono === "string" ? pub.telefono.trim() || undefined : typeof pub.telefono === "number" ? String(pub.telefono) : undefined;
  const nextImage = () => {
    if (pub.imagenes.length > 1) {
      setCurrentImageIndex(prev => (prev + 1) % pub.imagenes.length);
    }
  };
  const prevImage = () => {
    if (pub.imagenes.length > 1) {
      setCurrentImageIndex(prev => (prev - 1 + pub.imagenes.length) % pub.imagenes.length);
    }
  };
  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle className="text-xl font-bold line-clamp-2 pr-4">
              {pub.titulo}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Galería de imágenes mejorada */}
          {pub.imagenes && pub.imagenes.length > 0 ? <div className="space-y-4">
              {/* Imagen principal */}
              <div className="relative">
                <img src={pub.imagenes[currentImageIndex]} alt={`${pub.titulo} - Imagen ${currentImageIndex + 1}`} loading="lazy" className="w-full h-80 rounded-lg object-contain" />
                
                {/* Controles de navegación */}
                {pub.imagenes.length > 1 && <>
                    <Button variant="secondary" size="sm" className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white" onClick={prevImage}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white" onClick={nextImage}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>

                    {/* Indicador de imagen actual */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                      {currentImageIndex + 1} / {pub.imagenes.length}
                    </div>
                  </>}
              </div>

              {/* Miniaturas */}
              {pub.imagenes.length > 1 && <div className="flex gap-2 overflow-x-auto pb-2">
                  {pub.imagenes.map((imagen, index) => <button key={index} onClick={() => goToImage(index)} className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${index === currentImageIndex ? 'border-blue-500 scale-105' : 'border-gray-300 hover:border-gray-400'}`}>
                      <img src={imagen} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover" />
                    </button>)}
                </div>}
            </div> : <div className="w-full h-80 bg-gray-200 dark:bg-gray-800 flex items-center justify-center rounded-lg">
              <span className="text-gray-400">Sin imágenes disponibles</span>
            </div>}

          {/* Información principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda - Detalles */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Detalles
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {pub.descripcion}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    <strong>Ubicación:</strong> {pub.municipios?.nombre}, {pub.estados?.nombre}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    <strong>Categoría:</strong> {pub.categorias?.nombre}
                  </span>
                </div>

                {pub.condicion && <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      <strong>Condición:</strong> {pub.condicion}
                    </span>
                  </div>}

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    <strong>Publicado:</strong> {new Date(pub.fecha_creacion).toLocaleDateString()}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded select-all">
                    <strong>ID Publicación:</strong> {pub.id}
                  </div>
                  {pub.user_id && <div className="text-xs text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded select-all">
                      <strong>ID Usuario:</strong> {pub.user_id}
                    </div>}
                </div>
              </div>
            </div>

            {/* Columna derecha - Precio y acciones */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Precio</h3>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-green-600">
                    ${pub.precio?.toLocaleString()}
                  </span>
                  {pub.frecuencia_pago && <span className="text-lg text-gray-500">
                      /{pub.frecuencia_pago}
                    </span>}
                </div>
                <Badge variant={pub.tipo_publicacion === "venta" ? "default" : "secondary"} className="mt-2">
                  {pub.tipo_publicacion === "venta" ? "Venta" : "Renta"}
                </Badge>
              </div>

              {/* Botones de contacto */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Contactar</h3>
                
                <div className="flex flex-col gap-3">
                  <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => onContactar(telefonoMostrar)}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contactar por WhatsApp
                  </Button>
                  
                  <Button variant="outline" className="w-full" onClick={() => {
                  if (telefonoMostrar) {
                    window.open(`tel:${telefonoMostrar}`, "_self");
                  } else {
                    onContactar(undefined);
                  }
                }}>
                    <Phone className="h-4 w-4 mr-2" />
                    Llamar directamente
                  </Button>
                </div>

                {!telefonoMostrar && <div className="text-xs text-red-500 text-center">
                    Número no disponible
                  </div>}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>;
};
export default PublicationDetailModal;