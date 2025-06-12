import { Tarea, CrearTarea } from '../types/Tarea';

const BASE_URL = 'http://localhost:5197/';

export const api = {
  obtenerTareas: async (): Promise<Tarea[]> => {
    const response = await fetch(`${BASE_URL}Tareas/ObtenerTareas`);
    if (!response.ok) throw new Error('Error al obtener tareas');
    return response.json(); 
  },

obtenerTareaPorId: async (id: string): Promise<Tarea> => {
  const response = await fetch(`${BASE_URL}Tareas/ObtenerTareaPorId/${id}`);
  if (!response.ok) throw new Error('Error al obtener tarea');
  return await response.json(); // ✅ si tu backend no usa { data: tarea }
},

  crearTarea: async (tarea: CrearTarea): Promise<Tarea> => {
    const response = await fetch(`${BASE_URL}Tareas/CrearTarea`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tarea),
    });
    if (!response.ok) throw new Error('Error al crear tarea');
    return response.json();
  },

editarTarea: async (id: string, tarea: Tarea): Promise<Tarea> => {
  const tareaCompleta: Tarea = {
    ...tarea,
    FechaInicio: tarea.FechaInicio
      ? new Date(tarea.FechaInicio).toISOString()
      : new Date().toISOString(),
    FechaFinal: tarea.FechaFinal
      ? new Date(tarea.FechaFinal).toISOString()
      : undefined,
  };

  const response = await fetch(`${BASE_URL}Tareas/EditarTarea/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tareaCompleta),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error del backend:', errorText);
    throw new Error('Error al editar tarea');
  }

  return await response.json();
},

  eliminarTarea: async (id: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}Tareas/EliminarTarea/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar tarea');
  },
};
