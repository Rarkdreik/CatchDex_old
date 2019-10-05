import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  ngOnInit() {
  }

// private Nota: NotaInterface = {
  //   titulo: '',
  //   descripcion: ''
  // };

  private id: string;
  public formModal: FormGroup;

  // Lo usamos para mostrar un cargando mientras se realiza la operación.
  myloading: any;

  constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      public loadingController: LoadingController,
      private modalCtrl: ModalController,
      public navparams: NavParams) {
        // Obtenemos parametros pasados por navegación entre componentes
        this.navparams.get('id');

        // Creamos la relación entre el formulario de tab2.html y formModal; además
        // asociamos los validares y valores iniciales
        this.formModal = this.formBuilder.group({
          
          // titulo: [this.navparams.get('titulo'), Validators.required],
          titulo: [this.navparams.get('titulo')],
          descripcion: [this.navparams.get('descripcion')],
        }
      )
    ;
  }

  /**
   * Se ejecuta al submit el formulario. Crea un objeto proveniente del formulario
   * (sería igual que this.formModal.value) y llama a la función agregaNota del servicio.
   * Gestiona la Promise para sincronizar la interfaz.
   */
  actualizarForm() {
    // this.Nota.titulo = this.formModal.get('titulo').value;
    // this.Nota.descripcion = this.formModal.get('descripcion').value;

    // Mostramos el cargando...
    this.myloading = this.presentLoading();
    // this.setNota();
    // this.todoS.actualizaNota(this.id, this.Nota)
    //   .then(docRef => {
    //     // Cerramos el cargando...
    //     this.loadingController.dismiss();
    //     // Cerramos el modal
    //     this.modalCtrl.dismiss();
    //   })
    //   .catch((error) => {
    //     console.error('Error insertando documento: ', error);
    //     // Cerramos el cargando...
    //     this.loadingController.dismiss();
    //     // Mostramos un mensaje de error
    //     // A desarrollar, se aconseja emplear un componente denominado toast
    //   });
  }

  /**
   * Es un componente de la interfaz IONIC v4
   */
  async presentLoading() {
    this.myloading = await this.loadingController.create({
      message: 'Guardando'
    });
    return await this.myloading.present();
  }

}

