import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PokemonInterface } from '../modelo/Pokemons';
import { DatabaseService } from '../servicios/database.service';
import { RepositorioService } from '../servicios/repositorio.service';
import { LoadingService } from '../servicios/loading.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page {
  pokemons: PokemonInterface[];
  region: string;

  constructor(
    private db: DatabaseService,
    private route: Router,
    public repo: RepositorioService,
    private loadService: LoadingService,
  ) {
    this.pokemons = [];
    this.region = '';
  }

  ngOnInit() {
    this.loadService.presentLoading('Actualizando Pokedex');
    this.pokemons = this.repo.getPokemonsRegionActual();
    this.loadService.dismissLoading();
  }

  doRefresh(event) {
    let pokes = this.repo.getPokemonsRegionActual();
    this.repo.setPokemonsRegionActual([]);
    this.pokemons = this.repo.getPokemonsRegionActual();
    setTimeout(() => {
      this.repo.setPokemonsRegionActual(pokes);
      this.pokemons = this.repo.getPokemonsRegionActual();
      event.target.complete();
    }, 3000);
  }

  /**
   * ir a la pagina de captura con el pokemon seleccionado
   * o solo mostrar la Ball detrás. Si se mantiene, lo liberas
   * al capturarlo se añade con todas sus características a la base de datos
   */
  capturar(numPoke: any, pokemox: number) {
    this.db.setnumero_nacional(numPoke);
    console.log(`\n\n\n
    no se que era ${pokemox}
    \n\n\n`);
    if (pokemox === 0) {
      if (this.db.getEntrenador().nivel >= 20) {
        this.db.setnumero_nacional(numPoke);
        this.route.navigateByUrl('captura-prueba');
      } else {
        alert('Necesitas llegar al nivel 20 para capturar a este pokemon');
      }
    } else if (pokemox === 1) {
      this.db.setnumero_nacional(numPoke);
      this.route.navigateByUrl('captura-prueba');
    } else if (pokemox === 2) {
      if (this.db.getEntrenador().nivel >= 10) {
        this.db.setnumero_nacional(numPoke);
        this.route.navigateByUrl('captura-prueba');
      } else {
        alert('Necesitas llegar al nivel 10 para capturar a este pokemon');
      }
    } else if (pokemox === 3) {
      if (this.db.getEntrenador().nivel >= 15) {
        this.db.setnumero_nacional(numPoke);
        this.route.navigateByUrl('captura-prueba');
      } else {
        alert('Necesitas llegar al nivel 15 para capturar a este pokemon');
      }
    }
  }

  irDescripcion(numero_nacional: string) {
    this.route.navigateByUrl(`modal2/${numero_nacional}`);
  }
}
