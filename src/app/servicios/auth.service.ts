import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AlertsService } from './alerts.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import * as firebase from 'firebase/app';

interface User {
  uid: string;
  email: string;
  photoURL?: string;
  nickname?: string;
  regionInicial?: string;
  pokemonInicial?: string;
}

// tslint:disable: no-inferrable-types
// tslint:disable: prefer-const
@Injectable()
export class AuthService {
  private datos: string[] = [];
  private nombre: string = '';
  private correo: string = '';
  private region: string = '';
  private pokeini: string = '';

  user: Observable<User>;

  constructor(
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private alertaServicio: AlertsService
  ) {
    // Get auth data, then get firestore user document || null
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  /**
   * Asfdasdf
   * @param userdata sdfgsdg
   */
  async registroUsuario(userdata) {
    const credential = await this.afAuth.auth.createUserWithEmailAndPassword(userdata.email, userdata.password);
    return this.updateUserData(credential.user);
  }

  /**
   *
   * @param userdata fghdfgh
   */
  async loginUsuario(userdata) {
    const credential = await this.afAuth.auth.signInWithEmailAndPassword(userdata.email, userdata.password);
    return this.updateUserData(credential.user);
  }

  /**
   *
   * @param user qwerty
   */
  private updateUserData(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    console.log(user);
    console.log(user.nickname);
    console.log(user.displayName);
    const data = {
      uid: user.uid,
      email: user.email,
      photoURL: user.photoURL,
      nickname: user.displayName,
      regionInicial: user.regionInicial,
      pokemonInicial: user.pokemonInicial,
    };
    return userRef.set(data, { merge: true });
  }

  /**
   *
   */
  signOut() {
    let
      title: any = '¿Está usted seguro?', text: any = 'Esto no podrá ser revertido!', icon: any = 'warning',
      confirmButtonColor: any = '#39ff', confirmButtonText: any = 'Si, cerrar sesión!', cancelButtonColor: any = '#d33',
      cancelButtonText: any = 'Cancelar';

    this.alertaServicio.alertaCompleja(title, text, icon, confirmButtonColor, confirmButtonText, cancelButtonColor, cancelButtonText)
      .then((result) => {
        if (result.value) {
          title = 'Cerrada!'; text = 'Tu sesión ha sido cerrada.'; icon = 'success';
          this.alertaServicio.alertaSimple('Borrado!', 'Tu nota ha sido borrada.', 'success').then(() => {
            this.afAuth.auth.signOut().then(() => {
              this.router.navigate(['/inicio/tabs/tab1']);
            });
          });
        }
      });
  }

  /**
   *
   */
  isAuthenticated() {
    const user = this.afAuth.auth.currentUser;
    if (user) {
      return true;
    } else {
      return false;
    }
  }

  loginGoogle() {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(() => {
      this.alertaServicio.alertaSimple('Logeado!', 'Has entrado al mondo google.', 'success');
    }).catch(() => {
      this.alertaServicio.alertaSimple('Ups...!', 'La has cagado...', 'error').then(() => {
      });
    });
  }

  /**
   *
   */
  async googleSignin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }

  registerUser(email: string, pass: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(email, pass)
        .then(userData => resolve(userData),
          err => reject(err));
    });
  }

  loginEmail(email: string, pass: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, pass)
        .then(userData => resolve(userData),
          err => reject(err));
    });
  }

  getAuth() {
    console.log('authservice ' + this.afAuth.authState);
    return this.afAuth.authState;
  }

  logout() {
    return this.afAuth.auth.signOut();
  }

  getdatos() {
    return this.datos;
  }

  setdatos(datos: string[]) {
    const d: string[] = [];
    this.nombre = datos[0];
    this.correo = datos[1];
    this.region = datos[2];
    this.pokeini = datos[3];
    d.push(datos[0]);
    d.push(datos[1]);
    d.push(datos[2]);
    d.push(datos[3]);
  }

}
