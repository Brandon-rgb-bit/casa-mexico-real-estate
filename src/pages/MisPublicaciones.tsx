
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { Pencil, Trash2, Eye, Lock } from "lucide-react";

type Publicacion = {
  id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  tipo_publicacion: string;
  imagenes: string[];
  fecha_creacion: string;
  aprobada: boolean;
  user_id: string;
  estados: { nombre: string };
  municipios: { nombre: string };
  categorias: { nombre: string };
};

const MisPublicacionesPage = () => {
  const { user } = useSupabaseSession();
  const navigate = useNavigate();
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPub, setEditingPub] = useState<Publicacion | null>(null);
  const [editForm, setEditForm] = useState({
    titulo: "",
    descripcion: "",
    precio: 0,
  });
  const [suscripcionActiva, setSuscripcionActiva] = useState<boolean>(false);
  const [vigenciaHasta, setVigenciaHasta] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    checkSuscripcionStatus();
    fetchMyPublicaciones();
  }, [user, navigate]);

  const checkSuscripcionStatus = async () => {
    if (!user) return;

    try {
      console.log("Checking subscription status for user:", user.id);
      
      const { data, error } = await supabase
        .from("limites")
        .select("vigencia_hasta")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error checking subscription:", error);
        setSuscripcionActiva(false);
        return;
      }

      console.log("Subscription data:", data);

      if (data?.vigencia_hasta) {
        const fechaVigencia = new Date(data.vigencia_hasta);
        const ahora = new Date();
        const activa = fechaVigencia > ahora;
        console.log("Subscription active:", activa, "Valid until:", fechaVigencia);
        setSuscripcionActiva(activa);
        setVigenciaHasta(data.vigencia_hasta);
      } else {
        console.log("No vigencia_hasta found");
        setSuscripcionActiva(false);
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
      setSuscripcionActiva(false);
    }
  };

  const fetchMyPublicaciones = async () => {
    if (!user) return;

    try {
      console.log("Fetching publications for user:", user.id);
      setLoading(true);
      
      const { data, error } = await supabase
        .from("publicaciones")
        .select(`
          id,
          titulo,
          descripcion,
          precio,
          tipo_publicacion,
          imagenes,
          fecha_creacion,
          aprobada,
          user_id,
          estados (nombre),
          municipios (nombre),
          categorias (nombre)
        `)
        .eq("user_id", user.id)
        .order("fecha_creacion", { ascending: false });

      if (error) {
        console.error("Error fetching publications:", error);
        toast.error("Error al cargar tus publicaciones");
        setPublicaciones([]);
      } else {
        console.log("Publications found:", data?.length || 0);
        console.log("Publications data:", data);
        setPublicaciones(data || []);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setPublicaciones([]);
      toast.error("Error inesperado al cargar publicaciones");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pub: Publicacion) => {
    if (!suscripcionActiva) {
      toast("Suscripción requerida", { 
        description: "Tu suscripción ha expirado. No puedes editar publicaciones." 
      });
      return;
    }

    setEditingPub(pub);
    setEditForm({
      titulo: pub.titulo,
      descripcion: pub.descripcion,
      precio: pub.precio,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingPub || !suscripcionActiva) return;

    try {
      const { error } = await supabase
        .from("publicaciones")
        .update({
          titulo: editForm.titulo,
          descripcion: editForm.descripcion,
          precio: editForm.precio,
        })
        .eq("id", editingPub.id);

      if (error) {
        console.error("Error updating publication:", error);
        toast("Error", { description: "No se pudo actualizar la publicación" });
      } else {
        toast("¡Publicación actualizada exitosamente!");
        setEditingPub(null);
        fetchMyPublicaciones();
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast("Error inesperado", { description: "Ocurrió un error al actualizar" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!suscripcionActiva) {
      toast("Suscripción requerida", { 
        description: "Tu suscripción ha expirado. No puedes eliminar publicaciones." 
      });
      return;
    }

    if (!confirm("¿Estás seguro de que quieres eliminar esta publicación?")) {
      return;
    }

    try {
      // Primero obtener la publicación para eliminar las imágenes
      const { data: pub } = await supabase
        .from("publicaciones")
        .select("imagenes")
        .eq("id", id)
        .single();

      // Eliminar imágenes del storage si existen
      if (pub?.imagenes && pub.imagenes.length > 0) {
        const imagePaths = pub.imagenes
          .filter(url => url.includes('supabase.co/storage/v1/object/public/imagenes/'))
          .map(url => {
            const path = url.split('/storage/v1/object/public/imagenes/')[1];
            return path;
          });

        if (imagePaths.length > 0) {
          const { error: storageError } = await supabase.storage
            .from('imagenes')
            .remove(imagePaths);

          if (storageError) {
            console.error("Error deleting images from storage:", storageError);
          }
        }
      }

      // Eliminar la publicación
      const { error } = await supabase
        .from("publicaciones")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting publication:", error);
        toast("Error", { description: "No se pudo eliminar la publicación" });
      } else {
        toast("Publicación eliminada exitosamente");
        fetchMyPublicaciones();
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast("Error inesperado", { description: "Ocurrió un error al eliminar" });
    }
  };

  // Función para obtener URL segura de imagen
  const getImageUrl = (imagenes: string[], index: number = 0): string => {
    if (!imagenes || imagenes.length === 0) return "";
    
    const imageUrl = imagenes[index];
    if (!imageUrl) return "";
    
    // Si ya es una URL de Supabase, devolverla tal como está
    if (imageUrl.includes('supabase.co/storage/v1/object/public/imagenes/')) {
      return imageUrl;
    }
    
    // Si es una URL blob local, no mostrar la imagen
    if (imageUrl.startsWith('blob:')) {
      return "";
    }
    
    return imageUrl;
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6">
        <div className="text-center">
          <p className="text-lg">Cargando tus publicaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Publicaciones ({publicaciones.length})</h1>
        <Button onClick={() => navigate("/publicar")}>
          Nueva Publicación
        </Button>
      </div>

      {/* Indicador de estado de suscripción */}
      <div className="mb-6">
        <Card className={`${suscripcionActiva ? 'border-green-500' : 'border-red-500'}`}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              {suscripcionActiva ? (
                <>
                  <Badge variant="default" className="bg-green-500">Suscripción Activa</Badge>
                  <span className="text-sm text-gray-600">
                    Vigente hasta: {vigenciaHasta ? new Date(vigenciaHasta).toLocaleDateString() : 'No definida'}
                  </span>
                </>
              ) : (
                <>
                  <Badge variant="destructive">Suscripción Expirada</Badge>
                  <Lock className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600">
                    No puedes ver ni editar publicaciones sin suscripción activa
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {publicaciones.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No tienes publicaciones aún.
          </p>
          <Button onClick={() => navigate("/publicar")}>
            Crear Primera Publicación
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {publicaciones.map((pub) => (
            <Card key={pub.id} className={!suscripcionActiva ? 'opacity-60' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{pub.titulo}</CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={pub.tipo_publicacion === 'venta' ? 'default' : 'secondary'}>
                        {pub.tipo_publicacion === 'venta' ? 'Venta' : 'Renta'}
                      </Badge>
                      <Badge variant={pub.aprobada ? 'default' : 'destructive'}>
                        {pub.aprobada ? 'Aprobada' : 'Pendiente'}
                      </Badge>
                      {!suscripcionActiva && (
                        <Badge variant="destructive">
                          <Lock className="h-3 w-3 mr-1" />
                          Bloqueada
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">ID: {pub.id}</p>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={!suscripcionActiva}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      {suscripcionActiva && (
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{pub.titulo}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {getImageUrl(pub.imagenes) && (
                              <img 
                                src={getImageUrl(pub.imagenes)} 
                                alt={pub.titulo}
                                className="w-full h-64 object-cover rounded-md"
                                onError={(e) => {
                                  console.error("Error loading image:", getImageUrl(pub.imagenes));
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                            <p>{pub.descripcion}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <p><strong>Precio:</strong> ${pub.precio?.toLocaleString()}</p>
                              <p><strong>Tipo:</strong> {pub.tipo_publicacion}</p>
                              <p><strong>Categoría:</strong> {pub.categorias?.nombre}</p>
                              <p><strong>Ubicación:</strong> {pub.municipios?.nombre}, {pub.estados?.nombre}</p>
                            </div>
                          </div>
                        </DialogContent>
                      )}
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(pub)}
                          disabled={!suscripcionActiva}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      {suscripcionActiva && editingPub && (
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Publicación</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Título</label>
                              <Input
                                value={editForm.titulo}
                                onChange={(e) => setEditForm(prev => ({ ...prev, titulo: e.target.value }))}
                                maxLength={60}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Descripción</label>
                              <Textarea
                                value={editForm.descripcion}
                                onChange={(e) => setEditForm(prev => ({ ...prev, descripcion: e.target.value }))}
                                rows={3}
                                maxLength={400}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Precio</label>
                              <Input
                                type="number"
                                value={editForm.precio}
                                onChange={(e) => setEditForm(prev => ({ ...prev, precio: Number(e.target.value) }))}
                                min={0}
                              />
                            </div>
                            <div className="flex gap-2 justify-end">
                              <Button variant="outline" onClick={() => setEditingPub(null)}>
                                Cancelar
                              </Button>
                              <Button onClick={handleSaveEdit}>
                                Guardar Cambios
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      )}
                    </Dialog>

                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDelete(pub.id)}
                      disabled={!suscripcionActiva}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {suscripcionActiva && pub.imagenes?.[0] && (
                    <img 
                      src={pub.imagenes[0]} 
                      alt={pub.titulo}
                      className="w-full h-32 object-cover rounded-md"
                      onError={(e) => {
                        console.error("Error loading image:", pub.imagenes[0]);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  {!suscripcionActiva && (
                    <div className="w-full h-32 bg-gray-200 rounded-md flex items-center justify-center">
                      <Lock className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <p className="text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                      {suscripcionActiva ? pub.descripcion : "Contenido bloqueado - Suscripción requerida"}
                    </p>
                    <div className="space-y-1 text-sm">
                      <p><strong>Precio:</strong> {suscripcionActiva ? `$${pub.precio?.toLocaleString()}` : "---"}</p>
                      <p><strong>Categoría:</strong> {suscripcionActiva ? pub.categorias?.nombre : "---"}</p>
                      <p><strong>Ubicación:</strong> {suscripcionActiva ? `${pub.municipios?.nombre}, ${pub.estados?.nombre}` : "---"}</p>
                      <p className="text-gray-500">
                        Publicado: {new Date(pub.fecha_creacion).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisPublicacionesPage;
