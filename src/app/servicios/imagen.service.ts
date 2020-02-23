import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController } from '@ionic/angular';
import { RepositorioService } from './repositorio.service';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class ImagenService {
  // private imagenAvatar: string;

  constructor(private camera: Camera, public actionSheetController: ActionSheetController, private repo: RepositorioService, private fire: FirebaseService) {
    // this.imagenAvatar = '../../assets/images/avatar/avatar.png';
  }

  public async pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    }
    await this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.redimensionarImage(base64Image, 100, 400, 700).then((dataurl) => {
        let base64Image = 'data:image/jpeg;base64,' + dataurl;
        // this.imagenAvatar = base64Image;
        this.guardarImagenAvatar(base64Image);
      });
    }, (err) => {
      // Handle error
    });
  }

  public async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [
        { text: 'Imagen de la galeria', handler: () => { this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY) } },
        { text: 'Usar Camara', handler: () => { this.pickImage(this.camera.PictureSourceType.CAMERA) } },
        { text: 'Cancelar', role: 'cancel' }
      ]
    });
    await actionSheet.present();
    return actionSheet;
  }

  private redimensionarImage(img: string, quality: number = 100, MAX_WIDTH: number, MAX_HEIGHT: number) {
    return new Promise((resolve, reject) => {
      const canvas: any = document.createElement('canvas');
      const image = new Image();
      image.crossOrigin = 'Anonymous';
      image.src = img;
      image.onload = () => {
        let width = image.width;
        let height = image.height;
        if (!MAX_HEIGHT) {
          MAX_HEIGHT = image.height;
        }
        if (!MAX_WIDTH) {
          MAX_WIDTH = image.width;
        }
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, width, height);
        const dataUrl = canvas
          .toDataURL('image/png', quality)
          .replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
        resolve(dataUrl);
      };
      image.onerror = e => {
        reject(e);
      };
    });
  }

  // public getImagen(): string {
  //   return this.imagenAvatar;
  // }

  // public setImagen(imagen: string): void {
  //   this.imagenAvatar = imagen;
  // }

  private guardarImagenAvatar(avatar: string) {
    this.repo.setAvatar(avatar);
    this.fire.updateUserData(this.repo.getUsuario());
  }

}
