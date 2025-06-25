
import React from "react";
import { Input } from "@/components/ui/input";
type Props = {
  busquedaId: string;
  setBusquedaId: (val: string) => void;
  filtros: {
    busqueda: string;
    tipo: string;
    categoria: string;
    estado: string;
    municipio: string;
    condicion: string;
  };
  setFiltros: (cb: (old: any) => any) => void;
  categorias: string[];
  estados: string[];
  municipios: string[];
  condiciones: string[];
  disabled: boolean;
};
import { Search } from "lucide-react";

const ListadoFilters: React.FC<Props> = ({
  busquedaId,
  setBusquedaId,
  filtros,
  setFiltros,
  categorias,
  estados,
  municipios,
  condiciones,
  disabled,
}) => (
  <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
    <div className="grid grid-cols-1 md:grid-cols-7 lg:grid-cols-7 gap-4">
      {/* Buscar por ID */}
      <div className="relative">
        <Input
          placeholder="Buscar por ID (Publicación o Usuario)"
          value={busquedaId}
          onChange={(e) => setBusquedaId(e.target.value)}
          className="py-2 text-base"
          maxLength={36}
          autoComplete="off"
        />
      </div>
      {/* Buscar por texto */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar maquinaria..."
          value={filtros.busqueda}
          onChange={e =>
            setFiltros((prev: any) => ({
              ...prev,
              busqueda: e.target.value,
            }))
          }
          className="pl-10"
          autoComplete="off"
          disabled={disabled}
        />
      </div>
      <select
        value={filtros.tipo}
        onChange={e =>
          setFiltros((prev: any) => ({ ...prev, tipo: e.target.value }))
        }
        className="input input-bordered dark:bg-muted dark:text-white rounded-md border px-3 py-2"
        disabled={disabled}
      >
        <option value="">Todos los tipos</option>
        <option value="venta">Venta</option>
        <option value="renta">Renta</option>
      </select>
      <select
        value={filtros.categoria}
        onChange={e =>
          setFiltros((prev: any) => ({ ...prev, categoria: e.target.value }))
        }
        className="input input-bordered dark:bg-muted dark:text-white rounded-md border px-3 py-2"
        disabled={disabled}
      >
        <option value="">Todas las categorías</option>
        {categorias.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <select
        value={filtros.estado}
        onChange={e =>
          setFiltros((prev: any) => ({ ...prev, estado: e.target.value }))
        }
        className="input input-bordered dark:bg-muted dark:text-white rounded-md border px-3 py-2"
        disabled={disabled}
      >
        <option value="">Todos los estados</option>
        {estados.map((est) => (
          <option key={est} value={est}>{est}</option>
        ))}
      </select>
      <select
        value={filtros.municipio}
        onChange={e =>
          setFiltros((prev: any) => ({ ...prev, municipio: e.target.value }))
        }
        className="input input-bordered dark:bg-muted dark:text-white rounded-md border px-3 py-2"
        disabled={disabled}
      >
        <option value="">Todos los municipios</option>
        {municipios.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
      <select
        value={filtros.condicion}
        onChange={e =>
          setFiltros((prev: any) => ({ ...prev, condicion: e.target.value }))
        }
        className="input input-bordered dark:bg-muted dark:text-white rounded-md border px-3 py-2"
        disabled={disabled}
      >
        <option value="">Todas las condiciones</option>
        {condiciones.map((cond) => (
          <option key={cond} value={cond}>{cond}</option>
        ))}
      </select>
    </div>
    {busquedaId && (
      <div className="mt-2">
        <span className="text-xs bg-white/10 text-gray-900 dark:text-white px-3 py-1 rounded">
          Filtrando por ID (Publicación o Usuario)
        </span>
      </div>
    )}
  </div>
);

export default ListadoFilters;
