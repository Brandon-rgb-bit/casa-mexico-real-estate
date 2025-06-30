
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LimiteDialog from "./LimiteDialog";

type UserData = {
  id: string;
  nombre: string;
  telefono: string;
  rol: string;
  limite: number;
  vigencia_hasta: string | null;
};

type UserTableProps = {
  usersData: UserData[];
  fetchUsers: () => void;
};

const UserTable: React.FC<UserTableProps> = ({ usersData, fetchUsers }) => {
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const getVigenciaStatus = (vigencia: string | null) => {
    if (!vigencia) return { status: "Sin vigencia", variant: "secondary" as const };
    
    const fechaVigencia = new Date(vigencia);
    const hoy = new Date();
    const diasRestantes = Math.ceil((fechaVigencia.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diasRestantes < 0) {
      return { status: "Vencido", variant: "destructive" as const };
    } else if (diasRestantes <= 7) {
      return { status: `${diasRestantes} días`, variant: "secondary" as const };
    } else {
      return { status: `${diasRestantes} días`, variant: "default" as const };
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuario</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Límite de Publicaciones</TableHead>
            <TableHead>Vigencia</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usersData.map((user) => {
            const vigenciaInfo = getVigenciaStatus(user.vigencia_hasta);
            return (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{user.nombre}</div>
                    <div className="text-xs text-gray-500">
                      ID: {user.id.slice(0, 8)}...
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.telefono}</TableCell>
                <TableCell>
                  <Badge variant={user.rol === "admin" ? "default" : "secondary"}>
                    {user.rol}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-center">
                    <span className="text-lg font-semibold">{user.limite}</span>
                    <div className="text-xs text-gray-500">publicaciones</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={vigenciaInfo.variant}>
                    {vigenciaInfo.status}
                  </Badge>
                  {user.vigencia_hasta && (
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(user.vigencia_hasta).toLocaleDateString()}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingUserId(user.id)}
                  >
                    Editar Límite
                  </Button>
                  {editingUserId === user.id && (
                    <LimiteDialog
                      user={user}
                      onClose={() => setEditingUserId(null)}
                      fetchUsers={fetchUsers}
                    />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
