import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {
  private datos: string[] = [];
  private nombre: string = '';
  private correo: string = '';
  private region: string = '';
  private pokeini: string = '';

  constructor(
    public afAuth: AngularFireAuth
  ) { }

  loginTwitter () {
    return this.afAuth.auth.signInWithPopup( new firebase.auth.TwitterAuthProvider());
  }

  loginFacebook() {
    return this.afAuth.auth.signInWithPopup( new firebase.auth.FacebookAuthProvider());
  }

  loginGoogle() {
    return this.afAuth.auth.signInWithPopup( new firebase.auth.GoogleAuthProvider());
  }

  registerUser(email: string, pass: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(email, pass)
      .then( userData =>  resolve(userData),
      err => reject (err));
    });
  }

  loginEmail(email: string, pass: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, pass)
      .then( userData =>  resolve(userData),
      err => reject (err));
    });
  }

  getAuth() {
    console.log('authservice ' + this.afAuth.authState)
    return this.afAuth.authState;
  }

  logout() {
    return this.afAuth.auth.signOut();
  }

  getdatos() {
    return this.datos;
  }

  setdatos(datos: string[]) {
    let d: string[] = []
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