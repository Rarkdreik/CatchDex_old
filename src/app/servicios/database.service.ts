import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { PokemonInterface } from '../modelo/Pokemons';
import { Entrenador } from '../modelo/entrenador';
import { StatsService } from './estadisticas.service';
import { environment } from '../../environments/environment';
import { AlertsService } from './alerts.service';

@Injectable({
  providedIn: 'root'
})

export class DatabaseService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private pokemons: Observable<PokemonInterface[]> = new Observable<PokemonInterface[]>();
  private pokemonkanto = new BehaviorSubject([]); pokemonjohto = new BehaviorSubject([]); pokemonhoenn = new BehaviorSubject([]);
  private pokemonCapturados = new BehaviorSubject([]); equipoPokemon = new BehaviorSubject([]);
  private Entrenador = new BehaviorSubject([]);

  private entrenador: Entrenador = { nick: 'RarkRepo', exp: 0, nivel: 10, pokeBalls: 20, superBalls: 10, ultraBalls: 5, masterBalls: 1 };
  // equipoPokemon: PokemonInterface[];
  private numero_nacional: string = '';

  constructor(
    private plt: Platform,
    private sqlitePorter: SQLitePorter,
    private sqlite: SQLite,
    private http: HttpClient,
    private poke: StatsService,
    private alerta: AlertsService
  ) {
    console.log('base de datos 1');
    this.plt.ready().then(() => {
      // try {
        this.sqlite.create({
          name: 'pokedex.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          this.database = db;
          this.seedDatabase();
        });
      // } catch (error) {
      //   this.alerta.alertaSimple('Error de Sqlite', 'No se ha podido crear la base de datos.', 'error');
      // }
    });
  }

  private seedDatabase() {
    console.log('base de datos 21');
    this.http.get('../../../assets/sqlquery/sqlTablasPokedex.sql', { responseType: 'text' })
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(_ => {
            this.database.executeSql(`SELECT * FROM kanto`, []).then(data => { if (data.rows.length < 2) { this.addPokemonBD(); } });
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
    console.log('base de datos 2');
  }

  getDatabaseState() {
    console.log('base de datos 3');
    return this.dbReady.asObservable();
  }

  /*************************************************
  **************** Entrenador **********************
  *************************************************/

  loadEntrenador() {
    console.log('base de datos 4');
    return this.database.executeSql(`SELECT * FROM entrenador`, []).then(data => {
      let entrenador: Entrenador[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {

          entrenador.push({
            nick: data.rows.item(i).nick, exp: data.rows.item(i).exp, nivel: data.rows.item(i).nivel, pokeBalls: data.rows.item(i).pokeBalls,
            superBalls: data.rows.item(i).superBalls, ultraBalls: data.rows.item(i).ultraBalls, masterBalls: data.rows.item(i).masterBalls
          });
        }
      }
      this.Entrenador.next(entrenador);
    });
  }

  addEntrenador(entrenador: Entrenador) {
    console.log('base de datos 5');
    let data = Object.values(entrenador);

    return this.database.executeSql(`INSERT or IGNORE INTO entrenador VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, data).then(data => {
      this.loadEntrenador();
    });
  }

  getEntrenadorPromise(entrenador: Entrenador): Promise<Entrenador> {
    console.log('base de datos 6');
    return this.database.executeSql(`SELECT * FROM entrenador WHERE nick = ?`, [entrenador.nick]).then(data => {
      return {
        nick: data.rows.item(0).nick, exp: data.rows.item(0).exp, nivel: data.rows.item(0).nivel, pokeBalls: data.rows.item(0).pokeBalls,
        superBalls: data.rows.item(0).superBalls, ultraBalls: data.rows.item(0).ultraBalls, masterBalls: data.rows.item(0).masterBalls,
      }
    });
  }

  deleteEntrenador(entrenador: Entrenador) {
    console.log('base de datos 7');
    return this.database.executeSql(`DELETE FROM entrenador WHERE nick = ?`, [entrenador.nick]).then(_ => {
      this.loadEntrenador();
    });
  }

  updateEntrenador(entrenador: Entrenador) {
    console.log('base de datos 8');
    let data = [entrenador.nick];
    return this.database.executeSql(`UPDATE entrenador SET porConstruir WHERE nick = ${entrenador.nick}`, data).then(data => {
      this.loadEntrenador();
    })
  }

  /*************************************************
  **************** Pokemon  Atrapados **************
  *************************************************/

  loadPokemonAtrapado() {
    console.log('base de datos 9');
    return this.database.executeSql(`SELECT * FROM atrapado`, []).then(data => {
      let poke: PokemonInterface[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {

          poke.push({
            numero_nacional: data.rows.item(i).numero_nacional, numero_regional: data.rows.item(i).numero_regional, region: data.rows.item(i).region, nombre: data.rows.item(i).nombre, tipo_uno: data.rows.item(i).tipo_uno, tipo_dos: data.rows.item(i).tipo_dos,
            genero: data.rows.item(i).genero, descripcion: data.rows.item(i).descripcion, numero_evolucion: data.rows.item(i).numero_evolucion, nivel_evolucion: data.rows.item(i).nivel_evolucion, evolucion: data.rows.item(i).evolucion,
            nivel: data.rows.item(i).nivel, exp: data.rows.item(i).exp, hp: data.rows.item(i).hp, hp_max: data.rows.item(i).hp_max, ataque: data.rows.item(i).ataque, defensa: data.rows.item(i).defensa,
            ataque_especial: data.rows.item(i).ataque_especial, defensa_especial: data.rows.item(i).defensa_especial, velocidad: data.rows.item(i).velocidad, estado: data.rows.item(i).estado,
            IV: data.rows.item(i).IV, EV: data.rows.item(i).EV, ball: data.rows.item(i).ball
          });
        }
      }
      this.pokemonCapturados.next(poke);
    });
  }

  addPokemonAtrapado(poke: PokemonInterface) {
    console.log('base de datos 10');
    let data = Object.values(poke);
    return this.database.executeSql(environment.sql_insert + `atrapado` + environment.sql_poke_columnas, data).then(ok => {
      this.loadPokemonAtrapado();
    });
  }

  getPokemonAtrapado(poke: PokemonInterface): Promise<PokemonInterface> {
    console.log('base de datos 11');
    return this.database.executeSql(`SELECT * FROM atrapado WHERE numero_nacional = ?`, [poke.numero_nacional]).then(data => {
      return {
        numero_nacional: data.rows.item(0).numero_nacional, numero_regional: data.rows.item(0).numero_regional, region: data.rows.item(0).region, nombre: data.rows.item(0).nombre, tipo_uno: data.rows.item(0).tipo_uno, tipo_dos: data.rows.item(0).tipo_dos,
        genero: data.rows.item(0).genero, descripcion: data.rows.item(0).descripcion, numero_evolucion: data.rows.item(0).numero_evolucion, nivel_evolucion: data.rows.item(0).nivel_evolucion, evolucion: data.rows.item(0).evolucion,
        nivel: (data.rows.item(0).nivel !== undefined ? data.rows.item(0).nivel : ''), exp: (data.rows.item(0).exp !== undefined ? data.rows.item(0).exp : ''),

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
    console.log('base de datos 12');
    return this.database.executeSql(`DELETE FROM atrapado WHERE numero_nacional = ?`, [poke.numero_nacional]).then(_ => {
      this.loadPokemon(poke.region);
    });
  }

  updatePokemonAtrapado(poke: PokemonInterface) {
    console.log('base de datos 13');
    let data = [poke.numero_nacional, , poke.numero_regional];
    return this.database.executeSql(`UPDATE atrapado SET porConstruir WHERE numero_nacional = ${poke.numero_nacional}`, data).then(data => {
      this.loadPokemon(poke.region);
    })
  }


  /*************************************************
  **************** EQUIPO  POKEMON *****************
  *************************************************/

  loadPokemonEquipo() {
    console.log('base de datos 14');
    return this.database.executeSql(`SELECT * FROM equipo`, []).then(data => {
      let poke: PokemonInterface[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {

          poke.push({
            numero_nacional: data.rows.item(i).numero_nacional, numero_regional: data.rows.item(i).numero_regional, region: data.rows.item(i).region, nombre: data.rows.item(i).nombre, tipo_uno: data.rows.item(i).tipo_uno, tipo_dos: data.rows.item(i).tipo_dos,
            genero: data.rows.item(i).genero, descripcion: data.rows.item(i).descripcion, numero_evolucion: data.rows.item(i).numero_evolucion, nivel_evolucion: data.rows.item(i).nivel_evolucion, evolucion: data.rows.item(i).evolucion,
            nivel: data.rows.item(i).nivel, exp: data.rows.item(i).exp, hp: data.rows.item(i).hp, hp_max: data.rows.item(i).hp_max, ataque: data.rows.item(i).ataque, defensa: data.rows.item(i).defensa,
            ataque_especial: data.rows.item(i).ataque_especial, defensa_especial: data.rows.item(i).defensa_especial, velocidad: data.rows.item(i).velocidad, estado: data.rows.item(i).estado,
            IV: data.rows.item(i).IV, EV: data.rows.item(i).EV, ball: data.rows.item(i).ball
          });
        }
      }
      this.equipoPokemon.next(poke);
    });
  }

  addPokemonEquipo(poke: PokemonInterface) {
    console.log('base de datos 15');
    this.equipoPokemon.subscribe(pokemons => {
      if (pokemons.length <= 6) {
        let data = Object.values(poke);
        return this.database.executeSql(environment.sql_insert + `equipo` + environment.sql_poke_columnas, data).then(data => {
          this.loadPokemonEquipo();
        });
      }
    });
  }

  getPokemonEquipo(poke: PokemonInterface): Promise<PokemonInterface> {
    return this.database.executeSql(`SELECT * FROM equipo WHERE numero_nacional = ?`, [poke.numero_nacional]).then(data => {
      return {
        numero_nacional: data.rows.item(0).numero_nacional, numero_regional: data.rows.item(0).numero_regional, region: data.rows.item(0).region, nombre: data.rows.item(0).nombre, tipo_uno: data.rows.item(0).tipo_uno, tipo_dos: data.rows.item(0).tipo_dos,
        genero: data.rows.item(0).genero, descripcion: data.rows.item(0).descripcion, numero_evolucion: data.rows.item(0).numero_evolucion, nivel_evolucion: data.rows.item(0).nivel_evolucion, evolucion: data.rows.item(0).evolucion,
        nivel: (data.rows.item(0).nivel !== undefined ? data.rows.item(0).nivel : ''), exp: (data.rows.item(0).exp !== undefined ? data.rows.item(0).exp : ''),

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
            numero_nacional: data.rows.item(i).numero_nacional, numero_regional: data.rows.item(i).numero_regional, region: data.rows.item(i).region, nombre: data.rows.item(i).nombre, tipo_uno: data.rows.item(i).tipo_uno, tipo_dos: data.rows.item(i).tipo_dos,
            genero: data.rows.item(i).genero, descripcion: data.rows.item(i).descripcion, numero_evolucion: data.rows.item(i).numero_evolucion, nivel_evolucion: data.rows.item(i).nivel_evolucion, evolucion: data.rows.item(i).evolucion,
            nivel: data.rows.item(i).nivel, exp: data.rows.item(i).exp, hp: data.rows.item(i).hp, hp_max: data.rows.item(i).hp_max, ataque: data.rows.item(i).ataque, defensa: data.rows.item(i).defensa,
            ataque_especial: data.rows.item(i).ataque_especial, defensa_especial: data.rows.item(i).defensa_especial, velocidad: data.rows.item(i).velocidad, estado: data.rows.item(i).estado,
            IV: data.rows.item(i).IV, EV: data.rows.item(i).EV, ball: data.rows.item(i).ball
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
    let data = Object.values(poke);
    return this.database.executeSql(environment.sql_insert + `${poke.region} ` + environment.sql_poke_columnas, data).then(data => {
      this.loadPokemon(poke.region);
    });
  }

  getPokemon(poke: PokemonInterface): Promise<PokemonInterface> {
    return this.database.executeSql(`SELECT * FROM ${poke.region} WHERE numero_nacional = ?`, [poke.numero_nacional]).then(data => {
      let pokemon: PokemonInterface;
      return pokemon = data.rows.item(0);
      // return {
      //   numero_nacional: data.rows.item(0).numero_nacional, numero_regional: data.rows.item(0).numero_regional, region: data.rows.item(0).region, nombre: data.rows.item(0).nombre, tipo_uno: data.rows.item(0).tipo_uno, tipo_dos: data.rows.item(0).tipo_dos,
      //   genero: data.rows.item(0).genero, descripcion: data.rows.item(0).descripcion, numero_evolucion: data.rows.item(0).numero_evolucion, nivel_evolucion: data.rows.item(0).nivel_evolucion, evolucion: data.rows.item(0).evolucion,
      //   nivel: (data.rows.item(0).nivel !== undefined ? data.rows.item(0).nivel : ''), exp: (data.rows.item(0).exp !== undefined ? data.rows.item(0).exp : ''),

      //   hp: (data.rows.item(0).hp !== undefined ? data.rows.item(0).hp : ''), hp_max: (data.rows.item(0).hp_max !== undefined ? data.rows.item(0).hp_max : ''),
      //   ataque: (data.rows.item(0).ataque !== undefined ? data.rows.item(0).ataque : ''), defensa: (data.rows.item(0).defensa !== undefined ? data.rows.item(0).defensa : ''),
      //   ataque_especial: (data.rows.item(0).ataque_especial !== undefined ? data.rows.item(0).ataque_especial : ''), defensa_especial: (data.rows.item(0).defensa_especial !== undefined ? data.rows.item(0).defensa_especial : ''),
      //   velocidad: (data.rows.item(0).velocidad !== undefined ? data.rows.item(0).velocidad : ''), estado: (data.rows.item(0).estado !== undefined ? data.rows.item(0).estado : ''),
      //   IV: (data.rows.item(0).IV !== undefined ? data.rows.item(0).IV : ''), EV: (data.rows.item(0).EV !== undefined ? data.rows.item(0).EV : ''), capturado: (data.rows.item(0).capturado !== undefined ? data.rows.item(0).capturado : ''), favorito: (data.rows.item(0).favorito !== undefined ? data.rows.item(0).favorito : ''),
      //   ball: (data.rows.item(0).ball !== undefined ? data.rows.item(0).ball : '')
      // }
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
