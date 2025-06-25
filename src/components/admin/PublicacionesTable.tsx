
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
};

const PublicacionesTable: React.FC<Props> = ({ publicaciones }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Imágenes</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Municipio</TableHead>
          <TableHead>Aprobada</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {publicaciones.map((pub) => (
          <TableRow key={pub.id}>
            <TableCell>{pub.titulo}</TableCell>
            <TableCell>
              {pub.imagenes && pub.imagenes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {pub.imagenes.map((imgUrl: string, idx: number) => (
                    <img
                      key={idx}
                      src={imgUrl}
                      alt={`Imagen ${idx + 1} de ${pub.titulo}`}
                      className="w-20 h-20 rounded object-cover border"
                    />
                  ))}
                </div>
              )}
            </TableCell>
            <TableCell>{pub.tipo_publicacion}</TableCell>
            <TableCell>{pub.categorias?.nombre}</TableCell>
            <TableCell>{pub.estados?.nombre}</TableCell>
            <TableCell>{pub.municipios?.nombre}</TableCell>
            <TableCell>
              {pub.aprobada ? (
                <span className="text-green-600 font-bold">Sí</span>
              ) : (
                <span className="text-red-600">No</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PublicacionesTable;
