export interface Tarea {
  id: string;
  nombre: string;
  descripcion: string;
  completado: boolean;
  FechaInicio: string;
  FechaFinal?: string;
}

export interface CrearTarea {
  nombre : string;
  descripcion: string;
  FechaFinal?: string;
}

export interface EditarTarea {
    id: string;
  nombre: string;
  descripcion: string;
  completado: boolean;
  FechaInicio: string;
  FechaFinal?: string;
}