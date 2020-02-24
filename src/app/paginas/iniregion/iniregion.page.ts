import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertsService } from '../../servicios/alerts.service';
import { FirebaseService } from '../../servicios/firebase.service';
import { RepositorioService } from '../../servicios/repositorio.service';
import { Entrenador } from '../../modelo/entrenador';
import { PokemonInterface } from '../../modelo/Pokemons';
import { StatsService } from '../../servicios/estadisticas.service';
import { LvupService } from '../../servicios/lvup.service';
import { LoadingService } from '../../servicios/loading.service';

export interface MasterData {
  nick: string,
  region: string,
  pokemon: string,
}

@Component({
  selector: 'app-iniregion',
  templateUrl: './iniregion.page.html',
  styleUrls: ['./iniregion.page.scss'],
})
export class IniregionPage implements OnInit {
  public loginForm: FormGroup;
  private master: Entrenador;
  private masterData: MasterData = { nick: '', region: '', pokemon: '' }

  constructor(private router: Router, private formBuilder: FormBuilder, private alertaServicio: AlertsService,
    private firebase: FirebaseService, private repo: RepositorioService, private stats: StatsService,
    private lvup: LvupService, private loading: LoadingService ) { }

  /**
   * Comprueba e inicializa todos los datos necesarios
   * Si el usuario es nuevo, le pedimos que se vuelva a registrar como entrenador.
   */
  public async ngOnInit() {
    let pokes: PokemonInterface[] = [];
    this.loginForm = this.formBuilder.group({
      nick: ["", Validators.required],
      region: ["", Validators.required],
      pokemon: ["", Validators.required]
    });

    try {
      await this.loading.presentInfiniteLoading('Cargando información de la cuenta, por favor espere...');
      // Obtiene el correo de haber iniciado sesion
      let correo = this.repo.getCorreo();
      // Inicializamos nuestro firebase con el correo
      this.firebase.inicializar(correo);
      // Obtenemos el entrenador pokemon
      this.master = (await this.firebase.getEntrenador());
      // Si no está vacio procedemos a cargar todos los datos del entrenador
      if (this.master.nick != null && this.master.nick != '') {
        // Su nombre
        this.firebase.setDisplayName(this.master.nick);
        // Inicializamos todas las variables necesarias del repositorio
        this.inicializarRepositorio(this.master);
        // Cargamos los pokemon atrapados / capturados
        // Y si de la lista de pokemon con region inicial hay alguno atrapado
        // Lo indicamos añadiendole el tipo de ball con el que fue capturado
        this.firebase.getPokemonAtrapado().then((resultado) => {
          pokes = resultado as PokemonInterface[];
          this.repo.getPokemonsRegionActual().forEach(element => {
            pokes.forEach(pok => {
              if (element.numero_nacional === pok.numero_nacional) { element.ball = pok.ball; }
            });
          });
          // una vez que todo está listo, cerramos el loading y vamos a la pagina principal
          this.loading.dismissLoading();
          this.router.navigateByUrl('main/avatar');
        }).catch(() => {
          this.loading.dismissLoading();
          return null;
        }).finally(() => { this.loading.dismissLoading(); });
      } else {
        this.loading.dismissLoading();
        this.alertaServicio.alertaSimple('No hay datos', 'Porfavor registrese o contacte con el soporte tecnico', 'warning');
      }
    } catch (erroneo) {
      this.loading.dismissLoading();
      this.alertaServicio.alertaSimple('No hay datos', 'No disponemos de la información del entrenador, registrate como entrenador', 'warning');
    }
  }

  /** Guarda y deveulve la información del formulario */
  public saveMaster() {
    let dataMaster = {
      nick: this.loginForm.get('nick').value,
      region: this.loginForm.get('region').value,
      pokemon: this.loginForm.get('pokemon').value,
    };
    return dataMaster;
  }

  /**
   * En el caso de iniciar sesión normal, cargaremos todos los datos necesarios y nos dirigeremos a la pagina principal
   */
  public onSubmit() {
    let master: Entrenador = { nick: 'Ash', nivel: 1, exp: 0, pokeBalls: 10, superBalls: 0, ultraBalls: 0, masterBalls: 0 };
    this.masterData = this.saveMaster();
    let correo = this.repo.getCorreo();
    this.firebase.inicializar(correo);
    master = this.inicializarMaestroPokemon(master);
    this.inicializarRepositorio(master);
    this.addToFirebase(master);
    this.repo.setAvatar('../../../assets/images/avatar/avatar.png');
    this.router.navigateByUrl('/main/avatar');
  }

  /**
   * Inicializa el entrenador con los datos Entrenador pokemon obtenidos.
   * @param master Objeto Entrenador para completar los datos restantes.
   */
  private inicializarMaestroPokemon(master: Entrenador) {
    master.nick = this.masterData.nick;
    master.region_ini = this.masterData.region;
    master.poke_ini = this.establecerPokeInicial();
    master.capturados = [];
    master.favoritos = [];
    master.capturados.push(master.poke_ini);
    master.favoritos.push(master.poke_ini.numero_nacional);
    return master;
  }

  /**
   * Establece, carga y calcula las estadisticas del pokemon inicial.
   */
  private establecerPokeInicial(): PokemonInterface {
    let pokemon: PokemonInterface = this.stats.getStatsPokemon(this.masterData.pokemon);
    pokemon.nivel = 5; pokemon.ball = 'pokeball'; pokemon.estado = 'nada';
    return pokemon = this.lvup.calcularStats(pokemon);
  }

  /**
   * Añade todos los datos nuevos a la base de datos Firebase
   * @param master Objeto Entrenador para completar los datos restantes.
   */
  private addToFirebase(master: Entrenador) {
    this.firebase.addPokemon(master.poke_ini);
    this.firebase.addPokemonAtrapado(master.poke_ini);
    this.firebase.addPokemonFavorito(master.poke_ini);
    this.firebase.addMaster(master);
  }

  /**
   * Inicializa el repositorio con las variables necesarias y las completa con el Objeto Entrenador pasado por parametro.
   * @param master Objeto Entrenador para completar los datos restantes.
   */
  private inicializarRepositorio(master: Entrenador) {
    master.capturados = []
    this.repo.setRegion(master.region_ini);
    this.repo.modificarEquipoPokemon(master.poke_ini, 0);
    this.repo.getListaPokemonRegion(master.region_ini);
    this.repo.setNick(master.nick);
    this.repo.setMaster(master);
  }

}
