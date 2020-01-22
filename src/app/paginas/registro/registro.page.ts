import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  irHome() {
    this.router.navigateByUrl('Home');
  }

}
