import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useCatalogos } from "@/hooks/useCatalogos";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";
import { useNavigate } from "react-router-dom";

type PublicarFormValues = {
  titulo: string;
  descripcion: string;
  precio: number;
  tipo_publicacion: "renta" | "venta";
  estado_id: number;
  municipio_id: number;
  categoria_id: number;
  imagenes: File[];
  telefono: string;
  frecuencia_pago: string;
  condicion: string;
};

const PublicarPage = () => {
  const form = useForm<PublicarFormValues>({
    defaultValues: {
      titulo: "",
      descripcion: "",
      precio: 0,
      tipo_publicacion: "venta",
      estado_id: 0,
      municipio_id: 0,
      categoria_id: 0,
      imagenes: [],
      telefono: "",
      frecuencia_pago: "",
      condicion: ""
    }
  });
  
  const { estados, categorias, getMunicipiosByEstado } = useCatalogos();
  const { user, loading: userLoading } = useSupabaseSession();
  const navigate = useNavigate();
  const [municipios, setMunicipios] = useState<any[]>([]);
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [canPublish, setCanPublish] = useState(true);
  const [publicacionesCount, setPublicacionesCount] = useState(0);
  const [limite, setLimite] = useState(1);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!userLoading && !user) {
      navigate("/auth");
    }
  }, [user, userLoading, navigate]);

  // Verificar límite de publicaciones
  useEffect(() => {
    const checkPublicationLimit = async () => {
      if (!user) return;

      try {
        // Obtener límite personalizado del usuario (si existe)
        const { data: limiteData } = await supabase
          .from("limites")
          .select("limite, vigencia_hasta")
          .eq("user_id", user.id)
          .maybeSingle();

        let userLimit = 1; // límite por defecto
        
        if (limiteData) {
          // Verificar si el límite personalizado aún es válido
          if (!limiteData.vigencia_hasta || new Date(limiteData.vigencia_hasta) > new Date()) {
            userLimit = limiteData.limite || 1;
          }
        }

        setLimite(userLimit);

        // Contar publicaciones actuales del usuario
        const { data: publicaciones, count } = await supabase
          .from("publicaciones")
          .select("*", { count: 'exact' })
          .eq("user_id", user.id);

        setPublicacionesCount(count || 0);
        setCanPublish((count || 0) < userLimit);

        console.log(`Usuario tiene ${count} publicaciones de un límite de ${userLimit}`);
      } catch (error) {
        console.error("Error checking publication limit:", error);
      }
    };

    if (user) {
      checkPublicationLimit();
    }
  }, [user]);

  if (userLoading) {
    return (
      <div className="max-w-xl mx-auto mt-8 p-6 rounded shadow">
        <div className="text-center">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Actualiza municipios al cambiar estado
  const handleEstadoChange = async (estado_id: number) => {
    if (!estado_id) return;
    try {
      const municipiosFetched = await getMunicipiosByEstado(estado_id);
      setMunicipios(municipiosFetched);
      form.setValue("municipio_id", 0);
    } catch (error) {
      console.error("Error fetching municipios:", error);
    }
  };

  // Preview de imágenes
  const handleImagenesChange = (files: FileList | null) => {
    if (!files) return;
    const arrFiles = Array.from(files).slice(0, 8); // Changed from 4 to 8
    setImagenes(arrFiles);
    setPreview(arrFiles.map(file => URL.createObjectURL(file)));
    form.setValue("imagenes", arrFiles as any);
  };

  // Función para subir imágenes a Supabase Storage
  const uploadImagesToSupabase = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (const file of files) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        console.log(`Subiendo imagen: ${fileName}`);
        
        const { data, error } = await supabase.storage
          .from('imagenes')
          .upload(fileName, file);

        if (error) {
          console.error('Error uploading image:', error);
          throw error;
        }

        // Obtener URL pública de la imagen
        const { data: { publicUrl } } = supabase.storage
          .from('imagenes')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
        console.log(`Imagen subida exitosamente: ${publicUrl}`);
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Error al subir una imagen');
        throw error;
      }
    }
    
    return uploadedUrls;
  };

  // Función para asegurar que el usuario existe en la tabla public.users
  const ensureUserExists = async (userId: string, telefono: string) => {
    try {
      // Verificar si el usuario ya existe
      const { data: existingUser } = await supabase
        .from("users")
        .select("id, telefono")
        .eq("id", userId)
        .maybeSingle();

      if (!existingUser) {
        // Si no existe, crearlo
        console.log("Creating user in public.users table:", userId);
        const { error: userError } = await supabase
          .from("users")
          .insert({ id: userId, telefono });
        
        if (userError) {
          console.error("Error creating user:", userError);
          throw userError;
        }
      } else if (existingUser.telefono !== telefono) {
        await supabase
          .from("users")
          .update({ telefono })
          .eq("id", userId);
      }
    } catch (error: any) {
      console.error("Error ensuring user exists:", error);
      throw error;
    }
  };

  const onSubmit = async (values: PublicarFormValues) => {
    if (!user) {
      toast.error("Debes estar autenticado para publicar");
      navigate("/auth");
      return;
    }

    if (!canPublish) {
      toast.error(`Has alcanzado tu límite de ${limite} publicación(es). Contacta al administrador para solicitar más.`);
      return;
    }

    // Validaciones básicas
    if (!values.titulo.trim()) {
      toast.error("El título es requerido");
      return;
    }

    if (!values.descripcion.trim()) {
      toast.error("La descripción es requerida");
      return;
    }

    if (!values.telefono.trim()) {
      toast.error("El número de contacto es requerido");
      return;
    }

    if (!values.estado_id || !values.municipio_id || !values.categoria_id) {
      toast.error("Debes seleccionar estado, municipio y categoría");
      return;
    }

    if (!values.frecuencia_pago.trim()) {
      toast.error("Debes seleccionar la frecuencia del cobro");
      return;
    }

    if (!values.condicion.trim()) {
      toast.error("Debes seleccionar la condición del inmueble");
      return;
    }

    setLoading(true);
    try {
      await ensureUserExists(user.id, values.telefono.trim());

      // Subir imágenes a Supabase Storage si hay alguna
      let imageUrls: string[] = [];
      if (imagenes.length > 0) {
        console.log(`Subiendo ${imagenes.length} imágenes a Supabase Storage...`);
        imageUrls = await uploadImagesToSupabase(imagenes);
        console.log('URLs de imágenes subidas:', imageUrls);
      }

      const { error } = await supabase.from("publicaciones").insert({
        titulo: values.titulo.trim(),
        descripcion: values.descripcion.trim(),
        precio: Number(values.precio) || 0,
        tipo_publicacion: values.tipo_publicacion,
        estado_id: Number(values.estado_id),
        municipio_id: Number(values.municipio_id),
        categoria_id: Number(values.categoria_id),
        imagenes: imageUrls, // Ahora son URLs de Supabase Storage
        user_id: user.id,
        frecuencia_pago: values.frecuencia_pago,
        condicion: values.condicion,
        telefono: Number(values.telefono?.toString() || "0"), // Fix: Convert to number as expected by DB
      });
      
      if (error) {
        console.error("Error creating publication:", error);
        toast.error(`Error al publicar: ${error.message}`);
      } else {
        toast.success("¡Publicación creada exitosamente! Tu publicación está pendiente de aprobación por el administrador.");
        form.reset();
        setPreview([]);
        setImagenes([]);
        setMunicipios([]);
        setPublicacionesCount(prev => prev + 1);
        setCanPublish(publicacionesCount + 1 < limite);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Ocurrió un error al publicar");
    } finally {
      setLoading(false);
    }
  };

  if (!canPublish) {
    return (
      <div className="max-w-xl mx-auto mt-8 p-6 rounded shadow bg-white dark:bg-background transition-colors">
        <h1 className="text-xl font-bold mb-4">Límite de Publicaciones Alcanzado</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Has alcanzado tu límite de {limite} publicación(es). 
          Actualmente tienes {publicacionesCount} publicación(es).
        </p>
        <p className="text-sm mt-4 text-blue-600 dark:text-blue-400">
          Si necesitas publicar más, contacta al administrador para solicitar un aumento en tu límite.
        </p>
        <Button 
          onClick={() => navigate("/mis-publicaciones")} 
          className="mt-4"
        >
          Ver Mis Publicaciones
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 rounded shadow bg-white dark:bg-background transition-colors">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Publicar inmuebles
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {publicacionesCount}/{limite} publicaciones
        </span>
      </div>
      
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField 
            control={form.control} 
            name="titulo" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título *</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={60} placeholder="Título de la publicación" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          
          <FormField 
            control={form.control} 
            name="descripcion" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción *</FormLabel>
                <FormControl>
                  <Textarea 
                    rows={3} 
                    {...field} 
                    maxLength={400} 
                    placeholder="Describe tu inmueble."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          
          <FormField 
            control={form.control} 
            name="precio" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={0} 
                    {...field} 
                    placeholder="0"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          
          <FormField 
            control={form.control} 
            name="tipo_publicacion" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo *</FormLabel>
                <FormControl>
                  <select 
                    {...field} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-muted dark:text-white dark:border-gray-600"
                  >
                    <option value="">Selecciona...</option>
                    <option value="renta">Renta</option>
                    <option value="venta">Venta</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          
          <FormField 
            control={form.control} 
            name="estado_id" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado *</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-muted dark:text-white dark:border-gray-600"
                    onChange={async (e) => {
                      const value = Number(e.target.value);
                      field.onChange(value);
                      if (value) {
                        await handleEstadoChange(value);
                      }
                    }}
                  >
                    <option value="">Selecciona estado...</option>
                    {(estados || []).map((est: any) => (
                      <option key={est.id} value={est.id}>{est.nombre}</option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          
          <FormField 
            control={form.control} 
            name="municipio_id" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Municipio *</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-muted dark:text-white dark:border-gray-600"
                    disabled={municipios.length === 0}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  >
                    <option value="">Selecciona municipio...</option>
                    {municipios.map((m: any) => (
                      <option key={m.id} value={m.id}>{m.nombre}</option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          
          <FormField 
            control={form.control} 
            name="categoria_id" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría *</FormLabel>
                <FormControl>
                  <select 
                    {...field} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-muted dark:text-white dark:border-gray-600"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  >
                    <option value="">Selecciona categoría...</option>
                    {(categorias || []).map((cat: any) => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          
          <FormField 
            control={form.control} 
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de contacto *</FormLabel>
                <FormControl>
                  <Input 
                    {...field}
                    type="tel"
                    maxLength={16}
                    pattern="[0-9]{10,16}"
                    placeholder="Ej. 5512345678"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField 
            control={form.control} 
            name="condicion" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condición *</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-muted dark:text-white dark:border-gray-600"
                  >
                    <option value="">Selecciona...</option>
                    <option value="Nuevo">Nuevo</option>
                    <option value="Usado">Usado</option>
                    <option value="Reparado">Reparado</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          
          <FormField 
            control={form.control} 
            name="frecuencia_pago" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frecuencia de cobro *</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-muted dark:text-white dark:border-gray-600"
                  >
                    <option value="">Selecciona frecuencia...</option>
                    <option value="diario">Diario</option>
                    <option value="semanal">Semanal</option>
                    <option value="quincenal">Quincenal</option>
                    <option value="mensual">Mensual</option>
                    <option value="unico">Único pago</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          
          <FormItem>
            <FormLabel>Imágenes (máx. 8)</FormLabel>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={e => handleImagenesChange(e.target.files)}
            />
            <div className="flex gap-2 mt-2 flex-wrap">
              {preview.map((src, i) => (
                <img key={i} src={src} alt="" className="w-20 h-20 rounded object-cover border" />
              ))}
            </div>
          </FormItem>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Publicando..." : "Publicar"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PublicarPage;
