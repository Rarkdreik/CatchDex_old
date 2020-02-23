import { Injectable } from '@angular/core';
import { PokemonInterface } from '../modelo/Pokemons';

@Injectable({
  providedIn: 'root'
})
export class EntrenadorService {
  private equipoPokemon: PokemonInterface[] = [];
  private capturados: PokemonInterface[] = [];

  constructor() { }

  public addCapturado(pokeNuevo: PokemonInterface) {
    let index: number = 0;

    if ((index = this.getIndexObject(this.capturados, pokeNuevo)) > -1) {
      this.capturados[index] = pokeNuevo;
    } else {
      this.capturados.push(pokeNuevo);
    }
  }

  public editarPokemonEquipo(pokeNuevo: PokemonInterface, pokeViejo?: PokemonInterface) {
    let index: number = 0;

    if (pokeViejo != null) {
      if ((index = this.getIndexObject(this.equipoPokemon, pokeViejo)) > -1) {
        this.equipoPokemon[index] = pokeNuevo;
      } else {
        this.equipoPokemon.push(pokeNuevo);
      }
    } else if (this.equipoPokemon.length < 6) {
      this.equipoPokemon.push(pokeNuevo);
      this.addCapturado(pokeNuevo);
    } else {
      this.addCapturado(pokeNuevo);
    }
  }

  public getEquipoPokemon() {
    return this.equipoPokemon;
  }

  public getCapturados() {
    return this.capturados;
  }

  private getIndexObject(array: PokemonInterface[], pokeBusqueda: PokemonInterface): number {
    try {
      array.forEach(element => {
        if (element.numero_nacional === pokeBusqueda.numero_nacional) {
          return this.equipoPokemon.indexOf(pokeBusqueda);
        } else {
          return -1;
        }
      });
    } catch (erroneo) {
      return -1;
    }
  }

}
