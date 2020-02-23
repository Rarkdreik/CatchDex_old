import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PokemonInterface } from '../modelo/Pokemons';
import { RepositorioService } from '../servicios/repositorio.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})

export class Tab3Page {
  pokemonsAtrapado: PokemonInterface[] = [];
  pokemonsEquipo: PokemonInterface[] = [];

  constructor(public route: Router, private repo: RepositorioService) {
    // this.pokemons.push(this.pokemon);
   }
  
  ngOnInit() {
    // this.db.getDatabaseState().subscribe(rdy => {
    //   if (rdy) {
    //     this.db.getPokemonsEquipo().subscribe(pokemons => {
    //       this.pokemonsEquipo = pokemons;
    //     });
    //   }
    // });
    // this.db.getDatabaseState().subscribe(rdy => {
    //   if (rdy) {
    //     this.db.getPokemonsAtrapados().subscribe(pokemons => {
    //       this.pokemonsAtrapado = pokemons;
    //     });
    //   }
    // });

    // let regionn: string = '';
    // this.nativeStorage.getItem('datos').then(data =>{
    //   regionn = data.region;
      
    // });
  }

  /**
   * ir a la pagina de captura con el pokemon seleccionado
   * o solo mostrar la Ball detrás. Si se mantiene, lo liberas
   * al capturarlo se añade con todas sus características a la base de datos
   */
  capturar(numPoke: any, pokemox: number) {
    // this.db.setnumero_nacional(numPoke);
    // if (pokemox === 0) {
    //   if (this.db.getEntrenador().nivel >= 20) {
    //     this.db.setnumero_nacional(numPoke);
    //     this.route.navigateByUrl('captura-prueba');
    //   } else {
    //     alert('Necesitas llegar al nivel 20 para capturar a este pokemon');
    //   }
    // } else if (pokemox === 1) {
    //   this.db.setnumero_nacional(numPoke);
    //   this.route.navigateByUrl('captura-prueba');
    // } else if (pokemox === 2) {
    //   if (this.db.getEntrenador().nivel >= 10) {
    //     this.db.setnumero_nacional(numPoke);
    //     this.route.navigateByUrl('captura-prueba');
    //   } else {
    //     alert('Necesitas llegar al nivel 10 para capturar a este pokemon');
    //   }
    // } else if (pokemox === 3) {
    //   if (this.db.getEntrenador().nivel >= 15) {
    //     this.db.setnumero_nacional(numPoke);
    //     this.route.navigateByUrl('captura-prueba');
    //   } else {
    //     alert('Necesitas llegar al nivel 15 para capturar a este pokemon');
    //   }
    // }
  }

  setFavorito(pokemon: PokemonInterface) {
    // pokemon.favorito = !pokemon.favorito;
  }

  irDescripcion(numero_nacional: string) {
    // this.route.navigateByUrl(`modal2/${numero_nacional}`);
  }


  // async presentModal(titulo: string) {
  //   const modal = await this.modalController.create({
  //     component: ModalPage,
  //     componentProps: { titulo }
  //   });

  //   modal.onDidDismiss().then(any => {
  //     this.presentLoading('Actualizando');
  //     location.reload();
  //   });

  //   return await modal.present();
  // }

  // async presentLoading(msg) {
  //   const myloading = await this.loadingController.create({
  //     message: msg
  //   });
  //   return await myloading.present();
  // }

  public obtenerNombre() {
    return this.repo.getNickCorto();
  }
}
