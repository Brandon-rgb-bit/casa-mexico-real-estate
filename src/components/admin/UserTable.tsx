
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
  // Controla qué usuario está editando actualmente
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead>Límite</TableHead>
          <TableHead>Vigencia</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {usersData.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.id}</TableCell>
            <TableCell>{user.nombre}</TableCell>
            <TableCell>{user.telefono}</TableCell>
            <TableCell>{user.rol}</TableCell>
            <TableCell>{user.limite}</TableCell>
            <TableCell>
              {user.vigencia_hasta
                ? new Date(user.vigencia_hasta).toISOString().slice(0, 10)
                : "No asignada"}
            </TableCell>
            <TableCell>
              <Button variant="outline" onClick={() => setEditingUserId(user.id)}>
                Editar
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
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;
