import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PrincipalPageRoutingModule } from './principal.router.module';
import { PrincipalPage } from './principal.page';
import { DirectivesModule } from '../../directivas/directives.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PrincipalPageRoutingModule,
    DirectivesModule
  ],
  declarations: [PrincipalPage]
})

export class PrincipalPageModule {}
