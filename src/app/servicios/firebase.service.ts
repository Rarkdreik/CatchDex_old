import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import {  } from '../modelo/pokemon';
import { Entrenador } from 'src/app/modelo/entrenador';
import { PokemonInterface } from '../modelo/Pokemons';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {
  pokeCollection: AngularFirestoreCollection<PokemonInterface>;
  pokeCollectionNacional: AngularFirestoreCollection<PokemonInterface>;
  pokeCollectionKanto: AngularFirestoreCollection<PokemonInterface>;
  pokeCollectionJohto: AngularFirestoreCollection<PokemonInterface>;
  pokeCollectionHoenn: AngularFirestoreCollection<PokemonInterface>;
  pokeCollectionEntrenador: AngularFirestoreCollection<Entrenador>;
  pokeObserverEntrenador: Observable<any[]>;
  pokeObserverNacional: Observable<PokemonInterface[]>;
  pokeObserverKanto: Observable<PokemonInterface[]>;
  pokeDoc: AngularFirestoreDocument<PokemonInterface>;
  pokemon: PokemonInterface;

  constructor(public db: AngularFirestore) {
    this.pokeCollectionEntrenador = this.db.collection('Rarkdreik').doc('000000001').collection<Entrenador>('entrenador');
    this.pokeCollection = this.db.collection('Rarkdreik');
    this.pokeCollectionNacional = this.db.collection('Rarkdreik').doc('nacional').collection<PokemonInterface>('pokemon');
    this.pokeCollectionKanto = this.db.collection('Rarkdreik').doc('kanto').collection<PokemonInterface>('pokemon');
    this.pokeCollectionJohto = this.db.collection('Rarkdreik').doc('johto').collection<PokemonInterface>('pokemon');
    this.pokeCollectionHoenn = this.db.collection('Rarkdreik').doc('hoenn').collection<PokemonInterface>('pokemon');
    this.pokeObserverEntrenador = this.pokeCollectionEntrenador.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const Nick = a.payload.doc.id;
        return { Nick, ...data };
      }))
    );
  }

  anadirPokemonFB(
    docRegion: string, numNacional: any, numRegional: any, rregion: any, nnombre: any, ttipoUno: any, ttipoDos?: any,
    genero?: any, desc?: any, numEvo?: any, nvEvo?: any, evol?: any, nv?: any, exp?: any, contadorExp?: any,
    ContenedorExp?: any, MultiplicadorExp?: any, hhp?: any, hpMAX?: any, atk?: any, dfn?: any, atkESP?: any,
    dfnESP?: any, vel?: any, esstado?: any, iv?: any, ev?: any, cap?: any, fav?: any, bola?: any) {

    this.pokeCollection.doc(docRegion).collection<PokemonInterface>('pokemon').doc(numRegional).set({
      numero_nacional: numNacional, numero_regional: numRegional, region: rregion, nombre: nnombre, tipoUno: ttipoUno,
      tipoDos: (ttipoDos !== undefined ? ttipoDos : ''), genero: (genero !== undefined ? genero : ''),
      descripcion: (desc !== undefined ? desc : ''), numeroEvolucion: (numEvo !== undefined ? numEvo : ''),
      nivelEvolucion: (nvEvo !== undefined ? nvEvo : ''), evoluciona: (evol !== undefined ? evol : ''),
      nivel: (nv !== undefined ? nv : ''), experiencia: (exp !== undefined ? exp : ''),
      contadorExp: (contadorExp !== undefined ? contadorExp : ''),
      ContenedorExp: (ContenedorExp !== undefined ? ContenedorExp : ''),
      MultiplicadorExp: (MultiplicadorExp !== undefined ? MultiplicadorExp : ''),
      hp: (hhp !== undefined ? hhp : ''), hp_max: (hpMAX !== undefined ? hpMAX : ''),
      ataque: (atk !== undefined ? atk : ''), defensa: (dfn !== undefined ? dfn : ''),
      ataque_especial: (atkESP !== undefined ? atkESP : ''), defensa_especial: (dfnESP !== undefined ? dfnESP : ''),
      velocidad: (vel !== undefined ? vel : ''), estado: (esstado !== undefined ? esstado : ''),
      IV: (iv !== undefined ? iv : ''), EV: (ev !== undefined ? ev : ''),
      capturado: (cap !== undefined ? cap : ''), favorito: (fav !== undefined ? fav : ''),
      ball: (bola !== undefined ? bola : '')
    });
  }

  getsNacionalFB() {
    return this.pokeObserverNacional;
  }

  getsKantoFB() {
    return this.pokeObserverKanto;
  }

  getEntrenadorFB(): Observable<any> {
    return this.pokeObserverEntrenador;
  }

  setEntrenadorFB(nick: string, nombre: string, genero: string, exp: number, nivel: number, contenedorExp: number,
    multiplicadorExp: number, aTK: number, aTKM: number, capturados: number, fav: number, pokeBalls: number,
    superBalls: number, ultraBalls: number, masterBalls: number) {
    console.log('anadirEntrenador');
    this.pokeCollectionEntrenador.doc(nick).set({
      Nick: nick, Nombre: nombre, Genero: genero, Exp: exp, Nivel: nivel, ContenedorExp: contenedorExp,
      MultiplicadorExp: multiplicadorExp, ATK: aTK, ATKM: aTKM, Capturados: capturados, Fav: fav,
      Poke_Balls: pokeBalls, Super_Balls: superBalls, Ultra_Balls: ultraBalls, Master_Balls: masterBalls,
    });
  }

  getKantoFB2(): Promise<PokemonInterface[]> {
    return new Promise((resolve, reject) => {
      const poke: PokemonInterface[] = [];
      let query;
      query = this.pokeCollectionKanto.ref.orderBy('numero_regional', 'asc').get();

      query.then((d) => {
        d.forEach((u) => {
          const x = { numNacional: u.id, ...u.data() };
          poke.push(x);
        });

        resolve(poke);
      });
    });
  }

  getJohtoFB2(): Promise<PokemonInterface[]> {
    return new Promise((resolve, reject) => {
      const poke: PokemonInterface[] = [];
      let query;
      query = this.pokeCollectionJohto.ref.orderBy('numero_regional', 'asc').get();

      query.then((d) => {
        d.forEach((u) => {
          const x = { numNacional: u.id, ...u.data() };
          poke.push(x);
        });

        resolve(poke);
      });
    });
  }

  getHoennFB2(): Promise<PokemonInterface[]> {
    return new Promise((resolve, reject) => {
      const poke: PokemonInterface[] = [];
      let query;
      query = this.pokeCollectionHoenn.ref.orderBy('numero_regional', 'asc').get();

      query.then((d) => {
        d.forEach((u) => {
          const x = { numNacional: u.id, ...u.data() };
          poke.push(x);
        });

        resolve(poke);
      });
    });
  }

  

  getEntrenador2FB(): Promise<Entrenador[]> {
    return new Promise((resolve, reject) => {
      const entrenador: Entrenador[] = [];
      let query;
      query = this.pokeCollectionEntrenador.ref.orderBy('Nombre', 'asc').get();
      query.then((d) => {
        d.forEach((u) => {
          const x = { Nick: u.id, ...u.data() };
          entrenador.push(x);
        });
        resolve(entrenador);
      });
    });
  }




  anadirPokemonFBentero(poke: PokemonInterface) {

    this.pokeCollection.doc(poke.region).collection<PokemonInterface>('pokemon').doc(poke.numero_regional).set({
      numero_nacional: poke.numero_nacional, numero_regional: poke.numero_regional, region: poke.region, nombre: poke.nombre, tipoUno: poke.tipoUno, tipoDos: poke.tipoDos,
      genero: poke.genero, descripcion: poke.descripcion, numeroEvolucion: poke.numeroEvolucion, nivelEvolucion: poke.nivelEvolucion, evoluciona: poke.evoluciona,
      nivel: (poke.nivel !== undefined ? poke.nivel : ''), experiencia: (poke.experiencia !== undefined ? poke.experiencia : ''),
      contadorExp: (poke.contadorExp !== undefined ? poke.contadorExp : ''), ContenedorExp: (poke.ContenedorExp !== undefined ? poke.ContenedorExp : ''),
      MultiplicadorExp: (poke.MultiplicadorExp !== undefined ? poke.MultiplicadorExp : ''), hp: (poke.hp !== undefined ? poke.hp : ''), hp_max: (poke.hp_max !== undefined ? poke.hp_max : ''),
      ataque: (poke.ataque !== undefined ? poke.ataque : ''), defensa: (poke.defensa !== undefined ? poke.defensa : ''),
      ataque_especial: (poke.ataque_especial !== undefined ? poke.ataque_especial : ''), defensa_especial: (poke.defensa_especial !== undefined ? poke.defensa_especial : ''),
      velocidad: (poke.velocidad !== undefined ? poke.velocidad : ''), estado: (poke.estado !== undefined ? poke.estado : ''),
      IV: (poke.IV !== undefined ? poke.IV : ''), EV: (poke.EV !== undefined ? poke.EV : ''),
      capturado: (poke.capturado !== undefined ? poke.capturado : ''), favorito: (poke.favorito !== undefined ? poke.favorito : ''),
      ball: (poke.ball !== undefined ? poke.ball : '')
    });
  }

}
