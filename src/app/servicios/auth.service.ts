import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertsService } from './alerts.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { User } from '../modelo/user';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Platform } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { FirebaseService } from './firebase.service';
import { RepositorioService } from './repositorio.service';

@Injectable()
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private googlePlus: GooglePlus,
    private router: Router,
    private alertaServicio: AlertsService,
    private local: NativeStorage,
    private plt: Platform,
    private fireServicio: FirebaseService,
    private repo: RepositorioService
  ) { }

  /**
   * Inicia sesión de un usuario en firebase con el metodo signInWithEmailAndPassword.
   * @param userdata Los datos del usuario.
   */
  public async loginUsuario(userdata) {
    let credential = await this.afAuth.auth.signInWithEmailAndPassword(userdata.email, userdata.password);
    return new Promise(async (resolve) => {
      await this.fireServicio.getDatosUsuario(credential.user).then((user: User) => {
        resolve(this.fireServicio.updateUserData(user));
      }).catch((erroneo) => {
        return this.alertaServicio.alertaSimple('Información invalida', 'No se ha encontrado la información de la cuenta ' + erroneo + ', intenta registrarte como un nuevo entrenador, o contacta al soporte técnico.', 'info').then(() => {
          this.fireServicio.setDatosUsuario(credential.user)
          this.router.navigateByUrl('/iniregion');
          return null;
        });
      });
    });
  }

  /**
   * Registra un usuario en firebase con el metodo createUserWithEmailAndPassword.
   * @param userdata Los datos del usuario.
   */
  public async registroUsuario(userdata): Promise<User> {
    const credential = await this.afAuth.auth.createUserWithEmailAndPassword(userdata.email, userdata.password);
    return new Promise((resolve) => { resolve(this.fireServicio.updateUserData(credential.user)) });
  }

  public isAuthenticated(): boolean {
    return this.repo.getUsuario() ? true : false;
  }

  /**
   * Almacena el usuario en local con el nombre 'user'
   * @param user el usuario a almacenar, en caso de omisión eliminará el usuario -> se emplea cuando cerramos sesión.
   */
  public async saveSession(user?: User): Promise<void> {
    try {
      if (user as User) {
        this.repo.setUsuario(user);
        return await this.local.setItem('user', user);
      } else {
        this.repo.setUsuario(null);
        return await this.local.remove('user');
      }
    } catch (erroneo) {
      this.alertaServicio.alertaSimple('Error', erroneo, 'error');
    }
  }

  /**
   * Almacena el usuario en local con el nombre 'user'
   * @param user el usuario a almacenar, en caso de omisión
   * saveSession() emilinará el usuario-> se emplea cuando cerramos
   * sesión.
   */
  public async cargarSession(): Promise<void> {
    return new Promise(async (resolve) => {
      try {
        this.saveSession(await this.local.getItem('user'));
      } catch (err) {
        this.saveSession(null);
      } finally { 
        resolve();
      }
    })
  }

  /**
   * Inicia sesión con google
   */
  public async iniciarSesionGoogle(): Promise<any> {
    if (this.plt.is('cordova')) {
      const gplusUser = await this.googlePlus.login({'webClientId': environment.googleWebClientId, 'offline': true });
      return await this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken)).then(async (credenciales) => {
        let usuario: User = { uid: credenciales.user.uid, email: credenciales.user.email, photoURL: credenciales.user.photoURL, displayName: credenciales.user.displayName };
        return await this.fireServicio.getDatosUsuario(usuario);
      });
    }
    else {
      return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(async (credenciales) => {
        let usuario: User = { uid: credenciales.user.uid, email: credenciales.user.email, photoURL: credenciales.user.photoURL, displayName: credenciales.user.displayName };
        return this.fireServicio.getDatosUsuario(usuario);
      });
    }
  }

  /**
   * Registra usuario con la sesion de google
   */
  public async registrarSesionGoogle(): Promise<any> {
    if (this.plt.is('cordova')) {
      const gplusUser = await this.googlePlus.login({ 'webClientId': environment.googleWebClientId, 'offline': true });
      return await this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken)).then(async (credenciales) => {
        let usuario: User = { uid: credenciales.user.uid, email: credenciales.user.email, photoURL: credenciales.user.photoURL, displayName: credenciales.user.displayName };
        return this.fireServicio.setDatosUsuario(usuario);
      });
    }
    else {
      return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(async (credenciales) => {
        let usuario: User = { uid: credenciales.user.uid, email: credenciales.user.email, photoURL: credenciales.user.photoURL, displayName: credenciales.user.displayName };
        return this.fireServicio.setDatosUsuario(usuario);
      });
    }
  }

  /**
   * Cierra la sesión
   */
  public async logout() {
    this.logoutNormal();
  }

  /**
   * Cierra la sesión de google plus
   */
  private async logoutGoogle() {
    return await this.googlePlus.logout();
  }

  /**
   * Cierra la sesion guardando el usuario nulo en el repositorio, y elimina el usuario en local.
   * Con el aviso alert que nos redirige al inicio.
   */
  private async logoutNormal() {
    await this.afAuth.auth.signOut().then(async () => {
      this.repo.setUsuario(null);
      this.saveSession();
      await this.logoutGoogle();
      this.router.navigateByUrl('/inises');
      this.alertaServicio.alertaSimple('¡Sesión Cerrada!', 'Tu sesión ha sido cerrada correctamente.', 'success').then(() => {
        this.router.navigateByUrl('/home');
      });
    }).catch((erroneo) => {
      this.alertaServicio.alertaSimple('¡Sesión no Cerrada!', 'Tu sesión no ha podido ser cerrada. ' + erroneo, 'error');
    });
  }

  /**
   * Pide confirmacion para eliminar la sesion, el usuario y todos sus datos.
   */
  public async borrarSesion() {
    return await this.alertaServicio.alertaSimple('Cerrar Sesión', 'Primero cerraremos la sesión antes de proceder a eliminar la cuenta.', 'info').then(async () => {
      let user = this.repo.getUsuario();
      this.repo.setUsuario(null);
      this.saveSession();
      await this.logoutGoogle();
      await this.router.navigateByUrl('/inises');
      await this.alertaServicio.alertaSimple('¡Sesión Cerrada!', 'Tu sesión ha sido cerrada correctamente y procederemos a eliminar la cuenta.', 'success').then(async () => {
        await this.alertaServicio.alertaCompleja('¿Borrar la cuenta y todo el progreso obtenido?', 'Se borraran todos los datos del usuario y del entrenador. ¡Esto no podrá ser revertido!',
          'warning', '#39ff', 'Si, deseo borrar todo', '#d33', 'Cancelar').then(async (result) => {
            if (result.value) {
              this.fireServicio.deleteQr(user.email);
              this.fireServicio.deleteUser(user);
              this.fireServicio.deleteMaster(this.repo.getMaster());
              await this.afAuth.auth.currentUser.delete().then(() => {
                this.alertaServicio.alertaSimple('¡Cuenta Eliminada!', 'Tu cuenta ha sido eliminada y todos sus datos.', 'success').then(() => {
                  this.router.navigateByUrl('/home');
                }).catch((error) => {
                  this.alertaServicio.alertaSimple('Error al Eliminar', 'Tu cuenta no ha podido ser eliminada, comprueba la conexión.', 'error')
                });
              });
            } else {
              this.alertaServicio.alertaSimple('Cuenta indultada', 'Tu cuenta ha sido indultada.', 'info').then(() => { });
            }
          });
      });
    });
  }

}
