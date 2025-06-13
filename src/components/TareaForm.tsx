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
    fechaFinal: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      fechaFinal: formData.fechaFinal || undefined,
    });
    setFormData({ nombre: '', descripcion: '', fechaFinal: '' });
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-lg transition-all duration-500 hover:bg-white/90">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
          <h2 className="text-xl font-semibold text-gray-900">Nueva tarea</h2>
        </div>
        <p className="text-sm text-gray-600 ml-6">Organiza tu día de manera eficiente</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-3">
          <label htmlFor="nombre" className="text-xs font-semibold text-gray-800 block uppercase tracking-wider">
            Título
          </label>
          <input
            type="text"
            id="nombre"
            required
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="¿Qué necesitas hacer?"
            className="w-full px-5 py-4 bg-gray-200 border-0 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-600 resize-none leading-relaxed"
          />
        </div>

        <div className="space-y-3">
          <label htmlFor="descripcion" className="text-xs font-semibold text-gray-800 block uppercase tracking-wider">
            Descripción
          </label>
          <textarea
            id="descripcion"
            required
            rows={4}
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            placeholder="Añade más detalles sobre tu tarea..."
            className="w-full px-5 py-4 bg-gray-200 border-0 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-600 resize-none leading-relaxed"
          />
        </div>

        <div className="space-y-3">
          <label htmlFor="fechaFinal" className="text-xs font-semibold text-gray-800 block uppercase tracking-wider">
            Fecha límite
          </label>
          <div className="relative">
            <input
              type="date"
              id="fechaFinal"
              value={formData.fechaFinal}
              onChange={(e) => setFormData({ ...formData, fechaFinal: e.target.value })}
              className="w-full px-5 py-4 bg-gray-100 border-0 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition-all duration-300 text-gray-700"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-gray-900 to-gray-900 hover:from-gray-900 hover:to-gray-700 text-white font-medium py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {loading ? (
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Creando tarea...</span>
            </div>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Crear tarea</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}