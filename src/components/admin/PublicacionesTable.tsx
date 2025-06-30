
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Star, StarOff } from "lucide-react";

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

type Props = {
  publicaciones: Publicacion[];
  onPublicacionUpdated: () => void;
};

const PublicacionesTable: React.FC<Props> = ({ publicaciones, onPublicacionUpdated }) => {
  const [destacadasIds, setDestacadasIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    fetchDestacadas();
  }, []);

  const fetchDestacadas = async () => {
    try {
      const { data } = await supabase
        .from("destacados")
        .select("publicacion_id")
        .eq("is_active", true);
      
      if (data) {
        setDestacadasIds(data.map(d => d.publicacion_id));
      }
    } catch (error) {
      console.error("Error fetching destacadas:", error);
    }
  };

  const toggleDestacada = async (publicacionId: string) => {
    setLoading(publicacionId);
    try {
      const isDestacada = destacadasIds.includes(publicacionId);
      
      if (isDestacada) {
        // Remover de destacadas
        const { error } = await supabase
          .from("destacados")
          .delete()
          .eq("publicacion_id", publicacionId);
        
        if (error) throw error;
        
        setDestacadasIds(prev => prev.filter(id => id !== publicacionId));
        toast({
          title: "Publicación removida de destacadas",
          description: "La publicación ya no aparecerá en la sección destacada.",
        });
      } else {
        // Añadir a destacadas
        const { error } = await supabase
          .from("destacados")
          .insert({
            publicacion_id: publicacionId,
            is_active: true
          });
        
        if (error) throw error;
        
        setDestacadasIds(prev => [...prev, publicacionId]);
        toast({
          title: "Publicación destacada",
          description: "La publicación ahora aparecerá en la sección destacada.",
        });
      }
    } catch (error) {
      console.error("Error toggling destacada:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la publicación.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const toggleAprobacion = async (publicacionId: string, aprobada: boolean) => {
    setLoading(publicacionId);
    try {
      const { error } = await supabase
        .from("publicaciones")
        .update({ aprobada: !aprobada })
        .eq("id", publicacionId);
      
      if (error) throw error;
      
      onPublicacionUpdated();
      toast({
        title: aprobada ? "Publicación desaprobada" : "Publicación aprobada",
        description: aprobada 
          ? "La publicación ya no será visible para los usuarios." 
          : "La publicación ahora es visible para los usuarios.",
      });
    } catch (error) {
      console.error("Error updating aprobacion:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de aprobación.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Municipio</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {publicaciones.map((pub) => (
            <TableRow key={pub.id}>
              <TableCell className="max-w-xs">
                <div className="truncate font-medium">{pub.titulo}</div>
                <div className="text-xs text-gray-500 truncate">
                  ID: {pub.id.slice(0, 8)}...
                </div>
              </TableCell>
              <TableCell>${pub.precio?.toLocaleString()}</TableCell>
              <TableCell>
                <Badge variant={pub.tipo_publicacion === "venta" ? "default" : "secondary"}>
                  {pub.tipo_publicacion}
                </Badge>
              </TableCell>
              <TableCell>{pub.categorias?.nombre}</TableCell>
              <TableCell>{pub.estados?.nombre}</TableCell>
              <TableCell>{pub.municipios?.nombre}</TableCell>
              <TableCell>
                {new Date(pub.fecha_creacion).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <Badge variant={pub.aprobada ? "default" : "destructive"}>
                    {pub.aprobada ? "Aprobada" : "Pendiente"}
                  </Badge>
                  {destacadasIds.includes(pub.id) && (
                    <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                      Destacada
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAprobacion(pub.id, pub.aprobada)}
                    disabled={loading === pub.id}
                  >
                    {pub.aprobada ? "Desaprobar" : "Aprobar"}
                  </Button>
                  <Button
                    variant={destacadasIds.includes(pub.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleDestacada(pub.id)}
                    disabled={loading === pub.id}
                  >
                    {destacadasIds.includes(pub.id) ? (
                      <>
                        <StarOff className="h-4 w-4 mr-1" />
                        Quitar
                      </>
                    ) : (
                      <>
                        <Star className="h-4 w-4 mr-1" />
                        Destacar
                      </>
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PublicacionesTable;
