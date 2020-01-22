import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'sesion', pathMatch: 'full' },
  { path: 'sesion', loadChildren: './paginas/sesion/sesion.module#SesionPageModule' },
  { path: 'inises', loadChildren: './paginas/inises/inises.module#InisesPageModule' },
  { path: 'captura-prueba/:id', loadChildren: './paginas/captura-prueba/captura-prueba.module#CapturaPruebaPageModule' },
  { path: 'modal2/:id', loadChildren: './paginas/DescripModal/modal.module#ModalPageModule' },
  // { path: 'captura-prueba', loadChildren: './paginas/captura-prueba/captura-prueba.module#CapturaPruebaPageModule' },
  // { path: 'modal', loadChildren: './paginas/modal/modal.module#ModalPageModule' },
  // { path: 'modal2', loadChildren: './paginas/DescripModal/modal.module#ModalPageModule' },
  { path: '', loadChildren: () => import('./paginas/principal/principal.module').then(m => m.PrincipalPageModule) },
  { path: '', loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule) },
  { path: 'home', loadChildren: './paginas/home/home.module#HomePageModule' },
  { path: '**', loadChildren: './paginas/sesion/sesion.module#SesionPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
