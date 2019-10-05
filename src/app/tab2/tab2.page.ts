import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, LoadingController } from '@ionic/angular';
import { ModalPage } from '../paginas/DescripModal/modal.page';

import { PokemonInterface } from '../modelo/Pokemons';
import { DatabaseService } from '../servicios/database.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page {
  pokemons: PokemonInterface[] = [];

  constructor(
    private db: DatabaseService,
    private nativeStorage: NativeStorage,
    public route: Router,
    public modalController: ModalController,
    public loadingController: LoadingController,
  ) { }
  
  ngOnInit() {
    let region: string = '';
    this.nativeStorage.getItem('datos').then(data =>{
      region = data.region;
    });
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getPokemons(region).subscribe(pokemons => {
          this.pokemons = pokemons;
        })
      }
    });
  }

  /**
   * ir a la pagina de captura con el pokemon seleccionado
   * o solo mostrar la Ball detrás. Si se mantiene, lo liberas
   * al capturarlo se añade con todas sus características a la base de datos
   */
  capturar(numPoke: any, pokemox: number) {
    this.db.setnumero_nacional(numPoke);
    if (pokemox === 0) {
      if (this.db.getEntrenador().Nivel >= 20) {
        this.db.setnumero_nacional(numPoke);
        this.route.navigateByUrl('captura-prueba');
      } else {
        alert('Necesitas llegar al nivel 20 para capturar a este pokemon');
      }
    } else if (pokemox === 1) {
      this.db.setnumero_nacional(numPoke);
      this.route.navigateByUrl('captura-prueba');
    } else if (pokemox === 2) {
      if (this.db.getEntrenador().Nivel >= 10) {
        this.db.setnumero_nacional(numPoke);
        this.route.navigateByUrl('captura-prueba');
      } else {
        alert('Necesitas llegar al nivel 10 para capturar a este pokemon');
      }
    } else if (pokemox === 3) {
      if (this.db.getEntrenador().Nivel >= 15) {
        this.db.setnumero_nacional(numPoke);
        this.route.navigateByUrl('captura-prueba');
      } else {
        alert('Necesitas llegar al nivel 15 para capturar a este pokemon');
      }
    }
  }

  setFavorito(pokemon: PokemonInterface) {
    pokemon.favorito = !pokemon.favorito;
  }

  irDescripcion(numero_nacional: string) {
    this.route.navigateByUrl(`modal2/${numero_nacional}`);
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
}
