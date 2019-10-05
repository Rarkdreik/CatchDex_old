import { Component, OnInit, ViewChild } from '@angular/core';
import { PokemonInterface } from 'src/app/modelo/Pokemons';
import { PosibilidadCapturaService } from 'src/app/servicios/posibilidad-captura.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { AudioService } from 'src/app/servicios/audio.service';
import { ModalPage } from '../modal/modal.page';
import { Entrenador } from 'src/app/modelo/entrenador';
import { PokemonService } from 'src/app/servicios/pokemon.service';
import { DatabaseService } from 'src/app/servicios/database.service';
// import undefined = require('firebase/empty-import');

@Component({
  selector: 'app-captura-prueba',
  templateUrl: './captura-prueba.page.html',
  styleUrls: ['./captura-prueba.page.scss'],
})

export class CapturaPruebaPage implements OnInit {

  id_ball: boolean;
  // Pokemon a capturar
  pokeSalvaje: PokemonInterface = {
    numero_nacional: '', numero_regional: '', region: '', nombre: '', tipoUno: '', tipoDos: '', genero: '',
    descripcion: '', numeroEvolucion: 0, nivelEvolucion: 0, evoluciona: ''};
  // Variables de Audio
  audioCogerPokeball: any; audioCrecePokeball: any; audioAtrapaPokeball: any; audioSacudidaPokeball: any;
  audioCapturado: any; audioEscapado: any; audioEncogePokeball: any; audioRegresa: any;
  // Variables de Diseño
  pokeOculto: String = 'show'; ocultar1: String = 'hide'; ocultar2: String = 'hide'; ocultar3: String = 'hide'; ocultar4: String = 'hide';
  infoEntrenador: String = 'none'; infoPokemon: String = 'none'; fabVisible: Boolean = false; modal: Boolean = true;
  flip: string = '';
  // Variables de Configuracion
  capturados: boolean; genero: boolean;
  barraHP_Max: String = '341'; barraHP: any; barraHP2: any; barraExp: any; vidaPoke_Max: number; vidaPoke: number; numEstado: any = 0;
  ratioBall: any = 0; ratioPoke: any = 255; ratioCaptura: any = 0; bonus: any = 0; rand: any = 0; a: any = 0;
  experienciaGanada: any = 0; experienciaTotal: any = 0; numNacional: any;
  // Variables de Clases
  pokemons: any[] = [];
  entrenador: Entrenador = { Nick: 'RarkCaptura', Nombre: 'Rik', Genero: 'hombre', Exp: 0, Nivel: 36, ContenedorExp: 50, 
    MultiplicadorExp: 2, ATK: 10, Capturados: 0, Fav: 0, PokeBalls: 20, SuperBalls: 10, UltraBalls: 5, MasterBalls: 1};
  equipoPokemon: PokemonInterface[] = [];
  pokemonBatalla: PokemonInterface;
  pokemon: PokemonInterface = {
    numero_nacional: '001', numero_regional: '001', region: 'kanto', nombre: '', tipoUno: '', tipoDos: '', genero: '',
    descripcion: '', numeroEvolucion: 0, nivelEvolucion: 0, evoluciona: '002'};
  // Variables de batalla
  daño: any; bonustipo: number = 1; efectividad: number = 1; variacion: number = 1;
  aux: number = 0; potencia: number = 100;

  constructor(
    public RatioCaptura: PosibilidadCapturaService,
    public stats: PokemonService,
    public route: Router,
    public router: ActivatedRoute,
    public fire: FirebaseService,
    public loadingController: LoadingController,
    public modalController: ModalController,
    private audio: AudioService,
    private db: DatabaseService,
    private poke: PokemonService
  ) {
    this.numNacional = this.router.snapshot.paramMap.get('id');
    this.cargarAudios();
    this.apareceSalvaje();
    this.entrenador = this.db.getEntrenador();
    this.barraHP = { width: '100%' };
    this.barraHP2 = { width: '100%' };

    this.pokemon = this.poke.getStatsPokemon('252');
    this.pokemon = this.setCaracteristicas(this.pokemon);
    this.equipoPokemon.push(this.pokemon);
    
    this.pokemon = this.poke.getStatsPokemon('255');
    this.pokemon = this.setCaracteristicas(this.pokemon);
    this.equipoPokemon.push(this.pokemon);
    
    this.pokemon = this.poke.getStatsPokemon('258');
    this.pokemon = this.setCaracteristicas(this.pokemon);
this.pokemonBatalla = this.pokemon;
    this.equipoPokemon.push(this.pokemon);
    
    this.pokemon = this.poke.getStatsPokemon('341');
    this.pokemon = this.setCaracteristicas(this.pokemon);
    this.equipoPokemon.push(this.pokemon);
    
    this.pokemon = this.poke.getStatsPokemon('360');
    this.pokemon = this.setCaracteristicas(this.pokemon);
    this.equipoPokemon.push(this.pokemon);
    
    this.pokemon = this.poke.getStatsPokemon('361');
    this.pokemon = this.setCaracteristicas(this.pokemon);
    this.equipoPokemon.push(this.pokemon);

    // this.vidaPoke_Max = 100;
    // this.vidaPoke_Max = this.pokeSalvaje.hp_max;
    this.barraExp = { width: '0%' };
  }

  atacar() {

    this.calcular_variables(this.pokemonBatalla, this.pokeSalvaje);
    this.pokeSalvaje.hp = parseInt(this.pokeSalvaje.hp + '', 10);
    this.pokeSalvaje.hp_max = parseInt(this.pokeSalvaje.hp_max + '', 10);

    if (this.pokeSalvaje.hp >= this.daño && this.pokeSalvaje.hp != 0) {
      this.pokeSalvaje.hp -= parseInt(this.daño + '', 10);
      this.barraHP = { width: ((this.pokeSalvaje.hp * 100) / this.pokeSalvaje.hp_max) + '%' };
      this.ser_atacado();
    } else {
      this.barraHP = { width: '0%' };
      this.pokeSalvaje.hp = 0;
      this.pokemonBatalla = this.obtenerExpPokemon(this.pokemonBatalla, this.pokeSalvaje, this.barraExp)
      this.obtenerExpEntrenador();
    }
  }

  private ser_atacado() {
    this.calcular_variables(this.pokeSalvaje, this.pokemonBatalla);
    this.pokemonBatalla.hp = parseInt(this.pokemonBatalla.hp + '', 10);
    this.pokemonBatalla.hp_max = parseInt(this.pokemonBatalla.hp_max + '', 10);

    if (this.pokemonBatalla.hp >= this.daño && this.pokemonBatalla.hp != 0) {
      this.pokemonBatalla.hp -= parseInt(this.daño + '', 10);
      this.barraHP2 = { width: ((this.pokemonBatalla.hp * 100) / this.pokemonBatalla.hp_max) + '%', };
    } else {
      this.barraHP2 = { width: '0%' };
      this.pokemonBatalla.hp = 0;
      this.pokeSalvaje = this.obtenerExpPokemon(this.pokeSalvaje, this.pokemonBatalla)
    }
  }

  cambiar_pokemon(poke_cambio: PokemonInterface) {
    this.pokemonBatalla = poke_cambio;
    this.calcular_variables(this.pokemonBatalla, this.pokeSalvaje);
  }

  capturarPokeBall() {
    if (this.entrenador.PokeBalls > 0) { this.entrenador.PokeBalls = (this.entrenador.PokeBalls - 1);
      // this.modal = false;

      setTimeout(() => {
        this.modal = true;
      }, 7000);

      this.resetAnimacion('pokeball', 'catch1', 'star1', 'star2', 'star3');
      this.audio.play('audioAtrapando');
      this.pokeOculto = 'hide'; this.ocultar1 = 'show'; this.ocultar2 = 'hide'; this.ocultar3 = 'hide'; this.ocultar4 = 'hide';

      if (this.captura(this.pokeSalvaje.nombre, 'poke')) {
        this.capturados = true;
        this.pokeSalvaje.capturado = 1;
        this.pokeSalvaje.ball = 'pokeball';
        // this.anadirPokemon();

        setTimeout(() => {
          this.audio.play('audioSacudidaPokeball');
          setTimeout(() => {
            this.audio.play('audioCapturado');
            setTimeout(() => {
              this.route.navigateByUrl('/tabs/tab2');
            }, 1000);
          }, 4000);
        }, 3000);

      } else {
        setTimeout(() => {
          this.audio.play('audioSacudidaPokeball');
          setTimeout(() => {
            this.audio.play('audioEscapado');
            this.ocultar1 = 'hide';
            this.pokeOculto = 'show';
            this.capturados = false;
            this.pokeSalvaje.ball = '';
          }, 3000);
        }, 3000);
      }
    } else {
      console.log('No tienes poke balls');
      alert('No tienes poke balls');
    }
  }

  capturarSuperBall() {
    if (this.entrenador.SuperBalls > 0) {
      this.entrenador.SuperBalls = (this.entrenador.SuperBalls - 1);

      this.modal = false;
      this.resetAnimacion('superball', 'catch1', 'star1', 'star2', 'star3');

      setTimeout(() => {
        this.modal = true;
      }, 7000);

      this.audio.play('audioAtrapando');
      this.pokeOculto = 'hide'; this.ocultar1 = 'hide'; this.ocultar2 = 'show'; this.ocultar3 = 'hide'; this.ocultar4 = 'hide';

      if (this.captura(this.pokeSalvaje.nombre, 'super')) {
        this.capturados = true;
        this.pokeSalvaje.capturado = 1;
        this.pokeSalvaje.ball = 'superball';
        this.anadirPokemon();
        // this.obtenerExp();

        setTimeout(() => {
          this.audio.play('audioSacudidaPokeball');
          setTimeout(() => {
            this.audio.play('audioCapturado');
            setTimeout(() => {
              this.route.navigateByUrl('/tabs/tab2');
            }, 1000);
          }, 4000);
        }, 3000);

      } else {
        setTimeout(() => {
          this.audio.play('audioSacudidaPokeball');
          setTimeout(() => {
            this.audio.play('audioEscapado');
            this.ocultar2 = 'hide';
            this.pokeOculto = 'show';
            this.capturados = false;
            this.pokeSalvaje.ball = '';
          }, 3000);
        }, 3000);
      }
    } else {
      console.log('No tienes super balls');
      alert('No tienes super balls');
    }
  }

  capturarUltraBall() {
    if (this.entrenador.UltraBalls > 0) {
      this.entrenador.UltraBalls = (this.entrenador.UltraBalls - 1);

      this.modal = false;
      this.resetAnimacion('ultraball', 'catch1', 'star1', 'star2', 'star3');

      setTimeout(() => {
        this.modal = true;
      }, 7000);

      this.audio.play('audioAtrapando');
      this.pokeOculto = 'hide'; this.ocultar1 = 'hide'; this.ocultar2 = 'hide'; this.ocultar3 = 'show'; this.ocultar4 = 'hide';

      if (this.captura(this.pokeSalvaje.nombre, 'ultra')) {
        this.capturados = true;
        this.pokeSalvaje.capturado = 1;
        this.pokeSalvaje.ball = 'ultraball';
        this.anadirPokemon();
        // this.obtenerExp();

        setTimeout(() => {
          this.audio.play('audioSacudidaPokeball');
          setTimeout(() => {

            this.audio.play('audioCapturado');
            setTimeout(() => {
              this.route.navigateByUrl('/tabs/tab2');
            }, 1000);
          }, 4000);
        }, 3000);
      } else {
        setTimeout(() => {
          this.audio.play('audioSacudidaPokeball');
          setTimeout(() => {
            this.audio.play('audioEscapado');
            this.ocultar3 = 'hide';
            this.pokeOculto = 'show';
            this.capturados = false;
            this.pokeSalvaje.ball = '';
          }, 3000);
        }, 3000);
      }
    } else {
      console.log('No tienes ultra balls');
      alert('No tienes ultra balls');
    }
  }

  capturarMasterBall() {
    if (this.entrenador.MasterBalls > 0) {
      this.entrenador.MasterBalls = (this.entrenador.MasterBalls - 1);

      this.modal = false;
      this.resetAnimacion('masterball', 'catch1', 'star1', 'star2', 'star3');

      setTimeout(() => {
        this.modal = true;
      }, 7000);

      this.audio.play('audioAtrapando');
      this.pokeOculto = 'hide'; this.ocultar1 = 'hide'; this.ocultar2 = 'hide'; this.ocultar3 = 'hide'; this.ocultar4 = 'show';

      if (this.captura(this.pokeSalvaje.nombre, 'master')) {
        this.capturados = true;
        this.pokeSalvaje.capturado = 1;
        this.pokeSalvaje.ball = 'masterball';
        this.anadirPokemon();
        // this.obtenerExp();

        setTimeout(() => {
          this.audio.play('audioSacudidaPokeball');
          setTimeout(() => {
            this.audio.play('audioCapturado');
            setTimeout(() => {
              this.route.navigateByUrl('/tabs/tab2');
            }, 1000);
          }, 4000);
        }, 3000);

      } else {
        setTimeout(() => {
          this.audio.play('audioSacudidaPokeball');
          setTimeout(() => {
            this.audio.play('audioEscapado');
            this.ocultar4 = 'hide';
            this.pokeOculto = 'show';
            this.capturados = false;
            this.pokeSalvaje.ball = '';
          }, 3000);
        }, 3000);
      }
    } else {
      console.log('No tienes master balls');
      alert('No tienes master balls');
    }
  }

  private setCaracteristicas(pokemon: PokemonInterface) {
    let aux: number; let min: number; let max: number;
    // pokemon.nivel = parseInt(((Math.random() * ((this.entrenador.Nivel - 2) - (this.entrenador.Nivel + 10) + 1) + (this.entrenador.Nivel + 10))) + '', 10);
    // pokemon.nivel = parseInt(pokemon.nivel + '', 10);
    if ((this.entrenador.Nivel - 5) > 0) { min = (this.entrenador.Nivel - 5); } else { min = 1; }
    max = this.entrenador.Nivel + 5;
    pokemon.nivel = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log(`${(this.entrenador.Nivel)} prueba... ${(this.entrenador.Nivel - 5)} ... nivel ${pokemon.nivel} min ${min} max ${max} numero final ${Math.floor(Math.random() * (max - min + 1)) + min}`);
    console.log(this.entrenador);
    pokemon.IV = 31; pokemon.EV = 252; aux = (pokemon.IV + (pokemon.EV/ 4) + 100);

    pokemon.hp_max = parseInt(((((2 * pokemon.hp_max + aux) * pokemon.nivel)/100) + 10) + '', 10);
    pokemon.hp = pokemon.hp_max;
    pokemon.ataque = parseInt(((((2 * pokemon.ataque + aux) * pokemon.nivel) / 100) + 5) + '', 10);
    pokemon.defensa = parseInt(((((2 * pokemon.defensa + aux) * pokemon.nivel)/100) + 5) + '', 10);
    pokemon.ataque_especial = parseInt(((((2 * pokemon.ataque_especial + aux) * pokemon.nivel) / 100) + 5) + '', 10);
    pokemon.defensa_especial = parseInt(((((2 * pokemon.defensa_especial + aux) * pokemon.nivel) / 100) + 5) + '', 10);
    pokemon.velocidad = parseInt(((((2 * pokemon.velocidad + aux) * pokemon.nivel) / 100) + 5) + '', 10);
    if ((Math.floor(Math.random() * (10 - 1 + 1)) + 1) <= 8) { pokemon.genero = 'hembra'; } else { pokemon.genero = 'macho'; }
    return pokemon;
  }

  /**
   * 25 dormido/congelado
   * 12 envenenado/quemado/paralizado
   * 0  el resto
   * this.pokeSalvaje.estado = 'dormidoCongelado'; // dormidoCongelado / paraEnveQuema = envenenado, quemado o paralizado
   * pokeball = 'ultra'; // poke / super / ultra / master
   *
   * @param pokemon f
   * @param pokeball y
   * @return dfg
   */
  captura(pokemon: string, pokeball: string): boolean {
    this.ratioBall = this.ratioCaptura = this.rand = this.bonus = this.a = 0.0;
    this.capturados = false;

    if (this.pokeSalvaje.estado === '') { this.pokeSalvaje.estado = 'nada'; }
    this.ratioCaptura = this.RatioCaptura.getRatioCaptura(pokemon);

    switch (pokeball.toLowerCase().substring(0, 4)) {
      case 'poke':
        this.ratioPoke = 255;
        this.rand = (Math.random() * (0 - this.ratioPoke + 1) + this.ratioPoke);
        this.ratioBall = 1.5;
        this.numEstado = this.getNumEstado(this.pokeSalvaje.estado);
        break;
      case 'supe':
        this.ratioPoke = 200;
        this.rand = (Math.random() * (0 - this.ratioPoke + 1) + this.ratioPoke);
        this.ratioBall = 2.0;
        this.numEstado = this.getNumEstado(this.pokeSalvaje.estado);
        break;
      case 'ultr':
        this.ratioPoke = 150;
        this.rand = (Math.random() * (0 - this.ratioPoke + 1) + this.ratioPoke);
        this.ratioBall = 2.5;
        this.numEstado = this.getNumEstado(this.pokeSalvaje.estado);
        break;
      case 'mast':
        this.ratioPoke = 1;
        this.rand = 0;
        this.ratioBall = 255;
        this.numEstado = this.getNumEstado(this.pokeSalvaje.estado);
        break;
    }

    this.a = (((3 * this.pokeSalvaje.hp_max - 1 * this.pokeSalvaje.hp) * this.ratioCaptura * this.ratioBall) / (1 * this.pokeSalvaje.hp_max))
      + this.numEstado + this.bonus;

    if (this.a < 1) { this.a = 1.0; } else if (this.a > 255) { this.a = 255.0; }

    if (this.rand <= this.a) { this.capturados = true; }
    this.a = parseInt(this.a, 10);

    return this.capturados;
  }

  private getNumEstado(estado: String): number {
    switch (estado) {
      case 'dormidoCongelado':
        this.numEstado = 10.0;
        break;
      case 'paraEnveQuema':
        this.numEstado = 5.0;
        break;
      case 'nada':
        this.numEstado = 0.0;
        break;
    }
    return this.numEstado;
  }

  private anadirPokemon() {
    this.fire.anadirPokemonFB(this.pokeSalvaje.region, this.pokeSalvaje.numero_nacional, this.pokeSalvaje.numero_regional, this.pokeSalvaje.region, this.pokeSalvaje.nombre,
      this.pokeSalvaje.tipoUno, this.pokeSalvaje.tipoDos, this.pokeSalvaje.genero, this.pokeSalvaje.descripcion, this.pokeSalvaje.numeroEvolucion,
      this.pokeSalvaje.nivelEvolucion, this.pokeSalvaje.evoluciona, this.pokeSalvaje.nivel, this.pokeSalvaje.experiencia, this.pokeSalvaje.contadorExp,
      this.pokeSalvaje.ContenedorExp, this.pokeSalvaje.MultiplicadorExp, this.pokeSalvaje.hp, this.pokeSalvaje.hp_max, this.pokeSalvaje.ataque,
      this.pokeSalvaje.defensa, this.pokeSalvaje.ataque_especial, this.pokeSalvaje.defensa_especial, this.pokeSalvaje.velocidad, this.pokeSalvaje.estado,
      this.pokeSalvaje.IV, this.pokeSalvaje.EV, this.pokeSalvaje.capturado, this.pokeSalvaje.favorito, this.pokeSalvaje.ball);
  }

  private obtenerExpEntrenador() {
    this.experienciaGanada = 0;

    if (this.capturados) {

      switch (this.pokeSalvaje.ball) {
        case 'pokeball':
          if (this.pokeSalvaje.nivel > this.entrenador.Nivel) {
            if (this.pokeSalvaje.hp > (this.pokeSalvaje.hp_max / 2)) {
              this.experienciaGanada += (this.entrenador.ContenedorExp / 1.5);
            } else if (this.pokeSalvaje.hp > (this.pokeSalvaje.hp_max / 5)) {
              this.experienciaGanada += (this.entrenador.ContenedorExp / 4);
            } else {
              this.experienciaGanada += (this.entrenador.ContenedorExp / 6);
            }
          } else {
            this.experienciaGanada += 2;
          }
          break;
        case 'superball':
          if (this.pokeSalvaje.nivel > this.entrenador.Nivel) {
            if (this.pokeSalvaje.hp > (this.pokeSalvaje.hp_max / 2)) {
              this.experienciaGanada += (this.entrenador.ContenedorExp / 2);
            } else if (this.pokeSalvaje.hp > (this.pokeSalvaje.hp_max / 5)) {
              this.experienciaGanada += (this.entrenador.ContenedorExp / 5);
            } else {
              this.experienciaGanada += (this.entrenador.ContenedorExp / 7);
            }
          } else {
            this.experienciaGanada += 1;
          }
          break;
        case 'ultraball':
          if (this.pokeSalvaje.nivel > this.entrenador.Nivel) {
            if (this.pokeSalvaje.hp > (this.pokeSalvaje.hp_max / 2)) {
              this.experienciaGanada += (this.entrenador.ContenedorExp / 3);
            } else if (this.pokeSalvaje.hp > (this.pokeSalvaje.hp_max / 5)) {
              this.experienciaGanada += (this.entrenador.ContenedorExp / 6);
            } else {
              this.experienciaGanada += (this.entrenador.ContenedorExp / 8);
            }
          } else {
            this.experienciaGanada += 0;
          }
          break;
        case 'masterball':
          this.experienciaGanada += 0;
          break;
      }

    } else if (this.pokeSalvaje.nivel > this.entrenador.Nivel) {
      if (this.pokeSalvaje.hp > (this.pokeSalvaje.hp_max / 2)) {
        this.experienciaGanada += (this.entrenador.ContenedorExp / 9);
      } else if (this.pokeSalvaje.hp > (this.pokeSalvaje.hp_max / 5)) {
        this.experienciaGanada += (this.entrenador.ContenedorExp / 10);
      } else {
        this.experienciaGanada += (this.entrenador.ContenedorExp / 11);
      }
    } else {
      this.experienciaGanada += 1;
    }

    this.entrenador.Exp = (this.entrenador.Exp + this.experienciaGanada);
    this.experienciaTotal += this.experienciaGanada;

    while (this.entrenador.Exp >= this.entrenador.ContenedorExp) {
      this.entrenador.Nivel =(this.entrenador.Nivel + 1);
      this.entrenador.ATK = (this.entrenador.ATK + 1);
      this.entrenador.Exp = (this.entrenador.Exp - this.entrenador.ContenedorExp);
      this.entrenador.ContenedorExp = (this.entrenador.ContenedorExp +
      this.entrenador.MultiplicadorExp);
      this.entrenador.MultiplicadorExp = (this.entrenador.MultiplicadorExp * 2);
    }
    this.db.setEntrenador(this.entrenador);
  }

  private obtenerExpPokemon(pokeExp: PokemonInterface, pokeRival: PokemonInterface, barraExp?: any): PokemonInterface {
    let base: number = 0; let nivel: number = 0; let genero: string = ''; let exp: number = 0; let contExp: number = 0;
    // pokeExp.experiencia = 200200;
    pokeExp.ContenedorExp = (pokeExp.nivel+1)*(pokeExp.nivel+1)*(pokeExp.nivel+1);

    base = Math.floor(Math.random() * (255 - 20 + 1)) + 20;
    // 1 seria 1.5 si fuera de un entrenador
    pokeExp.experiencia = parseInt((pokeExp.experiencia + (base * pokeRival.nivel * 1)/7) + '', 10);
    if (barraExp != undefined) {
      this.barraExp = { width: ((pokeExp.experiencia * 100) / pokeExp.ContenedorExp) + '%' };
    }
    
    while (pokeExp.experiencia >= pokeExp.ContenedorExp) {
      pokeExp.nivel += 1;
      pokeExp.experiencia -= pokeExp.ContenedorExp;
      if (barraExp != undefined) {
        barraExp = { width: ((pokeExp.experiencia * 100) / pokeExp.ContenedorExp) + '%' };
      }
      if (pokeExp.experiencia < 0) { pokeExp.experiencia = 0}
      if (pokeExp.nivelEvolucion <= pokeExp.nivel) {
        if (pokeExp.nivelEvolucion > 0) {
        nivel = pokeExp.nivel; genero = pokeExp.genero; exp = pokeExp.experiencia; contExp = pokeExp.ContenedorExp;
        // console.log(pokeExp);
        pokeExp = this.evolucionar(pokeExp);
        pokeExp.nivel = nivel; pokeExp.genero = genero; pokeExp.experiencia = exp; pokeExp.ContenedorExp = contExp;
        this.equipoPokemon.map((numero_nacional) =>{
          console.log(numero_nacional)
        });
        // console.log(pokeExp);
        }
      }
    }

    return pokeExp;
  }

  evolucionar(pokeEvo: PokemonInterface) {
    return this.stats.getStatsPokemon(pokeEvo.evoluciona);
  }

  public convertirEntero(numero: any) {
    numero = parseInt(numero + '', 10);
    return numero;
  }

  public mostrarInfoEntrenador() {
    this.infoPokemon = 'none';
    this.infoEntrenador = 'block';
    this.fabVisible = !this.fabVisible;
  }

  public mostrarInfoPokemon() {
    this.infoEntrenador = 'none';
    this.infoPokemon = 'block';
    this.fabVisible = !this.fabVisible;
  }

  /**
   * Presenta un modal en la misma página a fullscreen
   * Contiene Listener onDidDismiss que recarga página
   */
  async presentModal(titulo: string) {
    // Presentar modal
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: { titulo }
    });

    // Recargar al quitar modal
    modal.onDidDismiss().then(any => {
      this.presentLoading('Actualizando');
      location.reload();
    });

    return await modal.present();
  }


  /**
   * sdasdff
   * @param msg mensaje
   */
  async presentLoading(msg) {
    const myloading = await this.loadingController.create({
      message: msg
    });
    return await myloading.present();
  }

  private resetAnimacion(ball: string, botonRojo: string, star1: string, star2: string, star3: string) {
    let poke = document.getElementById(ball);
    poke.style.animation = 'none';
    poke.offsetHeight; /* trigger reflow */
    poke.style.animation = null;

    const luzRoja = document.getElementById(botonRojo);
    luzRoja.style.animation = 'none';
    luzRoja.offsetHeight;
    luzRoja.style.animation = null;

    const estrella1 = document.getElementById(star1);
    estrella1.style.animation = 'none';
    estrella1.offsetHeight;
    estrella1.style.animation = null;

    const estrella2 = document.getElementById(star2);
    estrella2.style.animation = 'none';
    estrella2.offsetHeight;
    estrella2.style.animation = null;

    const estrella3 = document.getElementById(star3);
    estrella3.style.animation = 'none';
    estrella3.offsetHeight;
    estrella3.style.animation = null;
  }

  private cargarAudios() {
    this.audio.preload('audioCogerPokeball', '../../../assets/audio/creciendo.mp3');
    this.audio.preload('audioCrecePokeball', '../../../assets/audio/creciendo.mp3');
    this.audio.preload('audioAtrapando', '../../../assets/audio/capturando.mp3');
    this.audio.preload('audioSacudidaPokeball', '../../../assets/audio/sacudida.mp3');
    this.audio.preload('audioCapturado', '../../../assets/audio/capturado.mp3');
    this.audio.preload('audioEscapado', '../../../assets/audio/escapandose.mp3');
    this.audio.preload('audioEncogePokeball', '../../../assets/audio/regresa.mp3');
    this.audio.preload('audioRegresa', '../../../assets/audio/regresa.mp3');
  }

  private apareceSalvaje() {
    this.pokeSalvaje = this.stats.getStatsPokemon(this.numNacional);
    this.pokeSalvaje = this.setCaracteristicas(this.pokeSalvaje);
  }

  ngOnInit() {
  }

  voltear() {
    if (this.flip === 'is-flipped'){
      this.flip = '';
    } else this.flip = 'is-flipped';
  }

  calcular_variables(pokeAtaca: PokemonInterface, pokeDefensa: PokemonInterface) {
    pokeAtaca.ContenedorExp = (pokeAtaca.nivel+1)*(pokeAtaca.nivel+1)*(pokeAtaca.nivel+1);
    pokeDefensa.ContenedorExp = (pokeDefensa.nivel+1)*(pokeDefensa.nivel+1)*(pokeDefensa.nivel+1);
    this.variacion = Math.floor(Math.random() * (100 - 85 + 1)) + 85;
    // Calculo de efectividad
    let notRandomNumbers = [
      0, 0,
      0.25, 0.25, 0.25, 0.25, 0.25,
      0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      2, 2, 2, 2, 2,
      4];
    let idx = Math.floor(Math.random() * notRandomNumbers.length);
    this.efectividad = notRandomNumbers[idx];
    // Calculo de potencia
    this.potencia = 50;
    // Calculo de daño
    this.aux = ((0.2*pokeAtaca.nivel+1)*pokeAtaca.ataque*this.potencia)/(25*pokeDefensa.defensa)+2;
    this.daño = parseInt(0.01*this.bonustipo*this.efectividad*this.variacion*this.aux + '', 10);
    this.barraHP2 = { width: ((pokeAtaca.hp * 100) / pokeAtaca.hp_max) + '%', };
    this.barraExp = { width: ((pokeAtaca.experiencia * 100) / pokeAtaca.ContenedorExp) + '%', };
  }

  huir() {
    this.route.navigateByUrl('/tabs/tab2');
  }

  mostrarPokeballs() {

  }

}
