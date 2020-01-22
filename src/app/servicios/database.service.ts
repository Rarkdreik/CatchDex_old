import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { PokemonInterface } from '../modelo/Pokemons';
import { Entrenador } from '../modelo/entrenador';
import { PokemonService } from './pokemon.service';

@Injectable({
  providedIn: 'root'
})

export class DatabaseService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  pokemons: Observable<PokemonInterface[]> = new Observable<PokemonInterface[]>();
  pokemonkanto = new BehaviorSubject([]); pokemonjohto = new BehaviorSubject([]); pokemonhoenn = new BehaviorSubject([]);
  pokemonCapturados = new BehaviorSubject([]); equipoPokemon = new BehaviorSubject([]);
  Entrenador = new BehaviorSubject([]);

  entrenador: Entrenador = { Nick: 'RarkRepo', Nombre: 'Rik', Exp: 0, Nivel: 36, ContenedorExp: 50, PokeBalls: 20, SuperBalls: 10, UltraBalls: 5, MasterBalls: 1 };
  // equipoPokemon: PokemonInterface[];
  numero_nacional: string = '';

  constructor(
    private plt: Platform,
    private sqlitePorter: SQLitePorter,
    private sqlite: SQLite,
    private http: HttpClient,
    private poke: PokemonService
  ) {
    this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'pokedex.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.seedDatabase();
        });
    });
  }

  seedDatabase() {
    this.http.get('../../../assets/sqlquery/sqlTablasPokedex.sql', { responseType: 'text' })
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(_ => {
            this.database.executeSql(`SELECT * FROM kanto`, []).then(data => { console.log('qwerty ' + data.rows.length); if (data.rows.length < 2 ) { this.addPokemonBD(); } });
            this.loadPokemon('kanto');
            this.loadPokemon('johto');
            this.loadPokemon('hoenn');
            this.loadPokemonEquipo();
            this.loadEntrenador();
            this.loadPokemonAtrapado();
            this.dbReady.next(true);
          })
          .catch(e => console.error(e));
      });
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  /*************************************************
  **************** Entrenador **********************
  *************************************************/

  loadEntrenador() {
    return this.database.executeSql(`SELECT * FROM entrenador`, []).then(data => {
      let entrenador: Entrenador[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {

          entrenador.push({
            Nick: data.rows.item(i).Nick, Nombre: data.rows.item(i).Nombre, Exp: data.rows.item(i).Exp, Nivel: data.rows.item(i).Nivel,
            ContenedorExp: data.rows.item(i).ContenedorExp, PokeBalls: data.rows.item(i).PokeBalls,
            SuperBalls: data.rows.item(i).SuperBalls, UltraBalls: data.rows.item(i).UltraBalls, MasterBalls: data.rows.item(i).MasterBalls
          });
        }
      }
      this.Entrenador.next(entrenador);
    });
  }

  addEntrenador(entrenador: Entrenador) {
    let data = [entrenador.Nick, entrenador.Nombre, entrenador.Exp, entrenador.Nivel, entrenador.ContenedorExp, entrenador.PokeBalls, entrenador.SuperBalls, entrenador.UltraBalls, entrenador.MasterBalls];

    return this.database.executeSql(`INSERT or IGNORE INTO entrenador VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, data).then(data => {
      this.loadEntrenador();
    });
  }

  getEntrenadorPromise(entrenador: Entrenador): Promise<Entrenador> {
    return this.database.executeSql(`SELECT * FROM entrenador WHERE Nick = ?`, [entrenador.Nick]).then(data => {
      return {
        Nick: data.rows.item(0).Nick, Nombre: data.rows.item(0).Nombre, Exp: data.rows.item(0).Exp, Nivel: data.rows.item(0).Nivel, ContenedorExp: data.rows.item(0).ContenedorExp,
        PokeBalls: data.rows.item(0).PokeBalls, SuperBalls: data.rows.item(0).SuperBalls, UltraBalls: data.rows.item(0).UltraBalls, MasterBalls: data.rows.item(0).MasterBalls,
      }
    });
  }

  deleteEntrenador(entrenador: Entrenador) {
    return this.database.executeSql(`DELETE FROM entrenador WHERE Nick = ?`, [entrenador.Nick]).then(_ => {
      this.loadEntrenador();
    });
  }

  updateEntrenador(entrenador: Entrenador) {
    let data = [entrenador.Nick];
    return this.database.executeSql(`UPDATE entrenador SET porConstruir WHERE Nick = ${entrenador.Nick}`, data).then(data => {
      this.loadEntrenador();
    })
  }

  /*************************************************
  **************** Pokemon  Atrapados **************
  *************************************************/

  loadPokemonAtrapado() {
    return this.database.executeSql(`SELECT * FROM atrapado`, []).then(data => {
      let poke: PokemonInterface[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {

          poke.push({
            numero_nacional: data.rows.item(i).numero_nacional, numero_regional: data.rows.item(i).numero_regional, region: data.rows.item(i).region, nombre: data.rows.item(i).nombre, tipoUno: data.rows.item(i).tipoUno, tipoDos: data.rows.item(i).tipoDos,
            genero: data.rows.item(i).genero, descripcion: data.rows.item(i).descripcion, numeroEvolucion: data.rows.item(i).numeroEvolucion, nivelEvolucion: data.rows.item(i).nivelEvolucion, evoluciona: data.rows.item(i).evoluciona,
            nivel: data.rows.item(i).nivel, experiencia: data.rows.item(i).experiencia, ContenedorExp: data.rows.item(i).ContenedorExp, hp: data.rows.item(i).hp, hp_max: data.rows.item(i).hp_max, ataque: data.rows.item(i).ataque, defensa: data.rows.item(i).defensa,
            ataque_especial: data.rows.item(i).ataque_especial, defensa_especial: data.rows.item(i).defensa_especial, velocidad: data.rows.item(i).velocidad, estado: data.rows.item(i).estado,
            IV: data.rows.item(i).IV, EV: data.rows.item(i).EV, capturado: data.rows.item(i).capturado, favorito: data.rows.item(i).favorito, ball: data.rows.item(i).ball
          });
        }
      }
      this.pokemonCapturados.next(poke);
    });
  }

  addPokemonAtrapado(poke: PokemonInterface) {
    let data = [poke.numero_nacional, poke.numero_regional, poke.region, poke.nombre, poke.tipoUno, poke.tipoDos, poke.genero, poke.descripcion, poke.numeroEvolucion, poke.nivelEvolucion, poke.evoluciona, poke.nivel,
    poke.experiencia, poke.ContenedorExp, poke.hp, poke.hp_max, poke.ataque, poke.defensa, poke.ataque_especial, poke.defensa_especial, poke.velocidad, poke.estado,
    poke.IV, poke.EV, poke.capturado, poke.favorito, poke.ball];
    console.log(`INSERT or IGNORE INTO atrapado VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, data);
    return this.database.executeSql(`INSERT or IGNORE INTO atrapado VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, data).then(data => {
      this.loadPokemonAtrapado();
    });
  }

  getPokemonAtrapado(poke: PokemonInterface): Promise<PokemonInterface> {
    return this.database.executeSql(`SELECT * FROM atrapado WHERE numero_nacional = ?`, [poke.numero_nacional]).then(data => {
      return {
        numero_nacional: data.rows.item(0).numero_nacional, numero_regional: data.rows.item(0).numero_regional, region: data.rows.item(0).region, nombre: data.rows.item(0).nombre, tipoUno: data.rows.item(0).tipoUno, tipoDos: data.rows.item(0).tipoDos,
        genero: data.rows.item(0).genero, descripcion: data.rows.item(0).descripcion, numeroEvolucion: data.rows.item(0).numeroEvolucion, nivelEvolucion: data.rows.item(0).nivelEvolucion, evoluciona: data.rows.item(0).evoluciona,
        nivel: (data.rows.item(0).nivel !== undefined ? data.rows.item(0).nivel : ''), experiencia: (data.rows.item(0).experiencia !== undefined ? data.rows.item(0).experiencia : ''),
        ContenedorExp: (data.rows.item(0).ContenedorExp !== undefined ? data.rows.item(0).ContenedorExp : ''),
        hp: (data.rows.item(0).hp !== undefined ? data.rows.item(0).hp : ''), hp_max: (data.rows.item(0).hp_max !== undefined ? data.rows.item(0).hp_max : ''),
        ataque: (data.rows.item(0).ataque !== undefined ? data.rows.item(0).ataque : ''), defensa: (data.rows.item(0).defensa !== undefined ? data.rows.item(0).defensa : ''),
        ataque_especial: (data.rows.item(0).ataque_especial !== undefined ? data.rows.item(0).ataque_especial : ''), defensa_especial: (data.rows.item(0).defensa_especial !== undefined ? data.rows.item(0).defensa_especial : ''),
        velocidad: (data.rows.item(0).velocidad !== undefined ? data.rows.item(0).velocidad : ''), estado: (data.rows.item(0).estado !== undefined ? data.rows.item(0).estado : ''),
        IV: (data.rows.item(0).IV !== undefined ? data.rows.item(0).IV : ''), EV: (data.rows.item(0).EV !== undefined ? data.rows.item(0).EV : ''), capturado: (data.rows.item(0).capturado !== undefined ? data.rows.item(0).capturado : ''), favorito: (data.rows.item(0).favorito !== undefined ? data.rows.item(0).favorito : ''),
        ball: (data.rows.item(0).ball !== undefined ? data.rows.item(0).ball : '')
      }
    });
  }

  deletePokemonAtrapado(poke: PokemonInterface) {
    return this.database.executeSql(`DELETE FROM atrapado WHERE numero_nacional = ?`, [poke.numero_nacional]).then(_ => {
      this.loadPokemon(poke.region);
    });
  }

  updatePokemonAtrapado(poke: PokemonInterface) {
    let data = [poke.numero_nacional, , poke.numero_regional];
    return this.database.executeSql(`UPDATE atrapado SET porConstruir WHERE numero_nacional = ${poke.numero_nacional}`, data).then(data => {
      this.loadPokemon(poke.region);
    })
  }


  /*************************************************
  **************** EQUIPO  POKEMON *****************
  *************************************************/

  loadPokemonEquipo() {
    return this.database.executeSql(`SELECT * FROM equipo`, []).then(data => {
      let poke: PokemonInterface[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {

          poke.push({
            numero_nacional: data.rows.item(i).numero_nacional, numero_regional: data.rows.item(i).numero_regional, region: data.rows.item(i).region, nombre: data.rows.item(i).nombre, tipoUno: data.rows.item(i).tipoUno, tipoDos: data.rows.item(i).tipoDos,
            genero: data.rows.item(i).genero, descripcion: data.rows.item(i).descripcion, numeroEvolucion: data.rows.item(i).numeroEvolucion, nivelEvolucion: data.rows.item(i).nivelEvolucion, evoluciona: data.rows.item(i).evoluciona,
            nivel: data.rows.item(i).nivel, experiencia: data.rows.item(i).experiencia, ContenedorExp: data.rows.item(i).ContenedorExp, hp: data.rows.item(i).hp, hp_max: data.rows.item(i).hp_max, ataque: data.rows.item(i).ataque, defensa: data.rows.item(i).defensa,
            ataque_especial: data.rows.item(i).ataque_especial, defensa_especial: data.rows.item(i).defensa_especial, velocidad: data.rows.item(i).velocidad, estado: data.rows.item(i).estado,
            IV: data.rows.item(i).IV, EV: data.rows.item(i).EV, capturado: data.rows.item(i).capturado, favorito: data.rows.item(i).favorito, ball: data.rows.item(i).ball
          });
        }
      }
      this.equipoPokemon.next(poke);
    });
  }

  addPokemonEquipo(poke: PokemonInterface) {
    this.equipoPokemon.subscribe(pokemons => {
      if (pokemons.length < 6) {
        let data = [poke.numero_nacional, poke.numero_regional, poke.region, poke.nombre, poke.tipoUno, poke.tipoDos, poke.genero, poke.descripcion, poke.numeroEvolucion, poke.nivelEvolucion, poke.evoluciona, poke.nivel,
        poke.experiencia, poke.ContenedorExp, poke.hp, poke.hp_max, poke.ataque, poke.defensa, poke.ataque_especial, poke.defensa_especial, poke.velocidad, poke.estado,
        poke.IV, poke.EV, poke.capturado, poke.favorito, poke.ball];
        console.log(`INSERT or IGNORE INTO equipo VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, data);
        return this.database.executeSql(`INSERT or IGNORE INTO equipo VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, data).then(data => {
          this.loadPokemonEquipo();
        });
      }
    });
  }

  getPokemonEquipo(poke: PokemonInterface): Promise<PokemonInterface> {
    return this.database.executeSql(`SELECT * FROM equipo WHERE numero_nacional = ?`, [poke.numero_nacional]).then(data => {
      return {
        numero_nacional: data.rows.item(0).numero_nacional, numero_regional: data.rows.item(0).numero_regional, region: data.rows.item(0).region, nombre: data.rows.item(0).nombre, tipoUno: data.rows.item(0).tipoUno, tipoDos: data.rows.item(0).tipoDos,
        genero: data.rows.item(0).genero, descripcion: data.rows.item(0).descripcion, numeroEvolucion: data.rows.item(0).numeroEvolucion, nivelEvolucion: data.rows.item(0).nivelEvolucion, evoluciona: data.rows.item(0).evoluciona,
        nivel: (data.rows.item(0).nivel !== undefined ? data.rows.item(0).nivel : ''), experiencia: (data.rows.item(0).experiencia !== undefined ? data.rows.item(0).experiencia : ''),
        ContenedorExp: (data.rows.item(0).ContenedorExp !== undefined ? data.rows.item(0).ContenedorExp : ''),
        hp: (data.rows.item(0).hp !== undefined ? data.rows.item(0).hp : ''), hp_max: (data.rows.item(0).hp_max !== undefined ? data.rows.item(0).hp_max : ''),
        ataque: (data.rows.item(0).ataque !== undefined ? data.rows.item(0).ataque : ''), defensa: (data.rows.item(0).defensa !== undefined ? data.rows.item(0).defensa : ''),
        ataque_especial: (data.rows.item(0).ataque_especial !== undefined ? data.rows.item(0).ataque_especial : ''), defensa_especial: (data.rows.item(0).defensa_especial !== undefined ? data.rows.item(0).defensa_especial : ''),
        velocidad: (data.rows.item(0).velocidad !== undefined ? data.rows.item(0).velocidad : ''), estado: (data.rows.item(0).estado !== undefined ? data.rows.item(0).estado : ''),
        IV: (data.rows.item(0).IV !== undefined ? data.rows.item(0).IV : ''), EV: (data.rows.item(0).EV !== undefined ? data.rows.item(0).EV : ''), capturado: (data.rows.item(0).capturado !== undefined ? data.rows.item(0).capturado : ''), favorito: (data.rows.item(0).favorito !== undefined ? data.rows.item(0).favorito : ''),
        ball: (data.rows.item(0).ball !== undefined ? data.rows.item(0).ball : '')
      }
    });
  }

  deletePokemonEquipo(poke: PokemonInterface) {
    return this.database.executeSql(`DELETE FROM equipo WHERE numero_nacional = ?`, [poke.numero_nacional]).then(_ => {
      this.loadPokemon(poke.region);
    });
  }

  updatePokemonEquipo(poke: PokemonInterface) {
    let data = [poke.numero_nacional, , poke.numero_regional];
    return this.database.executeSql(`UPDATE equipo SET porConstruir WHERE numero_nacional = ${poke.numero_nacional}`, data).then(data => {
      this.loadPokemon(poke.region);
    })
  }

  /*************************************************
  **************** Pokemon *************************
  *************************************************/

  loadPokemon(region: string) {
    return this.database.executeSql(`SELECT * FROM ${region}`, []).then(data => {
      let poke: PokemonInterface[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {

          poke.push({
            numero_nacional: data.rows.item(i).numero_nacional, numero_regional: data.rows.item(i).numero_regional, region: data.rows.item(i).region, nombre: data.rows.item(i).nombre, tipoUno: data.rows.item(i).tipoUno, tipoDos: data.rows.item(i).tipoDos,
            genero: data.rows.item(i).genero, descripcion: data.rows.item(i).descripcion, numeroEvolucion: data.rows.item(i).numeroEvolucion, nivelEvolucion: data.rows.item(i).nivelEvolucion, evoluciona: data.rows.item(i).evoluciona,
            nivel: data.rows.item(i).nivel, experiencia: data.rows.item(i).experiencia, ContenedorExp: data.rows.item(i).ContenedorExp, hp: data.rows.item(i).hp, hp_max: data.rows.item(i).hp_max, ataque: data.rows.item(i).ataque, defensa: data.rows.item(i).defensa,
            ataque_especial: data.rows.item(i).ataque_especial, defensa_especial: data.rows.item(i).defensa_especial, velocidad: data.rows.item(i).velocidad, estado: data.rows.item(i).estado,
            IV: data.rows.item(i).IV, EV: data.rows.item(i).EV, capturado: data.rows.item(i).capturado, favorito: data.rows.item(i).favorito, ball: data.rows.item(i).ball
          });
        }
      }
      switch (region) {
        case 'kanto': this.pokemonkanto.next(poke); break;
        case 'johto': this.pokemonjohto.next(poke); break;
        case 'hoenn': this.pokemonhoenn.next(poke); break;
      }
    });
  }

  addPokemon(poke: PokemonInterface) {
    let data = [poke.numero_nacional, poke.numero_regional, poke.region, poke.nombre, poke.tipoUno, poke.tipoDos, poke.genero, poke.descripcion, poke.numeroEvolucion, poke.nivelEvolucion, poke.evoluciona, poke.nivel,
    poke.experiencia, poke.ContenedorExp, poke.hp, poke.hp_max, poke.ataque, poke.defensa, poke.ataque_especial, poke.defensa_especial, poke.velocidad, poke.estado,
    poke.IV, poke.EV, poke.capturado, poke.favorito, poke.ball];
    console.log(`INSERT or IGNORE INTO ${poke.region} VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, data);
    return this.database.executeSql(`INSERT or IGNORE INTO ${poke.region} VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, data).then(data => {
      this.loadPokemon(poke.region);
    });
  }

  getPokemon(poke: PokemonInterface): Promise<PokemonInterface> {
    return this.database.executeSql(`SELECT * FROM ${poke.region} WHERE numero_nacional = ?`, [poke.numero_nacional]).then(data => {
      return {
        numero_nacional: data.rows.item(0).numero_nacional, numero_regional: data.rows.item(0).numero_regional, region: data.rows.item(0).region, nombre: data.rows.item(0).nombre, tipoUno: data.rows.item(0).tipoUno, tipoDos: data.rows.item(0).tipoDos,
        genero: data.rows.item(0).genero, descripcion: data.rows.item(0).descripcion, numeroEvolucion: data.rows.item(0).numeroEvolucion, nivelEvolucion: data.rows.item(0).nivelEvolucion, evoluciona: data.rows.item(0).evoluciona,
        nivel: (data.rows.item(0).nivel !== undefined ? data.rows.item(0).nivel : ''), experiencia: (data.rows.item(0).experiencia !== undefined ? data.rows.item(0).experiencia : ''),
        ContenedorExp: (data.rows.item(0).ContenedorExp !== undefined ? data.rows.item(0).ContenedorExp : ''),
        hp: (data.rows.item(0).hp !== undefined ? data.rows.item(0).hp : ''), hp_max: (data.rows.item(0).hp_max !== undefined ? data.rows.item(0).hp_max : ''),
        ataque: (data.rows.item(0).ataque !== undefined ? data.rows.item(0).ataque : ''), defensa: (data.rows.item(0).defensa !== undefined ? data.rows.item(0).defensa : ''),
        ataque_especial: (data.rows.item(0).ataque_especial !== undefined ? data.rows.item(0).ataque_especial : ''), defensa_especial: (data.rows.item(0).defensa_especial !== undefined ? data.rows.item(0).defensa_especial : ''),
        velocidad: (data.rows.item(0).velocidad !== undefined ? data.rows.item(0).velocidad : ''), estado: (data.rows.item(0).estado !== undefined ? data.rows.item(0).estado : ''),
        IV: (data.rows.item(0).IV !== undefined ? data.rows.item(0).IV : ''), EV: (data.rows.item(0).EV !== undefined ? data.rows.item(0).EV : ''), capturado: (data.rows.item(0).capturado !== undefined ? data.rows.item(0).capturado : ''), favorito: (data.rows.item(0).favorito !== undefined ? data.rows.item(0).favorito : ''),
        ball: (data.rows.item(0).ball !== undefined ? data.rows.item(0).ball : '')
      }
    });
  }

  deletePokemon(poke: PokemonInterface) {
    return this.database.executeSql(`DELETE FROM ${poke.region} WHERE numero_nacional = ?`, [poke.numero_nacional]).then(_ => {
      this.loadPokemon(poke.region);
    });
  }

  updatePokemon(poke: PokemonInterface) {
    let data = [poke.numero_nacional, , poke.numero_regional];
    return this.database.executeSql(`UPDATE ${poke.region} SET porConstruir WHERE numero_nacional = ${poke.numero_nacional}`, data).then(data => {
      this.loadPokemon(poke.region);
    })
  }

  getPokemonsAtrapados(): Observable<PokemonInterface[]> {
    return this.pokemonCapturados.asObservable();
  }

  getPokemonsEquipo(): Observable<PokemonInterface[]> {
    return this.pokemonCapturados.asObservable();
  }

  getPokemons(region: string): Observable<PokemonInterface[]> {
    switch (region) {
      case 'kanto':
        this.pokemons = this.pokemonkanto.asObservable();
        break;
      case 'johto':
        this.pokemons = this.pokemonjohto.asObservable();
        break;
      case 'hoenn':
        this.pokemons = this.pokemonhoenn.asObservable();
        break;
      case 'sinnoh':
        this.pokemons = this.pokemonkanto.asObservable();
        break;
      case 'teselia':
        this.pokemons = this.pokemonkanto.asObservable();
        break;
      case 'kalos':
        this.pokemons = this.pokemonkanto.asObservable();
        break;
      case 'alola':
        this.pokemons = this.pokemonkanto.asObservable();
        break;
    }
    return this.pokemons;
  }

  private addPokemonBD() {
    for (let i = 1; i < 806; i++) {
      let pokemon: PokemonInterface;
      let num: string;
      if (i < 10) {
        num = '00' + i;
        pokemon = this.poke.getStatsPokemon(num);
        this.addPokemon(pokemon);
      } else if (i >= 10 && i < 100) {
        num = '0' + i;
        pokemon = this.poke.getStatsPokemon(num);
        this.addPokemon(pokemon);
      } else if (i >= 100) {
        num = '' + i;
        pokemon = this.poke.getStatsPokemon(num);
        this.addPokemon(pokemon);
      }
    }
  }

  getnumero_nacional() {
    return this.numero_nacional;
  }

  setnumero_nacional(numero_nacional: string) {
    this.numero_nacional = numero_nacional;
  }

  getEntrenador() {
    return this.entrenador;
  }

  setEntrenador(entrenador: Entrenador) {
    this.entrenador = entrenador;
  }

}
