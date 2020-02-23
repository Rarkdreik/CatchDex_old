import { PokemonInterface } from './Pokemons';

export interface Entrenador {
    nick: string;
    nivel: number;
    exp: number;
    pokeBalls: number;
    superBalls: number;
    ultraBalls: number;
    masterBalls: number;

    // Region inicial del entrenador
    region_ini?: string;
    // Pokemon inicial del entrenador
    poke_ini?: PokemonInterface;
    // Array de los pokemons atrapados
    capturados?: PokemonInterface[];
    // Array del numero nacional de cada pokemon
    favoritos?: string[];
}
