import { Component, OnInit } from '@angular/core';

import { Entrenador } from '../../modelo/entrenador';
import { Router } from '@angular/router';
import { FirebaseService } from '../../servicios/firebase.service';
import { PokemonInterface } from '../../modelo/Pokemons';
import { AuthService } from '../../servicios/auth.service';
import { PokemonService } from '../../servicios/pokemon.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
// import { DatabaseService } from '../servicios/database.service';

@Component({
  selector: 'app-home',
  templateUrl: 'avatar.page.html',
  styleUrls: ['avatar.page.scss'],
})

export class AvatarPage implements OnInit {
  private datos: string[] = [];
  nombre: string = '';
  private correo: string = '';
  region: string = '';
  pokeini: string = '';
  pokemon: PokemonInterface;
  pokemons: PokemonInterface[] = [];
  entrenador: Entrenador = { Nick: 'RarkdreikHome', Nombre: 'Rik', Exp: 0, Nivel: 1, ContenedorExp: 50, PokeBalls: 20, SuperBalls: 10, UltraBalls: 5, MasterBalls: 1};
  equipoPokemon: PokemonInterface[] = [];

  constructor(
    private route: Router, 
    public authService: AuthService, 
    private nativeStorage: NativeStorage,
    private poke: PokemonService
    ) { }
  
  ngOnInit() {
    this.nativeStorage.getItem('datos').then(data =>{
      console.log(data.pokeini)
      this.nombre = data.usuario;
      this.correo = data.email;
      this.region = data.region;
      this.pokeini = data.pokeini;
      this.entrenador.Nombre = data.usuario;
    });
    
    let pokemon: PokemonInterface;
    
    pokemon = this.poke.getStatsPokemon('255');
    this.equipoPokemon.push(pokemon);
    
    pokemon = this.poke.getStatsPokemon('258');
    this.equipoPokemon.push(pokemon);
    
    pokemon = this.poke.getStatsPokemon('341');
    this.equipoPokemon.push(pokemon);
    
    pokemon = this.poke.getStatsPokemon('360');
    this.equipoPokemon.push(pokemon);
    
    pokemon = this.poke.getStatsPokemon('361');
    this.equipoPokemon.push(pokemon);
  }

  iraregion() {
    this.route.navigateByUrl('tabs/tab2');
  }

}


// pokemon: PokemonInterface = {
//   numero_nacional: '001', numero_regional: '001', region: 'kanto', nombre: 'Balbasaur', tipoUno: 'planta', tipoDos: 'veneno', genero: 'hembra',
//   descripcion: '', numeroEvolucion: 3, nivelEvolucion: 16, evoluciona: '002', nivel: 0, experiencia: 0, contadorExp: 2, ContenedorExp: 10,
//   MultiplicadorExp: 2, hp: 500, hp_max: 500, ataque: 10, defensa: 10, ataque_especial: 15, defensa_especial: 15, velocidad: 10, estado: 'nada', IV: 31,
//   EV: 253,  capturado: 0, favorito: false, ball: 'superBall'
// };
