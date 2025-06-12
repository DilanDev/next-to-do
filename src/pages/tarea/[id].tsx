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

  const isOverdue = tarea.FechaFinal && new Date(tarea.FechaFinal) < new Date() && !tarea.completado;

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
      await api.eliminarTarea(tarea.id);
      router.push('/');
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      alert('Error al eliminar la tarea');
    }
  };

  const handleToggleCompletado = async () => {
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

  const handleCancelarEdicion = () => {
    setEditando(false);
    setFormData({
      id: tarea.id,
      nombre: tarea.nombre,
      descripcion: tarea.descripcion,
      completado: tarea.completado,
      FechaInicio: tarea.FechaInicio,
      FechaFinal: tarea.FechaFinal?.split('T')[0] || '',
    });
  };

  return (
    <Layout title={`TODO App - ${tarea.nombre}`}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
          >
            <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Volver a tareas</span>
          </Link>
        </div>

        {!editando ? (
          /* Vista de solo lectura */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Contenido principal */}
            <div className="lg:col-span-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 p-8 shadow-sm">
                {/* Header con estado */}
                <div className="flex items-start gap-6 mb-8">
                  {/* Checkbox personalizado */}
                  <button
                    onClick={handleToggleCompletado}
                    className={`mt-2 flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                      tarea.completado
                        ? 'bg-green-500 border-green-500 scale-110'
                        : 'border-gray-300 hover:border-gray-400 hover:scale-110'
                    }`}
                  >
                    {tarea.completado && (
                      <svg className="w-4 h-4 text-white mx-auto mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <h1 className={`text-3xl font-light mb-3 transition-all duration-200 ${
                      tarea.completado 
                        ? 'line-through text-gray-400' 
                        : 'text-gray-900'
                    }`}>
                      {tarea.nombre}
                    </h1>

                    {/* Estado visual */}
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        tarea.completado
                          ? 'bg-green-100 border border-green-200 text-green-700'
                          : isOverdue
                            ? 'bg-red-100 border border-red-200 text-red-700'
                            : 'bg-blue-100 border border-blue-200 text-blue-700'
                      }`}>
                        {tarea.completado ? 'Completada' : isOverdue ? 'Vencida' : 'Pendiente'}
                      </span>
                      {isOverdue && !tarea.completado && (
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
                    Descripción
                  </h3>
                  <p className={`text-lg leading-relaxed ${
                    tarea.completado ? 'text-gray-400' : 'text-gray-700'
                  }`}>
                    {tarea.descripcion}
                  </p>
                </div>

                {/* Metadatos en grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Fecha de inicio
                    </h4>
                    <div className="flex items-center gap-2 text-gray-700">
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span>{new Date(tarea.FechaInicio).toLocaleString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  </div>

                  {tarea.FechaFinal && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Fecha límite
                      </h4>
                      <div className="flex items-center gap-2 text-gray-700">
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className={isOverdue && !tarea.completado ? 'text-red-600 font-medium' : ''}>
                          {new Date(tarea.FechaFinal).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar con acciones */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-4">
                {!tarea.completado && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-sm">
                    <h3 className="text-lg font-light text-gray-900 mb-4">Acciones</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setEditando(true)}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-all duration-200 group"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="font-medium">Editar tarea</span>
                      </button>
                      
                      <button
                        onClick={handleEliminar}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl transition-all duration-200 group"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="font-medium">Eliminar tarea</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Información adicional */}
                <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
                    Detalles
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID:</span>
                      <span className="text-gray-900 font-mono">{tarea.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <span className={`font-medium ${tarea.completado ? 'text-green-600' : 'text-blue-600'}`}>
                        {tarea.completado ? 'Finalizada' : 'En progreso'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Formulario de edición */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 p-8 shadow-sm">
              <div className="mb-8">
                <h1 className="text-2xl font-light text-gray-900 mb-2">Editar tarea</h1>
                <p className="text-gray-600">Actualiza los detalles de tu tarea</p>
              </div>

              <form onSubmit={handleEditar} className="space-y-6">
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
                    className="w-full px-4 py-3 bg-gray-50/50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 text-gray-900"
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
                    rows={4}
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50/50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 text-gray-900 resize-none"
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

                {/* Botones de acción */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancelarEdicion}
                    className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Guardando...</span>
                      </div>
                    ) : (
                      <span>Guardar cambios</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
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