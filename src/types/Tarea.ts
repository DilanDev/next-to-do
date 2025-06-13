export interface Tarea {
  id: string;
  nombre: string;
  descripcion: string;
  completado: boolean;
  fechaInicio: string;
  fechaFinal?: string;
}

export interface CrearTarea {
  nombre : string;
  descripcion: string;
  fechaFinal?: string;
}

export interface EditarTarea {
    id: string;
  nombre: string;
  descripcion: string;
  completado: boolean;
  fechaInicio: string;
  fechaFinal?: string;
}