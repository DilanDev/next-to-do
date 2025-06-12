import React from 'react';
import Link from 'next/link';
import { Tarea } from '../types/Tarea';

interface TareaItemProps {
  tarea: Tarea;
  onDelete: (id: string) => void;
  onToggle: (id: string, completado: boolean) => void;

}

export default function TareaItem({ tarea, onDelete, onToggle }: TareaItemProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={tarea.completado}
            disabled={tarea.completado}
            onChange={(e) => onToggle(tarea.id.toString(), e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <div className="flex-1">
            <h3 className={`text-lg font-medium ${tarea.completado ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {tarea.nombre}
            </h3>
            <p className={`mt-1 text-sm ${tarea.completado ? 'text-gray-400' : 'text-gray-600'}`}>
              {tarea.descripcion}
            </p>
            <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
              <span>Creada: {new Date(tarea.FechaInicio).toLocaleDateString()}</span>
              {tarea.FechaFinal && (
                <span>Vence: {new Date(tarea.FechaFinal).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href={`/tarea/${tarea.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Ver detalles
          </Link>

          {!tarea.completado && (
            <button
              onClick={() => onDelete(tarea.id.toString())}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Eliminar
            </button>
          )}
        </div>

      </div>
    </div>
  );
}