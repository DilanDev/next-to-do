import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { Tarea, EditarTarea } from '@/types/Tarea';
import { api } from '@/utils/Api';

interface TareaDetalleProps {
  tarea: Tarea;
}

export default function TareaDetalle({ tarea: tareaInicial }: TareaDetalleProps) {
  const [tarea, setTarea] = useState<Tarea>(tareaInicial);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState<EditarTarea>({
    id: tarea.id,
    nombre: tarea.nombre,
    descripcion: tarea.descripcion,
    completado: tarea.completado,
    FechaInicio: tarea.FechaInicio,
    FechaFinal: tarea.FechaFinal?.split('T')[0] || '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEditar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tareaActualizada = await api.editarTarea(tarea.id, {
        ...tarea,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        FechaFinal: formData.FechaFinal
          ? new Date(formData.FechaFinal).toISOString()
          : undefined,
      });

      setTarea(tareaActualizada);
      setEditando(false);
    } catch (error) {
      console.error('Error al editar tarea:', error);
      alert('Error al editar la tarea');
    } finally {
      setLoading(false);
    }
  };



  const handleEliminar = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) return;

    try {
      await api.eliminarTarea((tarea.id));
      router.push('/');
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      alert('Error al eliminar la tarea');
    }
  };

  const handleTogglecompletado = async () => {
    try {
      const tareaActualizada = await api.editarTarea(tarea.id, {
        ...tarea,
        completado: !tarea.completado
      });
      setTarea(tareaActualizada);
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      alert('Error al actualizar la tarea');
    }
  };

  return (
    <Layout title={`TODO App - ${tarea.nombre}`}>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Volver a la lista
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          {!editando ? (
            // Vista de solo lectura
            <div>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={tarea.completado}
                    onChange={handleTogglecompletado}
                    className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <h1 className={`text-2xl font-bold ${tarea.completado ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {tarea.nombre}
                    </h1>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${tarea.completado
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {tarea.completado ? 'completado' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                </div>
                {!tarea.completado && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditando(true)}
                      className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-600 hover:border-blue-800 rounded-md"
                    >
                      Editar
                    </button>
                    <button
                      onClick={handleEliminar}
                      className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 border border-red-600 hover:border-red-800 rounded-md"
                    >
                      Eliminar
                    </button>
                  </div>
                )}

              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Descripción</h3>
                  <p className={`text-gray-900 ${tarea.completado ? 'text-gray-500' : ''}`}>
                    {tarea.descripcion}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Fecha de creación</h3>
                    <p className="text-gray-900">
                      {new Date(tarea.FechaInicio).toLocaleString()}
                    </p>
                  </div>
                  {tarea.FechaFinal && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-1">Fecha de vencimiento</h3>
                      <p className="text-gray-900">
                        {new Date(tarea.FechaFinal).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Formulario de edición
            <form onSubmit={handleEditar}>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Editar tarea</h1>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditando(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 rounded-md"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
                  >
                    {loading ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                  />
                </div>

                <div>
                  <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    id="descripcion"
                    required
                    rows={4}
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                  />
                </div>

                <div>
                  <label htmlFor="fechaVencimiento" className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de vencimiento (opcional)
                  </label>
                  <input
                    type="date"
                    id="fechaFinal"
                    value={formData.FechaFinal}
                    onChange={(e) => setFormData({ ...formData, FechaFinal: e.target.value })}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                  />
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

// SSR: Esta función se ejecuta en el servidor para cada request
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;

  try {
    const tareaOriginal = await api.obtenerTareaPorId(id as string);

    // Quita los campos undefined para que no fallen al serializar
    const tarea = JSON.parse(JSON.stringify(tareaOriginal));

    return {
      props: {
        tarea,
      },
    };
  } catch (error) {
    console.error('Error al obtener tarea:', error);

    return {
      notFound: true,
    };
  }
};
