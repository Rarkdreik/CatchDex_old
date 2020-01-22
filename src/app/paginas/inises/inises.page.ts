import { LoadingService } from './../../servicios/loading.service';
import { AlertsService } from './../../servicios/alerts.service';
import { AuthService } from './../../servicios/auth.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

export interface UserData {
  email: string;
  password: string;
}

// tslint:disable: no-inferrable-types
@Component({
  selector: 'app-inises',
  templateUrl: './inises.page.html',
  styleUrls: ['./inises.page.scss'],
})
export class InisesPage implements OnInit {
  @ViewChild('iniciar', {static: false}) btnIniciar: HTML;

  loginForm: FormGroup;
  userdata: UserData = {
    email: '',
    password: '',
  };
  login: boolean = true;
  tituloComponente: string = 'Iniciar Sesión';
  textoBotonIr: string = 'Ir a Registrar Cuenta';
  textoBoton: string = 'Iniciar';

  constructor(
    public authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private alertaServicio: AlertsService,
    private loadServicio: LoadingService,
    private storage: NativeStorage,
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'), Validators.minLength(6)]]
    });
  }

  async saveUserdata() {
    await this.storage.setItem('email', this.loginForm.get('email').value)
      .then(() => {
        console.log('1 ' + this.loginForm.get('email').value);
      }).catch(() => {
        console.log('2 ' + this.loginForm.get('email').value);
      });
    await this.storage.setItem('password', this.loginForm.get('password').value)
      .then(() => {
        console.log('1 ' + this.loginForm.get('password').value);
      }).catch(() => {
        console.log('2 ' + this.loginForm.get('password').value);
      });
  }

  async onSubmit() {
    
    // this.loadServicio.presentLoading('Cargando');
    await this.saveUserdata();
    await this.storage.getItem('email')
      .then(async (valor) => {
        this.userdata.email = valor;
        console.log('3 ' + valor);
        await this.storage.getItem('password')
          .then((valor) => {
            this.userdata.password = valor;
            console.log('5 ' + valor);
          }).catch((valor) => {
            console.log('6 ' + valor);
          });
      }).catch((valor) => {
        console.log('4 ' + valor);
      });
    
    switch (this.textoBoton) {
      case 'Iniciar':
        this.authService.loginUsuario(this.userdata)
          .then(() => {
            console.log('1 ');
            this.alertaServicio.alertaSimple('Sesión Iniciada', 'La sesión ha sido iniciada, disfruta de Notea.', 'success')
              .then(() => {
                this.router.navigateByUrl('/inicio/tabs/tab1');
              });
            console.log('2 ');
          })
          .catch((error) => {
            console.log('3 ');
            this.alertaServicio.alertas(error);
            console.log('4 ');
          })
          // .finally(() => {
          //   console.log('5 ');
          //   this.loadServicio.dismissLoading();
          //   console.log('6 ');
          // })
          ;
        break;
      case 'Registrar':
        this.authService.registroUsuario(this.userdata)
          .then(() => {
            this.alertaServicio.alertaSimple('Cuenta Activada', 'La cuenta ya ha sido activada, disfruta de Notea.', 'success')
              .then(() => {
                this.router.navigateByUrl('/inicio/tabs/tab1');
              });
          })
          .catch((error) => {
            this.alertaServicio.alertas(error);
          })
          .finally(() => {
            this.loadServicio.dismissLoading();
          });
        break;
    }
    this.resetFields();
  }

  resetFields() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'), Validators.minLength(6)]]
    });
  }

  irRegistro() {
    this.login = false;
    this.tituloComponente = 'Registrar Cuenta';
    this.textoBotonIr = 'Ir a Iniciar sesión';
    this.textoBoton = 'Registrar';
  }

  irInicio() {
    this.login = true;
    this.tituloComponente = 'Iniciar Sesión';
    this.textoBotonIr = 'Ir al Registro';
    this.textoBoton = 'Iniciar';
  }


  irHome() {
    this.router.navigateByUrl('Home');
  }

  iniciarGooglePlus() {

  }

}
