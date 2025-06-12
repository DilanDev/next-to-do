import React, { useState } from 'react';
import { CrearTarea } from '../types/Tarea';

interface TareaFormProps {
  onSubmit: (tarea: CrearTarea) => void;
  loading?: boolean;
}

export default function TareaForm({ onSubmit, loading = false }: TareaFormProps) {
  const [formData, setFormData] = useState<CrearTarea>({
    nombre: '',
    descripcion: '',
    FechaFinal: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      FechaFinal: formData.FechaFinal || undefined,
    });
    setFormData({ nombre: '', descripcion: '', FechaFinal: '' });
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="mb-6">
        <h2 className="text-xl font-light text-gray-900 mb-1">Nueva tarea</h2>
        <p className="text-sm text-gray-500">Organiza tu día</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campo Título */}
        <div className="space-y-2">
          <label htmlFor="nombre" className="text-sm font-medium text-gray-700 block">
            Título
          </label>
          <input
            type="text"
            id="nombre"
            required
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="¿Qué necesitas hacer?"
            className="w-full px-4 py-3 bg-gray-50/50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
          />
        </div>

        {/* Campo Descripción */}
        <div className="space-y-2">
          <label htmlFor="descripcion" className="text-sm font-medium text-gray-700 block">
            Descripción
          </label>
          <textarea
            id="descripcion"
            required
            rows={3}
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            placeholder="Añade más detalles..."
            className="w-full px-4 py-3 bg-gray-50/50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 resize-none"
          />
        </div>

        {/* Campo Fecha */}
        <div className="space-y-2">
          <label htmlFor="fechaFinal" className="text-sm font-medium text-gray-700 block">
            Fecha límite
          </label>
          <input
            type="date"
            id="fechaFinal"
            value={formData.FechaFinal}
            onChange={(e) => setFormData({ ...formData, FechaFinal: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50/50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 text-gray-700"
          />
        </div>

        {/* Botón Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Creando...</span>
            </div>
          ) : (
            <span>Crear tarea</span>
          )}
        </button>
      </form>
    </div>
  );
}