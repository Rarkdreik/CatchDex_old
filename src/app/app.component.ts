import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DatabaseService } from './servicios/database.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent {  
  // rootPage: any = null;
  // public appPages = [
  //   { title: 'KANTO', url: '/tabs/tab1' },
  //   { title: 'JOHTO', url: '/home' },
  //   { title: 'TODOS', url: '/home' },
  //   { title: 'captura-prueba', url: '/captura-prueba' },
  // ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      setTimeout(() => {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      }, 10000);
    });
  }

}
