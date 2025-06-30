
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import DarkModeSwitch from "@/components/DarkModeSwitch";

export const NavBar = ({ user }: { user: any }) => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast("Sesión cerrada");
    navigate("/");
  };

  return (
    <nav className="w-full flex items-center justify-between py-2 px-4 border-b bg-white dark:bg-background transition-colors">
      <Link to="/" className="font-bold text-lg text-primary">
        Inmuebles MX
      </Link>
      
      <div className="hidden md:flex items-center gap-4">
        <Link to="/" className="text-sm hover:underline">Inicio</Link>
        <Link to="/listado" className="text-sm hover:underline">Ver Todo</Link>
        <Link to="/destacados" className="text-sm hover:underline">Destacados</Link>
      </div>

      <div className="flex items-center gap-2">
        {user ? (
          <>
            <Link to="/publicar" className="text-sm hover:underline">Publicar</Link>
            <Link to="/mis-publicaciones" className="text-sm hover:underline">Mis publicaciones</Link>
            <Link to="/comprobante" className="text-sm hover:underline">Upgrade Premium</Link>
            {user?.rol === "admin" && (
              <Link to="/admin" className="font-semibold text-red-600 text-sm hover:underline">
                Admin panel
              </Link>
            )}
            <Button variant="outline" onClick={handleLogout} size="sm">
              Cerrar sesión
            </Button>
          </>
        ) : (
          <Button onClick={() => navigate("/auth")} size="sm">
            Ingresar
          </Button>
        )}
        <DarkModeSwitch />
      </div>
    </nav>
  );
};
