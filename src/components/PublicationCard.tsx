import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, MessageCircle, Eye } from "lucide-react";
import ImageCarousel from "./ImageCarousel";
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
  pub: Publicacion;
  onContactar: (tel?: string) => void;
  onViewDetails: (pub: Publicacion) => void;
};
const PublicationCard: React.FC<Props> = ({
  pub,
  onContactar,
  onViewDetails
}) => {
  // Verificar si hay teléfono disponible, si no, usar undefined
  const telefonoMostrar = typeof pub.telefono === "string" ? pub.telefono.trim() || undefined : typeof pub.telefono === "number" ? String(pub.telefono) : undefined;
  const handleCopyId = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
  };
  return <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2">{pub.titulo}</CardTitle>
          <Badge variant={pub.tipo_publicacion === "venta" ? "default" : "secondary"}>
            {pub.tipo_publicacion === "venta" ? "Venta" : "Renta"}
          </Badge>
        </div>
        
        {/* IDs compactos uno al lado del otro */}
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-900 px-2 py-0.5 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors select-all" onClick={e => handleCopyId(pub.id, e)} title="Clic para copiar ID de publicación">
            Pub: {pub.id.slice(0, 8)}...
          </span>
          {pub.user_id && <span className="text-xs text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors select-all" onClick={e => handleCopyId(pub.user_id!, e)} title="Clic para copiar ID de usuario">
              User: {pub.user_id.slice(0, 8)}...
            </span>}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
        <div>
          <div className="cursor-pointer" onClick={() => onViewDetails(pub)}>
            <ImageCarousel images={pub.imagenes} alt={pub.titulo} />
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {pub.descripcion}
          </p>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex items-end gap-2 font-semibold text-2xl text-green-600">
              <span>
                ${pub.precio?.toLocaleString()}
              </span>
              {pub.frecuencia_pago && <span className="text-base text-gray-500 font-normal">
                  /{pub.frecuencia_pago}
                </span>}
            </div>
            <div className="flex items-center text-gray-500">
              <MapPin className="h-4 w-4 mr-1" />
              <span>
                {pub.municipios?.nombre}, {pub.estados?.nombre}
              </span>
            </div>
            <p><strong>Categoría:</strong> {pub.categorias?.nombre}</p>
            {pub.condicion && <p>
                <strong>Condición:</strong> {pub.condicion}
              </p>}
            <p className="text-gray-500">
              Publicado: {new Date(pub.fecha_creacion).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="mt-auto">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onViewDetails(pub)} className="flex-1 my-0 mx-0 px-0 py-px text-xs">
              <Eye className="h-4 w-4 mr-2" />
              Ver detalles
            </Button>
            <Button onClick={() => onContactar(telefonoMostrar)} className="flex-1 rounded-sm text-xs">
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
            <Button variant="outline" onClick={() => {
            if (telefonoMostrar) {
              window.open(`tel:${telefonoMostrar}`, "_self");
            } else {
              onContactar(undefined);
            }
          }} aria-label="Llamar" className="text-xs font-thin rounded-sm px-0 py-0 my-0">
              <Phone className="h-4 w-4" />
            </Button>
          </div>
          {!telefonoMostrar && <div className="text-xs text-red-500 mt-2">Número no disponible</div>}
        </div>
      </CardContent>
    </Card>;
};
export default PublicationCard;