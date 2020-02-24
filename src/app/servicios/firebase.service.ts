import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { PokemonInterface } from '../modelo/Pokemons';
import { environment } from '../../environments/environment';
import { Entrenador } from '../modelo/entrenador';
import { User } from '../modelo/user';
import { RepositorioService } from './repositorio.service';
import { AlertsService } from './alerts.service';
import { CodigoQrInterface } from '../modelo/codigoqr';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {
  private catchdex_fb: AngularFirestoreDocument<any>;
  private pokeCollection: AngularFirestoreCollection<any>;
  private masterCollection: AngularFirestoreCollection<Entrenador>;
  private qrDocument: AngularFirestoreDocument<CodigoQrInterface>;
  private pokemon: PokemonInterface;
  private master: Entrenador;

  constructor(private af: AngularFirestore, private repo: RepositorioService, private alert: AlertsService, private toast: ToastService) {
    this.master = { nick: 'Ash', exp: 0, nivel: 1, pokeBalls: 0, superBalls: 0, ultraBalls: 0, masterBalls: 0, region_ini: 'pais', poke_ini: this.pokemon, favoritos: [], capturados: [] };
    this.pokemon = { numero_nacional: '000', numero_regional: '000', region: 'pais', nombre: 'nadie1', tipo_uno: 'nada1', tipo_dos: 'nada2', genero: 'otro', descripcion: 'nada', numero_evolucion: 0, nivel_evolucion: 0, evolucion: '002' };
  }

  public inicializar(correo: string) {
    this.catchdex_fb = this.af.collection(environment.id_app).doc(correo);
    this.pokeCollection = this.catchdex_fb.collection('pokedex');
    this.masterCollection = this.catchdex_fb.collection('entrenador');
    this.qrDocument = this.af.collection(environment.id_app).doc('codigos')
    // this.add_datos();
    // this.addMaster(this.master);
  }

  /////////////////////////////////////////////////////////////
  //////////////////  Usuario  ////////////////////////////////
  /////////////////////////////////////////////////////////////

  public async getDatosUsuario(user: User): Promise<User> {
    let userRef: AngularFirestoreDocument<User> = this.af.collection(user.email).doc('correo');
    return await userRef.get().toPromise().then(resultado => {
      let usuario: User = {
        uid: resultado.data().uid,
        email: resultado.data().email,
        photoURL: resultado.data().photoURL,
        displayName: resultado.data().displayName,
      }
      return usuario;
    }).catch(async (erroneo) => {
      return null;
    });
  }

  /**
   *
   * @param user qwerty
   */
  public setDatosUsuario(user): User {
    const userRef: AngularFirestoreDocument<User> = this.af.collection(user.email).doc('correo');
    const data = {
      uid: user.uid,
      email: user.email,
      photoURL: user.photoURL,
      displayName: user.displayName,
    };
    if (user.displayName == null || user.displayName == '') {
      data.displayName = '';
      data.photoURL = '../../assets/images/avatar/avatar.png';
    }
    userRef.set(data);
    this.repo.setUsuario(data);
    return this.repo.getUsuario();
  }

  /**
   *
   * @param user qwerty
   */
  public updateUserData(user): User {
    const userRef: AngularFirestoreDocument<User> = this.af.collection(user.email).doc('correo');
    const data = {
      uid: user.uid,
      email: user.email,
      photoURL: user.photoURL,
      displayName: user.displayName,
    };
    if (user.displayName == null || user.displayName == '') {
      data.displayName = '';
      data.photoURL = '../../assets/images/avatar/avatar.png';
    }
    // userRef.set(data, { merge: true });
    userRef.update(data).then((resultado) => { }).catch((erroneo) => { userRef.set(data, { merge: true }); })
    this.repo.setUsuario(data);
    return this.repo.getUsuario();
  }

  public deleteUser(user) {
    const userRef: AngularFirestoreDocument<User> = this.af.collection(user.email).doc('correo');
    return userRef.delete();
  }

  public setDisplayName(nombre: string) {
    this.updateUserData(this.repo.getUsuario());
  }

  /////////////////////////////////////////////////////////////
  //////////////////  Codigo Qr  //////////////////////////////
  /////////////////////////////////////////////////////////////

  /**
   * 
   * @param correo 
   * @param codigo 
   * @param uso 
   * @param tiempo 
   */
  public async crearQr(codigoQr: CodigoQrInterface) {
    // this.leerQr(codigoQr).then((resultado) => {}).catch((erroneo) => {});
    const qrRef = this.af.collection(environment.id_app).doc('codigos').collection('qr').doc<CodigoQrInterface>(codigoQr.correo);
    const data: CodigoQrInterface = {
      codigo: codigoQr.codigo,
      correo: codigoQr.correo,
      usos: codigoQr.usos
    }
    await qrRef.set(data);
  }

  private async leerQr(codigoQr: CodigoQrInterface) {
    const qrRef = this.af.collection(environment.id_app).doc('codigos').collection('qr').doc<CodigoQrInterface>(codigoQr.correo);
    return new Promise(async (resolve, reject) => {
      await qrRef.get().toPromise().then(resultado => {
        const qr: CodigoQrInterface = {
          codigo: resultado.data().codigo,
          correo: resultado.data().correo,
          usos: resultado.data().usos,
        }
        resolve(qr);
      }).catch(async (erroneo) => {
        this.toast.cerrarToast();
        this.toast.presentarToast('No se ha podido leer el codigo qr. ' + erroneo, 'warning', 3000).then(() => {
          reject(null);
        });
      });
    });
  }

  public async actualizarQr(codigoQr: CodigoQrInterface) {
    const qrRef = this.af.collection(environment.id_app).doc('codigos').collection('qr').doc<CodigoQrInterface>(codigoQr.correo);
    return await qrRef.update(codigoQr).then(() => {
      this.toast.presentarToast('Codigo qr actualizado.', 'warning', 3000);
    }).catch(async (erroneo) => {
      this.toast.cerrarToast();
      this.toast.presentarToast('No se ha podido actualizar el codigo qr. ' + erroneo, 'warning', 3000);
    });
  }

  public async deleteQr(correo: string) {
    const qrRef = this.af.collection(environment.id_app).doc('codigos').collection('qr').doc<CodigoQrInterface>(correo);
    return await qrRef.delete();
  }

  public async prueba(codigo: string) {
    let codigosQrRef = this.af.collection(environment.id_app).doc('codigos').collection('qr').ref;
    let query = await codigosQrRef.get().then(async snapshot => {
      if (snapshot.empty) {
        this.toast.presentarToast('No existen codigos Qr', 'danger', 3000);
        return;
      }
      snapshot.forEach(async doc => {
        if (codigo === doc.data().codigo) {
          if (doc.data().usos >= 1) {
            let codeQr = doc.data() as CodigoQrInterface;
            let pokeMaestro = this.repo.getMaster();
            pokeMaestro.pokeBalls += 5;
            pokeMaestro.superBalls += 3;
            pokeMaestro.ultraBalls += 2;
            pokeMaestro.masterBalls += 1;
            if (pokeMaestro.favoritos == undefined) { pokeMaestro.favoritos = []; }
            this.repo.setMaster(pokeMaestro);
            await this.addMaster(pokeMaestro);
            this.toast.presentarToast('Has conseguido: \n\tx' + pokeMaestro.pokeBalls + ' pokeballs' +
              '\n\tx' + pokeMaestro.superBalls + ' Superballs' + '\n\tx' + pokeMaestro.ultraBalls + ' Ultraballs' +
              '\n\tx' + pokeMaestro.masterBalls + ' Masterballs' + '', 'success', 5000);
            codeQr.usos -= 1;
            this.actualizarQr(codeQr);
          } else {
            this.toast.cerrarToast();
            this.toast.presentarToast('Ya no se puede usar este codigo qr', 'warning', 5000);
          }
        }
      });
    }).catch(err => {
      
    });
  }

  /////////////////////////////////////////////////////////////
  //////////////////  Entrenador  /////////////////////////////
  /////////////////////////////////////////////////////////////


  public async getEntrenador() {
    await this.masterCollection.doc<Entrenador>('ash').get().toPromise().then(resultado => {
      this.master = {
        nick: resultado.data().nick,
        exp: resultado.data().exp,
        nivel: resultado.data().nivel,
        pokeBalls: resultado.data().pokeBalls,
        superBalls: resultado.data().superBalls,
        ultraBalls: resultado.data().ultraBalls,
        masterBalls: resultado.data().masterBalls,
        region_ini: resultado.data().region_ini,
        poke_ini: resultado.data().poke_ini,
        capturados: resultado.data().capturados,
        favoritos: resultado.data().favoritos,
      };
    });
    return this.master;
  }

  public async addMaster(master: Entrenador) {
    await this.masterCollection.doc<Entrenador>('ash').set(master);
  }

  public async updateMaster(master: Entrenador) {
    await this.masterCollection.doc<Entrenador>('ash').set(master, { merge: true });
  }

  public async deleteMaster(master: Entrenador) {
    await this.masterCollection.doc<Entrenador>('ash').delete();
  }

  public addPokemonAtrapado(pokemon: PokemonInterface) {
    this.repo.getMaster().capturados.push(pokemon);
    this.updateMaster(this.repo.getMaster());
  }

  public addPokemonFavorito(pokemon: PokemonInterface) {
    this.repo.getMaster().favoritos.push(pokemon.numero_nacional);
    this.updateMaster(this.repo.getMaster());
  }

  /////////////////////////////////////////////////////////////
  //////////////////  Pokemon  ////////////////////////////////
  /////////////////////////////////////////////////////////////

  public addPokemon(pokemon: PokemonInterface) {
    return this.pokeCollection.doc<PokemonInterface>(pokemon.numero_nacional).set(pokemon);
  }

  public async getPokemonAtrapado() {
    let pokes: PokemonInterface[] = [];
    return await this.pokeCollection.ref.get().then(async snapshot => {
      if (snapshot.empty) {
        this.toast.presentarToast('No existen pokemon atrapados.', 'danger', 3000);
        return null;
      } else {
        snapshot.forEach(async doc => {
          let poke: PokemonInterface = doc.data() as PokemonInterface;
          pokes.push(poke)
        });
        return pokes;
      }
    });
  }


}
