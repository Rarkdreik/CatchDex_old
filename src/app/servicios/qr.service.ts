import { Injectable } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { AvatarPage } from '../paginas/avatar/avatar.page';
import { ToastService } from './toast.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class QrService {

  constructor(private qrScanner: QRScanner, private toast: ToastService, private fire: FirebaseService) { }

  public async prepararScanner() {
    return await this.qrScanner.prepare();
  }

  public mostrarQr() {
    return this.qrScanner.show();
  }

  public usarCamaraTrasera() {
    return this.qrScanner.useBackCamera();
  }

  public escanear() {
    return this.qrScanner.scan();
  }

  public escaneado(text) {
    if (text.result != undefined) {
      this.toast.presentarToast('Codigo Leido:' + '\n\t' + text.result , 'success', 3000);
      this.fire.prueba(text.result);
    }
    else {
      this.toast.presentarToast('Codigo Leido:' + '\n\t' + text , 'success', 3000);
      this.fire.prueba(text);
    }
    this.hideCamera();
  }

  public abrirConfiguracion() {
    return this.qrScanner.openSettings();
  }

  public hideCamera() {
    return this.qrScanner.hide();
  }

  public destruirQr() {
    return this.qrScanner.destroy();
  }

}
