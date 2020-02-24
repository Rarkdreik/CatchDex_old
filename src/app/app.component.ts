import { Component } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './servicios/auth.service';
import { RepositorioService } from './servicios/repositorio.service';
import { FirebaseService } from './servicios/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent {
  private id_menu: string = 'home';

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private authService: AuthService,
    private menu: MenuController,
    public repo: RepositorioService,
    public fire: FirebaseService,
  ) {
    this.initializeApp();
  }

  private initializeApp() {
    this.platform.ready().then(async () => {
      setTimeout(async () => {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        this.cargarMenuHome();
      }, 4000);
    });
  }

  private cargarMenuHome() {
    this.menu.enable(true, this.id_menu);
    this.menu.swipeGesture(true, this.id_menu);
  }

  public cerrarMenuHome() {
    this.menu.close();
  }

  public async cerrarSesion() {
    this.router.navigateByUrl('/home')
    await this.authService.logout();
  }

  public async borrarCuenta() {
    await this.authService.borrarSesion();
  }

  public isAutenticated() {
    return this.authService.isAuthenticated();
  }

}
