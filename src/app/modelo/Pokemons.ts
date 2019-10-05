/**
 * Parametros del pokemon
 */
export interface PokemonInterface {
  // Atributos principales
  numero_nacional: string;
  numero_regional: string;
  region: string;
  nombre: string;
  tipoUno: string;
  tipoDos: string;
  genero: string;
  descripcion: string;

  // Nivel, Evo, Exp
  numeroEvolucion: number;
  nivelEvolucion: number;
  evoluciona: string;
  nivel?: number;
  experiencia?: number;
  ContenedorExp?: number;
  contadorExp?: number;
  MultiplicadorExp?: number;

  // Puntos de Estado/Estadísticas
  hp?: number;
  hp_max?: number;
  ataque?: number;
  defensa?: number;
  ataque_especial?: number;
  defensa_especial?: number;
  velocidad?: number;
  estado?: string;
  IV?: number;
  EV?: number;

  capturado?: number;
  favorito?: boolean;
  ball?: string;
}
