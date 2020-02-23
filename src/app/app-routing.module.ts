import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './servicios/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './paginas/home/home.module#HomePageModule', canActivate: [AuthGuard] },
  { path: 'inises', loadChildren: './paginas/inises/inises.module#InisesPageModule', canActivate: [AuthGuard] },
  { path: 'iniregion', loadChildren: './paginas/iniregion/iniregion.module#IniregionPageModule', canActivate: [AuthGuard] },
  { path: 'registro', loadChildren: './paginas/registro/registro.module#RegistroPageModule', canActivate: [AuthGuard] },
  { path: 'captura/:id', loadChildren: './paginas/captura/captura.module#CapturaPageModule', canActivate: [AuthGuard] },
  { path: 'modal2/:id', loadChildren: './paginas/DescripModal/modal.module#ModalPageModule', canActivate: [AuthGuard] },
  { path: '', loadChildren: () => import('./paginas/principal/principal.module').then(m => m.PrincipalPageModule), canActivate: [AuthGuard] },
  { path: '', loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule), canActivate: [AuthGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
