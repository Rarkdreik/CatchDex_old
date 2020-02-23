import { Component, OnInit } from '@angular/core';
import { Entrenador } from '../../modelo/entrenador';
import { Router } from '@angular/router';
import { PokemonInterface } from '../../modelo/Pokemons';
import { RepositorioService } from '../../servicios/repositorio.service';
import { ImagenService } from '../../servicios/imagen.service';
import { QrService } from '../../servicios/qr.service';
import { LoadingService } from '../../servicios/loading.service';
import { AlertsService } from '../../servicios/alerts.service';
import { FirebaseService } from '../../servicios/firebase.service';
import { CodigoQrInterface } from '../../modelo/codigoqr';

@Component({
  selector: 'app-avatar',
  templateUrl: 'avatar.page.html',
  styleUrls: ['avatar.page.scss'],
})

export class AvatarPage implements OnInit {
  // Atributos para generar qr
  public qrData: string;
  public elementType: 'url' | 'canvas' | 'img';
  // Atributos para mostrar y ocultar la camara qr
  private ionapp: HTMLElement;
  private boton: HTMLElement;

  constructor( private route: Router, public repo: RepositorioService, public imagen: ImagenService, private qr: QrService, private loading: LoadingService, private alerta: AlertsService, private fire: FirebaseService ) {
    this.qrData = 'qwerty qwerty qwerty';
    this.elementType = 'canvas';
  }

  public async ngOnInit() {
    this.qrData = this.repo.getMaster().nick;
    let codigoQr: CodigoQrInterface = { correo: this.repo.getCorreo(), codigo: this.qrData, usos: 5 }
    await this.fire.crearQr(codigoQr);
  }

  public async galeria() {
    await this.imagen.selectImage();
  }

  public iraregion() {
    this.route.navigateByUrl('tabs/tab2');
  }

  public async leerQr() {
    this.loading.presentLoading('Cargando Lector Qr');
    await this.qr.prepararScanner().then((status) => {
      this.qr.escanear();
    });
    await this.destruirQr(this.qr);
    this.qr.prepararScanner().then((status) => {
      if (status.authorized) {
        this.crearHTML();
        // camera permission was granted and use back camera
        this.qr.usarCamaraTrasera();
        // start scanning
        let scanSub = this.qr.escanear().subscribe((text: string) => {
          // work with scanned text
          this.qr.escaneado(text);
          // stop scanning
          scanSub.unsubscribe();
          // hide camera preview
          this.destruirQr(this.qr);
        });
      } else if (status.denied) {
        // camera permission was permanently denied
        // you must use QRScanner.openSettings() method to guide the user to the settings page
        // then they can grant the permission from there
        this.qr.abrirConfiguracion();
      } else {
        // permission was denied, but not permanently. You can ask for permission again at a later time.
        this.destruirQr(this.qr);
      }
    }).catch((e: any) => {
      this.alerta.alertaSimple('Error al tratar de leer codigo Qr', e, 'error');
      this.destruirQr(this.qr);
    });
  }

  private crearHTML() {
    this.ionapp = window.document.querySelector('app-root') as HTMLElement;
    let body = window.document.querySelector('body') as HTMLElement;
    body.insertAdjacentHTML('beforeend', '<button type="button" class="btn btn-outline-secondary cerrarQrScanner" >Cerrar Lector Qr</button>');
    let boton = window.document.querySelector('.cerrarQrScanner') as HTMLElement;
    boton.addEventListener('click', () => { this.qr.hideCamera().then(() => { this.destruirQr(this.qr) }); }, false);
    this.boton = boton;
    this.ionapp.classList.add('has-camera');
  }

  public eliminarHTML() {
    try {
      this.boton.remove()
      this.ionapp.classList.remove('has-camera');
    } catch (erroneo) {
      // El boton es eliminado al escanear el codigo.
      // No se quiere mostrar al usuario el mensaje de error.
    }
  }

  public destruirQr(qr: any) {
    this.eliminarHTML();
    return qr.hideCamera().then(() => {
      qr.destruirQr();
      this.loading.dismissLoading();
    });
  }

}
