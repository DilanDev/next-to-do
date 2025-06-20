import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import TareaItem from '../components/TareaItem';
import TareaForm from '../components/TareaForm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Tarea, CrearTarea } from '../types/Tarea';
import { api } from '../utils/Api';
import { useNotificationContext } from '../context/NotificationContext';
import { useConfirm } from '../hooks/useConfirm';

interface HomeProps {
  tareasIniciales: Tarea[];
}

export default function Home({ tareasIniciales }: HomeProps) {
  const [tareas, setTareas] = useState<Tarea[]>(Array.isArray(tareasIniciales) ? tareasIniciales : []);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const { showSuccess, showError, showWarning } = useNotificationContext();
  
  const { confirm, isOpen, options, onConfirm, onCancel } = useConfirm();

  const handleCrearTarea = async (nuevaTarea: CrearTarea) => {
    setLoading(true);
    try {
      const tareaCreada = await api.crearTarea(nuevaTarea);
      setTareas([tareaCreada, ...tareas]);
      
      showSuccess(
        '¡Tarea creada!',
        `La tarea "${nuevaTarea.nombre}" se ha creado correctamente.`
      );
    } catch (error) {
      console.error('Error al crear tarea:', error);
      
      showError(
        'Error al crear tarea',
        'No se pudo crear la tarea. Por favor, inténtalo de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarTarea = async (id: string) => {
    const tarea = tareas.find(t => t.id === id);
    if (!tarea) return;

    const confirmed = await confirm({
      title: 'Eliminar tarea',
      message: `¿Estás seguro de que quieres eliminar la tarea "${tarea.nombre}"? Esta acción no se puede deshacer.`,
      confirmText: 'Sí, eliminar',
      cancelText: 'Cancelar',
      type: 'danger'
    });

    if (!confirmed) return;
    
    try {
      await api.eliminarTarea(id);
      setTareas(tareas.filter(tarea => tarea.id !== id));
      
      showSuccess(
        'Tarea eliminada',
        `La tarea "${tarea.nombre}" se ha eliminado correctamente.`
      );
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      
      showError(
        'Error al eliminar tarea',
        'No se pudo eliminar la tarea. Por favor, inténtalo de nuevo.'
      );
    }
  };

  const handleToggleTarea = async (id: string, completado: boolean) => {
    try {
      console.log('Tareas actuales:', tareas);
      const tarea = tareas.find(t => t.id === id);
      if (!tarea) return;
      
      const tareaActualizada = await api.editarTarea(id, { ...tarea, completado });
      setTareas(tareas.map(t => 
        t.id === id ? { ...t, completado } : t
      ));

      if (completado) {
        showSuccess(
          '¡Tarea completada!',
          `Has completado la tarea "${tarea.nombre}".`
        );
      } else {
        showWarning(
          'Tarea marcada como pendiente',
          `La tarea "${tarea.nombre}" ahora está pendiente.`
        );
      }
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      
      showError(
        'Error al actualizar tarea',
        'No se pudo actualizar el estado de la tarea.'
      );
    }
  };

  const tareasPendientes = tareas.filter(t => !t.completado);
  const tareasCompletadas = tareas.filter(t => t.completado);

  return (
    <Layout title="TODO App - Lista de tareas">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-medium text-gray-900 tracking-tight">
              Tu día organizado
            </h1>
            <p className="text-gray-800">
              Mantén el control de tus tareas y objetivos
            </p>
          </div>
          
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-mono text-blue-600">{tareasPendientes.length}</div>
              <div className="text-sm text-gray-900">Pendientes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-mono text-green-600">{tareasCompletadas.length}</div>
              <div className="text-sm text-gray-900">Completadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-mono text-gray-900">{tareas.length}</div>
              <div className="text-sm text-gray-900">Total</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Formulario - Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <TareaForm onSubmit={handleCrearTarea} loading={loading} />
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            {tareas.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Comienza tu día
                </h3>
                <p className="text-gray-700">
                  Crea tu primera tarea para empezar a organizarte
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {tareasPendientes.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Pendientes ({tareasPendientes.length})
                      </h2>
                    </div>
                    <div className="grid gap-4">
                      {tareasPendientes.map((tarea) => (
                        <TareaItem
                          key={tarea.id}
                          tarea={tarea}
                          onDelete={handleEliminarTarea}
                          onToggle={handleToggleTarea}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {tareasCompletadas.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Completadas ({tareasCompletadas.length})
                      </h2>
                    </div>
                    <div className="grid gap-4">
                      {tareasCompletadas.map((tarea) => (
                        <TareaItem
                          key={tarea.id}
                          tarea={tarea}
                          onDelete={handleEliminarTarea}
                          onToggle={handleToggleTarea}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isOpen}
        title={options.title}
        message={options.message}
        confirmText={options.confirmText}
        cancelText={options.cancelText}
        type={options.type}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const tareasIniciales = await api.obtenerTareas();
    return {
      props: {
        tareasIniciales: Array.isArray(tareasIniciales) ? tareasIniciales : [],
      },
    };
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    return {
      props: {
        tareasIniciales: [],
      },
    };
  }
};