import { ToastService } from './servicios/toast.service';
import { PosibilidadCapturaService } from './servicios/posibilidad-captura.service';
import { PokemonService } from './servicios/pokemon.service';
import { LoadingService } from './servicios/loading.service';
import { FirebaseService } from './servicios/firebase.service';
import { AuthGuard } from './servicios/auth.guard';
import { AudioService } from './servicios/audio.service';
import { AlertsService } from './servicios/alerts.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { HttpClientModule } from '@angular/common/http';

import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { DatabaseService } from './servicios/database.service';
import { IonicStorageModule } from '@ionic/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AuthService } from './servicios/auth.service';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    IonicStorageModule.forRoot(),
    AngularFireAuthModule,
    ReactiveFormsModule
  ],
  providers: [
    GooglePlus,
    NativeAudio,
    NativeStorage,
    SplashScreen,
    StatusBar,
    SQLite, SQLitePorter,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: FirestoreSettingsToken, useValue: {} },
    AuthService,
    AlertsService,
    AudioService,
    AuthGuard,
    DatabaseService,
    FirebaseService,
    LoadingService,
    PokemonService,
    PosibilidadCapturaService,
    ToastService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
