/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import TareaItem from '../components/TareaItem';
import TareaForm from '../components/TareaForm';
import { Tarea, CrearTarea } from '../types/Tarea';
import { api } from '../utils/Api';

interface HomeProps {
  tareasIniciales: Tarea[];
}

export default function Home({ tareasIniciales }: HomeProps) {
  const [tareas, setTareas] = useState<Tarea[]>(Array.isArray(tareasIniciales) ? tareasIniciales : []);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
 
  const handleCrearTarea = async (nuevaTarea: CrearTarea) => {
    setLoading(true);
    try {
      const tareaCreada = await api.crearTarea(nuevaTarea);
      setTareas([tareaCreada, ...tareas]);
    } catch (error) {
      console.error('Error al crear tarea:', error);
      alert('Error al crear la tarea');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarTarea = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) return;
    
    try {
      await api.eliminarTarea(id);
      setTareas(tareas.filter(tarea => tarea.id !== id));
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      alert('Error al eliminar la tarea');
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
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      alert('Error al actualizar la tarea');
    }
  };

  return (
    <Layout title="TODO App - Lista de tareas">
      <div className="px-4 py-6 sm:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario */}
          <div className="lg:col-span-1">
            <TareaForm onSubmit={handleCrearTarea} loading={loading} />
          </div>

          {/* Lista de tareas */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Tareas ({tareas.length})
              </h2>
            </div>
            
            {tareas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No tienes tareas todavía. ¡Crea tu primera tarea!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tareas.map((tarea) => (
                  <TareaItem
                    key={tarea.id}
                    tarea={tarea}
                    onDelete={handleEliminarTarea}
                    onToggle={handleToggleTarea}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

// SSR: Esta función se ejecuta en el servidor
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