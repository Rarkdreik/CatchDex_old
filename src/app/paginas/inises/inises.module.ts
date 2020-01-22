import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InisesPageRoutingModule } from './inises-routing.module';

import { InisesPage } from './inises.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    InisesPageRoutingModule
  ],
  declarations: [InisesPage]
})
export class InisesPageModule {}
