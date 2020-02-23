import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

interface Sound {
  key: string;
  asset: string;
  isNative: Boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private sounds: Sound[] = [];
  private audioPlayer: HTMLAudioElement = new Audio();
  private forceWebAudio: Boolean = true;

  constructor(private platform: Platform, private nativeAudio: NativeAudio) { }

  /**
   * Carga en memoria un audio dandole un nombre que la identifica y la ruta del archivo deseado.
   * 
   * @param key Nombre identificador del sonido indicado en asset.
   * @param asset Ruta del archivo de sonido/audio.
   */
  public preload(key: string, asset: string): void {

    if (this.platform.is('cordova') && !this.forceWebAudio) {

      this.nativeAudio.preloadSimple(key, asset);

      this.sounds.push({
        key: key,
        asset: asset,
        isNative: true
      });

    } else {

      const audio = new Audio();
      // let src = asset;

      this.sounds.push({
        key: key,
        asset: asset,
        isNative: false
      });

    }

  }

  /**
   * Reproduce un audio indicado que previamente ha sido cargado.
   * 
   * @param key Nombre identificador del sonido.
   */
  public play(key: string): void {
    const soundToPlay = this.sounds.find((sound) => {
      return sound.key === key;
    });
    if (soundToPlay.isNative) {
      this.nativeAudio.play(soundToPlay.asset).then((res) => {
        console.log(res);
      }, (err) => {
        console.log(err);
      });
    } else {
      this.audioPlayer.src = soundToPlay.asset;
      this.audioPlayer.play();
    }
  }

  /**
   * Carga en memoria todos los audios necesarios para su rapida utilización.
   */
  public async cargarAudios() {
    // this.preload('audioCogerPokeball', '../../assets/audio/creciendo.mp3');
    // this.preload('audioCrecePokeball', '../../assets/audio/creciendo.mp3');
    this.preload('audioAtrapando', '../../assets/audio/capturando.mp3');
    this.preload('audioSacudidaPokeball', '../../assets/audio/sacudida.mp3');
    this.preload('audioCapturado', '../../assets/audio/capturado.mp3');
    this.preload('audioEscapado', '../../assets/audio/escapandose.mp3');
    // this.preload('audioEncogePokeball', '../../assets/audio/regresa.mp3');
    this.preload('audioRegresa', '../../assets/audio/regresa.mp3');
  }

  /**
   * Detiene el audio indicado que se está reproduciendo.
   * 
   * @param audio El nombre asignado a un sonido.
   */
  public async stopAudio(audio: string) {
    this.nativeAudio.stop(audio);
  }

  /**
   * Elimina o quita un audio cargado en memoria.
   * 
   * @param audio El nombre asignado a un sonido.
   */
  public async quitarAudio(audio: string) {
    this.nativeAudio.unload(audio);
  }

}
