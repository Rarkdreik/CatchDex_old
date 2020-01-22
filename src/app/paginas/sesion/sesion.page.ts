import { PokemonInterface } from './../../modelo/Pokemons';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DatabaseService } from 'src/app/servicios/database.service';
import { PokemonService } from 'src/app/servicios/pokemon.service';

@Component({
  selector: 'app-sesion',
  templateUrl: './sesion.page.html',
  styleUrls: ['./sesion.page.scss'],
})

export class SesionPage implements OnInit {
  credenciales = {usuario: '', contraseña: '', recordar: 'yes'};
  isenabled: boolean = true;
  loginForm: FormGroup;

  constructor(
    private router: Router,
    public authService: AuthService,
    private googlePlus: GooglePlus,
    public loadingController: LoadingController,
    private platform: Platform,
    public alertController: AlertController,
    private nativeStorage: NativeStorage,
    public formBuilder: FormBuilder,
    private db: DatabaseService,
    private poke: PokemonService
     )  {  }

  ngOnInit(){
    // this.db.getDatabaseState().subscribe(rdy => {
    //   if (rdy) {
    //     this.db.getEntrenador().subscribe(pokemons => {
    //       this.pokemons = pokemons;
    //     })
    //   }
    // });
    this.loginForm = this.formBuilder.group({
      usuario: new FormControl('', Validators.compose([
        Validators.minLength(4),
        Validators.required
      ])),
      region: new FormControl('', Validators.compose([
        Validators.required
      ])),
      pokeini: new FormControl('', Validators.compose([
        Validators.required
      ])),
    });
  }

  async doGoogleLogin(){
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);
    this.googlePlus.login({
      'scopes': '', // optional - space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      'webClientId': environment.googleWebClientId,
      // optional - clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
      'offline': true, // Optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
      })
      .then(user => {
        //save user data on the native storage
        this.nativeStorage.setItem('google_user', {
          name: user.displayName,
          email: user.email,
          picture: user.imageUrl
        })
        .then(() => {
          this.nativeStorage.setItem('datos', {
            usuario: this.loginForm.get('usuario').value,
            email: user.email,
            region: this.loginForm.get('region').value,
            pokeini: this.loginForm.get('pokeini').value,
          }).then((d) => {
            this.db.getDatabaseState().subscribe(rdy => {
              if (rdy) {
                let pokemon: PokemonInterface;
                pokemon = this.poke.getStatsPokemon(this.loginForm.get('pokeini').value);
                console.log('pantanlla sesion un problema amigos');
                this.db.addPokemonEquipo(pokemon);
                this.db.addPokemonAtrapado(pokemon);
              }
            });
          });
          this.router.navigate(["/main/home"]);
        }, (error) => {
          console.log(error);
        })
        loading.dismiss();
      }, err => {
        console.log(err);
        if(!this.platform.is('cordova')){
          this.presentAlert();
        }
        loading.dismiss();
      })
  }

  async presentAlert() {
    const alert = await this.alertController.create({
       message: 'Cordova is not available on desktop. Please try this in a real device or in an emulator.',
       buttons: ['OK']
     });

    await alert.present();
  }


  async presentLoading(loading) {
    return await loading.present();
  }

}