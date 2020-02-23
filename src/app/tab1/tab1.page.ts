import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PokemonInterface } from '../modelo/Pokemons';
import { StatsService } from '../servicios/estadisticas.service';
import { FirebaseService } from '../servicios/firebase.service';
import { AudioService } from '../servicios/audio.service';
import { LvupService } from '../servicios/lvup.service';
import { LoadingService } from '../servicios/loading.service';
import { RepositorioService } from '../servicios/repositorio.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss', '../paginas/captura/captura.page.scss']
})

export class Tab1Page {
  // Pokemon a capturar
  numNacional: string;
  pokeSalvaje: PokemonInterface; pokemonBatalla: PokemonInterface;
  // Variables de Ocultar y mostrar
  pokeOculto: String; ocultar1: String; ocultar2: String; ocultar3: String; ocultar4: String; ocultarEquipo: any; ocultarBalls: any; display: any;
  // Variables de Configuracion
  barraHP: any; barraHP2: any; barraExp: any;
  // Variables de batalla
  modal: Boolean; flip: string; daño: any;
  bonustipo: number; efectividad: number; variacion: number; potencia: number;

  constructor(
    private stats: StatsService,
    private route: Router,
    private router: ActivatedRoute,
    private fire: FirebaseService,
    private audio: AudioService,
    public repo: RepositorioService,
    private lvup: LvupService,
    private loading: LoadingService
  ) {
    this.numNacional = '';
    this.pokeSalvaje = { numero_nacional: '', numero_regional: '', region: '', nombre: '', tipo_uno: '', tipo_dos: '', genero: '', descripcion: '', numero_evolucion: 0, nivel_evolucion: 0, evolucion: '' };
    this.numNacional = this.router.snapshot.paramMap.get('id');
    this.apareceSalvaje();

    this.audio.cargarAudios();

    this.pokemonBatalla = { numero_nacional: '', numero_regional: '', region: '', nombre: '', tipo_uno: '', tipo_dos: '', genero: '', descripcion: '', numero_evolucion: 0, nivel_evolucion: 0, evolucion: '' };
    this.pokemonBatalla = this.repo.getEquipoPokemon()[0];
    this.barraHP = { width: '100%' }; this.barraHP2 = { width: '100%' }; this.barraExp = { width: '0%' };
    this.pokeOculto = 'show'; this.ocultar1 = 'hide'; this.ocultar2 = 'hide'; this.ocultar3 = 'hide'; this.ocultar4 = 'hide';
    this.modal = true; this.flip = ''; this.daño = 0;
    this.ocultarEquipo = { display: 'flex' }; this.ocultarBalls = { display: 'none' }; this.display = false;
    this.bonustipo = 1; this.efectividad = 1; this.variacion = 1; this.potencia = 100;
  }

  public atacar() {
    if (this.pokemonBatalla.velocidad >= this.pokeSalvaje.velocidad) {
      this.atacarSalvaje();
      this.ser_atacado();
    } else {
      this.ser_atacado();
      this.atacarSalvaje();
    }
  }

  private atacarSalvaje() {
    this.calcular_variables(this.pokemonBatalla, this.pokeSalvaje);
    this.pokeSalvaje.hp = this.convertirEntero(this.pokeSalvaje.hp);
    this.pokeSalvaje.hp_max = this.convertirEntero(this.pokeSalvaje.hp_max);

    if (this.pokemonBatalla.hp > 0) {
      if (this.pokeSalvaje.hp > 0) {
        if (this.pokeSalvaje.hp >= this.daño) {
          this.pokeSalvaje.hp -= this.convertirEntero(this.daño);
        } else {
          this.pokeSalvaje.hp = 0;
          let pokevo = this.pokemonBatalla;
          this.pokemonBatalla = this.lvup.obtenerExpPokemon(this.pokemonBatalla, this.pokeSalvaje);
          this.repo.setMaster(this.lvup.obtenerExpEntrenador(this.repo.getMaster(), this.pokeSalvaje));
          this.fire.addMaster(this.repo.getMaster());
          // Actualizar el pokemon evolucionado al array del repositorio.
          if (pokevo.evolucion === this.pokemonBatalla.numero_nacional) {
            this.repo.evoEquipo(pokevo, this.pokemonBatalla);
          }
          this.barraExp = this.lvup.calcularBarraExp(this.barraExp, this.pokemonBatalla);
          this.loading.presentLoading('Buscando otro pokemon', 4000);
          setTimeout(() => {
            this.apareceSalvaje();
            this.loading.dismissLoading()
          }, 3000);
        }
        this.barraHP = this.lvup.calcularBarraHpPokemon(this.barraHP, this.pokeSalvaje.hp, this.pokeSalvaje.hp_max);
      }
    }
  }

  private ser_atacado() {
    this.calcular_variables(this.pokeSalvaje, this.pokemonBatalla);
    this.pokemonBatalla.hp = this.convertirEntero(this.pokemonBatalla.hp);
    this.pokemonBatalla.hp_max = this.convertirEntero(this.pokemonBatalla.hp_max);

    if (this.pokemonBatalla.hp >= this.daño && this.pokemonBatalla.hp != 0) {
      this.pokemonBatalla.hp -= this.convertirEntero(this.daño);
    } else if (this.pokemonBatalla.hp <= this.daño) {
      this.pokemonBatalla.hp = 0;
    }

    if (this.pokeSalvaje.hp <= 0) {
      this.loading.presentLoading('Buscando otro pokemon', 10000);
      setTimeout(() => {
        this.apareceSalvaje();
        this.loading.dismissLoading()
      }, 3000);
    }

    this.barraHP2 = this.lvup.calcularBarraHpPokemon(this.barraHP2, this.pokemonBatalla.hp, this.pokemonBatalla.hp_max);
  }

  public cambiar_pokemon(poke_cambio: PokemonInterface) {
    this.pokemonBatalla = poke_cambio;
    this.calcular_variables(this.pokemonBatalla, this.pokeSalvaje);
  }

  public convertirEntero(numero: any) { numero = parseInt(numero + '', 10); return numero; }

  private apareceSalvaje() {
    this.curar();
    let nacional: string = ''; let nivel = this.repo.getMaster().nivel;

    if (nivel >= 30) {
      nacional = this.legendario();
    } else if (nivel >= 20) {
      nacional = this.dificil();
    } else if (nivel >= 15) {
      nacional = this.normal();
    } else if (nivel < 15) {
      nacional = this.facil();
    }

    this.pokeSalvaje = this.stats.getStatsPokemon(nacional);
    this.pokeSalvaje = this.lvup.setCaracteristicas(this.repo.getMaster(), this.pokeSalvaje);
    this.barraHP = { width: '100%' };
  }

  public voltear() {
    if (this.flip === 'is-flipped') {
      this.flip = '';
    } else { this.flip = 'is-flipped' };
  }

  private calcular_variables(pokeAtaca: PokemonInterface, pokeDefensa: PokemonInterface) {
    this.variacion = Math.floor(Math.random() * (100 - 85 + 1)) + 85;
    let aux = 0;
    // Calculo de efectividad
    let rangoCritico = [
      0, 0,
      0.25, 0.25, 0.25, 0.25, 0.25,
      0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      2, 2, 2, 2, 2,
      4];
    this.efectividad = rangoCritico[Math.floor(Math.random() * rangoCritico.length)];
    // Calculo de potencia
    this.potencia = 50;
    // Calculo de daño
    aux = ((0.2 * pokeAtaca.nivel + 1) * pokeAtaca.ataque * this.potencia) / (25 * pokeDefensa.defensa) + 2;
    this.daño = this.convertirEntero(0.01 * this.bonustipo * this.efectividad * this.variacion * aux);
    this.barraHP2 = this.lvup.calcularBarraHpPokemon(this.barraHP2, pokeAtaca.hp, pokeAtaca.hp_max);
    this.barraExp = this.lvup.calcularBarraExp(this.barraExp, pokeAtaca);
  }

  public huir() { this.route.navigateByUrl('/tabs/tab2'); }

  private curar() {
    this.repo.getEquipoPokemon().forEach((elemento) => {
      elemento.hp = elemento.hp_max;
    });
    this.barraHP = { width: '100%' };
  }

  private facil() {
    let numero: number = 0; let poke: PokemonInterface; 
    let nacional: string = '';
    do {
      nacional = ''; numero = 0;
      numero = Math.floor(Math.random() * (1 - 150 + 1)) + 150;
      if (numero < 10) {
        nacional = '00' + numero;
      } else if (numero >= 10 && numero < 100) {
        nacional = '0' + numero;
      } else if (numero >= 100) {
        nacional = '' + numero;
      }
      numero = this.stats.getStatsPokemon(nacional).numero_evolucion;
    } while (numero != 1);
    return nacional;
  }

  private normal() {
    let numero: number = 0; let poke: PokemonInterface; 
    let nacional: string = '';
    do {
      nacional = ''; numero = 0;
      numero = Math.floor(Math.random() * (1 - 150 + 1)) + 150;
      if (numero < 10) {
        nacional = '00' + numero;
      } else if (numero >= 10 && numero < 100) {
        nacional = '0' + numero;
      } else if (numero >= 100) {
        nacional = '' + numero;
      }
      numero = this.stats.getStatsPokemon(nacional).numero_evolucion;
    } while (numero < 1 || numero > 2);
    return nacional;
  }

  private dificil() {
    let numero: number = 0; let poke: PokemonInterface; 
    let nacional: string = '';
    do {
      nacional = ''; numero = 0;
      numero = Math.floor(Math.random() * (1 - 150 + 1)) + 150;
      if (numero < 10) {
        nacional = '00' + numero;
      } else if (numero >= 10 && numero < 100) {
        nacional = '0' + numero;
      } else if (numero >= 100) {
        nacional = '' + numero;
      }
      numero = this.stats.getStatsPokemon(nacional).numero_evolucion;
    } while (numero < 1 || numero > 3);
    return nacional;
  }

  private legendario() {
    let numero: number = 0; let poke: PokemonInterface; 
    let nacional: string = '';
    do {
      nacional = ''; numero = 0;
      numero = Math.floor(Math.random() * (1 - 150 + 1)) + 150;
      if (numero < 10) {
        nacional = '00' + numero;
      } else if (numero >= 10 && numero < 100) {
        nacional = '0' + numero;
      } else if (numero >= 100) {
        nacional = '' + numero;
      }
      numero = this.stats.getStatsPokemon(nacional).numero_evolucion;
    } while (numero < 0 || numero > 3);
    return nacional;
  }

}
