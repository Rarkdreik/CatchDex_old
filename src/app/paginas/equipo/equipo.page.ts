import { Component, OnInit } from '@angular/core';
import { PokemonInterface } from 'src/app/modelo/Pokemons';
import { RepositorioService } from '../../servicios/repositorio.service';

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.page.html',
  styleUrls: ['./equipo.page.scss'],
})
export class EquipoPage implements OnInit {
  private pokemonsAtrapado: PokemonInterface[] = [];
  private pokemonsEquipo: PokemonInterface[] = [];

  constructor(public repo: RepositorioService) {
    this.pokemonsAtrapado = [];
    this.pokemonsEquipo = [];
    // for (let i = 1; i < 806; i++) {
    //   let pokemon: PokemonInterface;
    //   let num: string;
    //   if (i < 10) {
    //     num = '00' + i;
    //     pokemon = this.poke.getStatsPokemon(num);
    //     this.pokemonsAtrapado.push(pokemon);
    //     if(i > 3) {
    //       this.pokemonsEquipo.push(pokemon);
    //     }
    //   } else if (i >= 10 && i < 100) {
    //     num = '0' + i;
    //     pokemon = this.poke.getStatsPokemon(num);
    //     this.pokemonsAtrapado.push(pokemon);
    //   } else if (i >= 100) {
    //     num = '' + i;
    //     pokemon = this.poke.getStatsPokemon(num);
    //     this.pokemonsAtrapado.push(pokemon);
    //   }
    // }
  }

  ngOnInit() {
    // this.db.getDatabaseState().subscribe(rdy => {
    //   if (rdy) {
    //     this.db.getPokemonsEquipo().subscribe(pokemons => {
    //       this.pokemonsEquipo = pokemons;
    //     })
    //   }
    // });
    // this.db.getDatabaseState().subscribe(rdy => {
    //   if (rdy) {
    //     this.db.getPokemonsAtrapados().subscribe(pokemons => {
    //       this.pokemonsAtrapado = pokemons;
    //     })
    //   }
    // });
  }

}
