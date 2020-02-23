import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AvatarPage } from './avatar.page';
import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    NgxQRCodeModule,
    RouterModule.forChild([ { path: '', component: AvatarPage } ])
  ],
  declarations: [AvatarPage]
})

export class AvatarPageModule {}
