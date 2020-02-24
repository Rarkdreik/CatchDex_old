import { Component, OnInit } from '@angular/core';
import { RepositorioService } from '../../servicios/repositorio.service';
import { FirebaseService } from '../../servicios/firebase.service';

@Component({
  selector: 'app-centropokemon',
  templateUrl: './centropokemon.page.html',
  styleUrls: ['./centropokemon.page.scss'],
})
export class CentropokemonPage implements OnInit {

  constructor(private repo: RepositorioService, private fire: FirebaseService) { }

  ngOnInit() {}

  public curar() {
    this.repo.getEquipoPokemon().forEach((elemento) => {
      elemento.hp = elemento.hp_max;
    });
  }

}
