import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertsService } from '../../servicios/alerts.service';
import { AuthService } from '../../servicios/auth.service';
import { User } from '../../modelo/user';
import { RepositorioService } from '../../servicios/repositorio.service';
import { FirebaseService } from '../../servicios/firebase.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  public loginForm: FormGroup;
  private user_data: any = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private alertaServicio: AlertsService,
    private fireServicio: FirebaseService,
  ) { }

  public irHome() {
    this.router.navigateByUrl('Home');
  }

  public ngOnInit() {
    this.resetFields();
  }

  private resetFields() {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.pattern("^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$"), Validators.minLength(6)]]
    });
  }

  public saveUserData() {
    return {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value,
    };
  }

  public async onSubmit() {
    this.user_data = this.saveUserData();
    await this.authService.registroUsuario(this.user_data).then(async (usuario: User) => {
      this.user_data = usuario;
      await this.authService.saveSession(this.user_data).then(async (ok) => {
        await this.alertaServicio.alertaSimple("Cuenta creada", "Ahora procedemos a crear el entrenador, rellene los siguientes campos.", "info").then((ok) => {
          this.router.navigateByUrl("/iniregion");
        }).catch((error) => {
          this.alertaServicio.alertas(error);
        });
      }).catch((erroneo) => {
        this.alertaServicio.alertas(erroneo);
      });
    }).catch(error => {
      this.alertaServicio.alertas(error);
    });
    this.resetFields();
  }

  public async registroGoogle() {
    await this.authService.registrarSesionGoogle().then(async (resolve: User) => {
      if (resolve.uid != '' && resolve.uid != null) {
        await this.authService.saveSession(resolve).then(async (ok) => {
          await this.alertaServicio.alertaSimple("Cuenta creada", "Ahora procedemos a crear el entrenador, rellene los siguientes campos.", "info").then((ok) => {
            this.router.navigateByUrl("/iniregion");
          }).catch((error) => { this.alertaServicio.alertas(error); });
        }).catch((erroneo) => { this.alertaServicio.alertas(erroneo); });
      } else { this.alertaServicio.alertaSimple("Registro fallido", 'No se ha podido registrar esta cuenta, comprueba si ya existe. ' + resolve + '' , "warning"); }
    }).catch((error) => { this.alertaServicio.alertas(error); });
  }
}
