
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, addMonths } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

const LimiteDialog: React.FC<LimiteDialogProps> = ({
  user,
  onClose,
  fetchUsers,
}) => {
  const [limite, setLimite] = useState<number>(user.limite);
  const [vigencia, setVigencia] = useState<Date | undefined>(
    user.vigencia_hasta ? new Date(user.vigencia_hasta) : undefined
  );
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    let currentVigencia = vigencia;
    if (!currentVigencia) currentVigencia = addMonths(new Date(), 1);

    try {
      const { error: deleteError } = await supabase
        .from("limites")
        .delete()
        .eq("user_id", user.id);
      if (deleteError) {
        toast({
          title: "Error al guardar el límite",
          description: "No se pudo eliminar el límite anterior.",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }
      const { error: insertError } = await supabase
        .from("limites")
        .insert({
          user_id: user.id,
          limite,
          vigencia_hasta: currentVigencia.toISOString(),
        });
      if (insertError) {
        toast({
          title: "Error al guardar el límite",
          description: "No se pudo guardar el nuevo límite.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Límite guardado",
          description: "El límite se guardó correctamente.",
        });
        fetchUsers();
        onClose();
      }
    } catch {
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al guardar el límite.",
        variant: "destructive",
      });
    }
    setSaving(false);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Asignar nuevo límite</DialogTitle>
          <DialogDescription>
            Puedes cambiar el límite de publicaciones y la fecha de vigencia.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Límite</Label>
            <Input
              type="number"
              min={1}
              value={limite}
              onChange={(e) => setLimite(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Vigencia hasta</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[200px] pl-3 text-left font-normal",
                    !vigencia && "text-muted-foreground"
                  )}
                >
                  {vigencia
                    ? format(vigencia, "PPP")
                    : <span>Elegir fecha</span>
                  }
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center" side="bottom">
                <Calendar
                  mode="single"
                  selected={vigencia}
                  onSelect={setVigencia}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>Guardar</Button>
      </DialogContent>
    </Dialog>
  );
};

export default LimiteDialog;
