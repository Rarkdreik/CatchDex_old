import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InisesPage } from './inises.page';

const routes: Routes = [
  {
    path: '',
    component: InisesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InisesPageRoutingModule {}
