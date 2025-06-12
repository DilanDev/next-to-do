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
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Crear nueva tarea</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
            Título *
          </label>
          <input
            type="text"
            id="nombre"
            required
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
          />
        </div>

        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
            Descripción *
          </label>
          <textarea
            id="descripcion"
            required
            rows={3}
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
          />
        </div>

        <div>
          <label htmlFor="fechaVencimiento" className="block text-sm font-medium text-gray-700">
            Fecha de vencimiento (opcional)
          </label>
          <input
            type="date"
            id="fechaFinal"
            value={formData.FechaFinal}
            onChange={(e) => setFormData({ ...formData, FechaFinal: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Creando...' : 'Crear tarea'}
        </button>
      </div>
    </form>
  );
}