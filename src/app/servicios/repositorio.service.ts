import { Injectable } from '@angular/core';
import { User } from '../modelo/user';
import { Entrenador } from '../modelo/entrenador';
import { PokemonInterface } from '../modelo/Pokemons';
import { StatsService } from './estadisticas.service';
import { LvupService } from './lvup.service';

@Injectable({
  providedIn: 'root'
})
export class RepositorioService {
  private usuario: User;
  private entrenador: Entrenador;
  private regionActual: string;
  private atrapados: PokemonInterface[];
  private equipoPokemon: PokemonInterface[];
  private pokemonsRegionActual: PokemonInterface[];

  constructor(private stats: StatsService, private poke: StatsService, private lvup: LvupService) {
    this.usuario = { uid: '', email: '', photoURL: '', displayName: '' };
    this.entrenador = { nick: 'MasterRepo', exp: 0, nivel: 10, pokeBalls: 20, superBalls: 10, ultraBalls: 5, masterBalls: 1 };
    this.regionActual = 'kanto';
    this.atrapados = [];
    this.equipoPokemon = [];
    this.pokemonsRegionActual = [];
    
    // let pokemon: PokemonInterface = this.poke.getStatsPokemon('252');
    // pokemon = this.lvup.setCaracteristicas(this.entrenador, pokemon);
    // this.equipoPokemon.push(pokemon);

    // pokemon = this.poke.getStatsPokemon('255');
    // pokemon = this.lvup.setCaracteristicas(this.entrenador, pokemon);
    // this.equipoPokemon.push(pokemon);

    // pokemon = this.poke.getStatsPokemon('258');
    // pokemon = this.lvup.setCaracteristicas(this.entrenador, pokemon);
    // this.equipoPokemon.push(pokemon);

    // pokemon = this.poke.getStatsPokemon('341');
    // pokemon = this.lvup.setCaracteristicas(this.entrenador, pokemon);
    // this.equipoPokemon.push(pokemon);

    // pokemon = this.poke.getStatsPokemon('360');
    // pokemon = this.lvup.setCaracteristicas(this.entrenador, pokemon);
    // this.equipoPokemon.push(pokemon);

    // pokemon = this.poke.getStatsPokemon('361');
    // pokemon = this.lvup.setCaracteristicas(this.entrenador, pokemon);
    // this.equipoPokemon.push(pokemon);
  }

  public modificarEquipoPokemon(poke: PokemonInterface, indice: number) {
    this.equipoPokemon[indice] = poke;
  }

  //////////////////  Entrenador  /////////////////////////////

  public setMaster(master: Entrenador): void {
    this.entrenador = master;
  }

  public getMaster(): Entrenador {
    return this.entrenador;
  }

  public getAtrapados(): PokemonInterface[] {
    return this.atrapados;
  }

  public setAtrapados(atrapados: PokemonInterface[]): void {
    this.atrapados = atrapados;
  }

  public getEquipoPokemon(): PokemonInterface[] {
    return this.equipoPokemon;
  }

  public setEquipoPokemon(equipoPokemon: PokemonInterface[]): void {
    this.equipoPokemon = equipoPokemon;
  }

  //////////////////////////////////////////////////////////
  //////////////////  Otros Datos  /////////////////////////

  public setRegion(region: string): void {
    this.regionActual = region;
  }

  public getRegion(): string {
    return this.regionActual;
  }

  public getPokemonsRegionActual(): PokemonInterface[] {
    return this.pokemonsRegionActual;
  }

  public setPokemonsRegionActual(pokemonsRegionActual: PokemonInterface[]): void {
    this.pokemonsRegionActual = pokemonsRegionActual;
  }

  public updatePokeRegionActual(poke: PokemonInterface) {
    let pokem: PokemonInterface;
    this.pokemonsRegionActual.forEach(element => {
      if (poke.numero_nacional === element.numero_nacional) { pokem = element; }
    });
    let index = this.pokemonsRegionActual.indexOf(pokem);
    this.pokemonsRegionActual[index] = poke;
    return false;
  }

  public getListaPokemonRegion(region: string): PokemonInterface[] {
    let lista: PokemonInterface[] = []
    let poke: PokemonInterface;
    let nacional: string = '';
    for (let index = 1; index < 807; index++) {
      if (index < 10) { nacional = '00' + index; }
      else if (index >= 10 && index < 100) { nacional = '0' + index; }
      else if (index >= 100) { nacional = '' + index; }
      poke = this.stats.getStatsPokemon(nacional);
      if (region === poke.region) { lista.push(poke); }
    }
    this.pokemonsRegionActual = lista;
    return lista;
  }

  public esFavorito(numero_nacional: string) {
    this.entrenador.favoritos.forEach(element => {
      if (numero_nacional === element) { return true; }
    });
    return false;
  }

  //////////////////////////////////////////////////////////
  //////////////////  Usuario  /////////////////////////////

  public setUsuario(user: User) {
    this.usuario = user;
  }

  public getUsuario() {
    return this.usuario;
  }

  public setNick(nick: string) {
    this.usuario.displayName = nick;
  }

  public getNick() {
    return this.usuario;

  }

  public setAvatar(avatar: string) {
    this.usuario.photoURL = avatar;
  }

  public getAvatar() {
    return this.usuario.photoURL;
  }

  public getCorreo() {
    if (this.usuario ? true : false) {
      return this.usuario.email;
    } else {
      return null;
    }
  }

  public getNickCorto() {
    if (this.usuario ? true : false) {
      let cadena: string = this.usuario.displayName;
      cadena = cadena.substring(0, cadena.indexOf(' '));
      return cadena;
    } else { return ''; }
  }

  //////////////////////////////////////////////////////////

  public evoEquipo(pokanterior: PokemonInterface, pokespues: PokemonInterface) {
    this.equipoPokemon.forEach((poke) => {
      if (poke.numero_nacional === pokanterior.numero_nacional) {
        poke = pokespues;
      }
    });
  }

}
