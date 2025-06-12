import React from 'react';
import Link from 'next/link';
import { Tarea } from '../types/Tarea';

interface TareaItemProps {
  tarea: Tarea;
  onDelete: (id: string) => void;
  onToggle: (id: string, completado: boolean) => void;
}

export default function TareaItem({ tarea, onDelete, onToggle }: TareaItemProps) {
  const isOverdue = tarea.FechaFinal && new Date(tarea.FechaFinal) < new Date() && !tarea.completado;
  
  return (
    <div className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
      tarea.completado 
        ? 'border-green-200/50 bg-green-50/30' 
        : isOverdue 
          ? 'border-red-200/50 bg-red-50/30' 
          : 'border-gray-200/50 hover:border-gray-300/50'
    }`}>
      <div className="p-6">
        <div className="flex items-start gap-4">
          <button
            onClick={() => onToggle(tarea.id.toString(), !tarea.completado)}
            disabled={tarea.completado}
            className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-200 ${
              tarea.completado
                ? 'bg-green-500 border-green-500'
                : 'border-gray-300 hover:border-gray-400 hover:scale-110'
            }`}
          >
            {tarea.completado && (
              <svg className="w-3 h-3 text-white mx-auto mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h3 className={`font-medium text-lg mb-2 transition-all duration-200 ${
              tarea.completado 
                ? 'line-through text-gray-400' 
                : 'text-gray-900'
            }`}>
              {tarea.nombre}
            </h3>
            
            <p className={`text-sm mb-3 transition-all duration-200 ${
              tarea.completado ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {tarea.descripcion}
            </p>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {new Date(tarea.FechaInicio).toLocaleDateString()}
              </span>
              
              {tarea.FechaFinal && (
                <span className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                  isOverdue 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {new Date(tarea.FechaFinal).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Link
              href={`/tarea/${tarea.id}`}
              className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
              title="Ver detalles"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </Link>

            {!tarea.completado && (
              <button
                onClick={() => onDelete(tarea.id.toString())}
                className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                title="Eliminar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {tarea.completado && (
        <div className="absolute top-3 right-3">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      )}
      {isOverdue && (
        <div className="absolute top-3 right-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
}