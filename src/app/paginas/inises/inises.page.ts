import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { AlertsService } from "./../../servicios/alerts.service";
import { AuthService } from "./../../servicios/auth.service";
import { User } from '../../modelo/user';

@Component({
  selector: "app-inises",
  templateUrl: "./inises.page.html",
  styleUrls: ["./inises.page.scss"]
})
export class InisesPage implements OnInit {
  public loginForm: FormGroup;
  private user_data: User;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private alertaServicio: AlertsService,
  ) {
    this.user_data = {uid: '', email: '', displayName: '', photoURL: '' }
  }

  public irHome() {
    this.router.navigateByUrl('Home');
  }

  public ngOnInit() {
    this.resetFields();
  }

  private resetFields() {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]]
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
    await this.authService.loginUsuario(this.user_data).then(async (usuario: User) => {
      await this.authService.saveSession(usuario).then(async () => {
        await this.alertaServicio.alertaSimple("Sesión Iniciada", "La sesión ha sido iniciada.", "success").then(() => {
          this.router.navigateByUrl("/iniregion");
        }).catch((error) => { this.alertaServicio.alertaSimple('Error login 3', error + '. Codigo error: 312189.', 'error'); });
      }).catch((erroneo) => { this.alertaServicio.alertaSimple('Error login 2', erroneo + '. Codigo error: 415563.', 'error'); });
    }).catch(error => { this.alertaServicio.alertaSimple('Error login 1', error + '. Codigo error: 545615.', 'error'); });
    this.resetFields();
  }

  public async loginGoogle() {
    await this.authService.iniciarSesionGoogle().then(async (resolve: User) => {
      if (resolve.uid != '' && resolve.uid != null) {
        await this.authService.saveSession(resolve).then(async (ok) => {
          await this.alertaServicio.alertaSimple("Sesión Iniciada", "La sesión ha sido iniciada.", "success").then((ok) => {
            this.router.navigateByUrl("/iniregion");
          }).catch((error) => { this.alertaServicio.alertas(error); });
        }).catch((erroneo) => { this.alertaServicio.alertas(erroneo); });
      } else { this.alertaServicio.alertaSimple("Inicio sesión fallido", 'No se ha podido iniciar esta cuenta, pruebe a registrarse.' + resolve + '' , "warning"); }
    }).catch((erroneo) => { this.alertaServicio.alertaSimple("Error al iniciar sesion", 'No se han encontrado datos, pruebe a registrarse o contacte a un administrador. ' + erroneo + '. codigo de error: 582456' , "error"); });
  }

}
