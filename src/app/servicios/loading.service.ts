import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(public loadingController: LoadingController) { }

  /**
   * Crea y Presenta un Loading.
   * @param mensaje Es el mensaje que aparece mientras está presentando.
   * @param duracion Es la duración en milisegundos.
   * Devuelve un Promise
   */
  async presentLoading(mensaje: string, duracion: number = 2000): Promise<any> {
    const loading = await this.loadingController.create({
      message: mensaje,
      duration: duracion
    });
    return await loading.present();
  }

  /**
   * Cierra el loading.
   * 
   * Devuelve un Promise.
   */
  async dismissLoading(): Promise<any> {
    return await this.loadingController.dismiss();
  }
}
