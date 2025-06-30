
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type UserData = {
  id: string;
  nombre: string;
  telefono: string;
  rol: string;
  limite: number;
  vigencia_hasta: string | null;
};

type LimiteDialogProps = {
  user: UserData;
  onClose: () => void;
  fetchUsers: () => void;
};

const LimiteDialog: React.FC<LimiteDialogProps> = ({ user, onClose, fetchUsers }) => {
  const [limite, setLimite] = useState(user.limite);
  const [meses, setMeses] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setLoading(true);
    try {
      // Calcular nueva fecha de vigencia
      const nuevaVigencia = new Date();
      nuevaVigencia.setMonth(nuevaVigencia.getMonth() + meses);

      const { error } = await supabase
        .from("limites")
        .update({
          limite: limite,
          vigencia_hasta: nuevaVigencia.toISOString(),
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Límite actualizado",
        description: `Se actualizó el límite a ${limite} publicaciones válidas por ${meses} mes(es).`,
      });

      fetchUsers();
      onClose();
    } catch (error) {
      console.error("Error updating limit:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el límite del usuario.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Límite de Publicaciones</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="user-info">Usuario</Label>
            <div className="p-2 bg-gray-50 rounded">
              <p className="font-medium">{user.nombre}</p>
              <p className="text-sm text-gray-600">{user.telefono}</p>
            </div>
          </div>
          
          <div>
            <Label htmlFor="limite">Límite de Publicaciones</Label>
            <Input
              id="limite"
              type="number"
              value={limite}
              onChange={(e) => setLimite(Number(e.target.value))}
              min={1}
              max={100}
            />
          </div>

          <div>
            <Label htmlFor="meses">Vigencia (meses)</Label>
            <Input
              id="meses"
              type="number"
              value={meses}
              onChange={(e) => setMeses(Number(e.target.value))}
              min={1}
              max={12}
            />
            <p className="text-xs text-gray-500 mt-1">
              La vigencia se extenderá {meses} mes(es) desde hoy
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LimiteDialog;
