import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private router: Router) {}

  IrIniciar() {
    this.router.navigateByUrl('inises');
  }

  IrRegistrar() {
    this.router.navigateByUrl('registro');
  }

  irHome() {
    this.router.navigateByUrl('home');
  }

}
