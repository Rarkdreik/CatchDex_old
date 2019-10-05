import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'sesion', pathMatch: 'full' },
  { path: 'captura-prueba', loadChildren: './paginas/captura-prueba/captura-prueba.module#CapturaPruebaPageModule' },
  { path: 'captura-prueba/:id', loadChildren: './paginas/captura-prueba/captura-prueba.module#CapturaPruebaPageModule' },
  { path: 'modal', loadChildren: './paginas/modal/modal.module#ModalPageModule' },
  { path: 'modal2', loadChildren: './paginas/DescripModal/modal.module#ModalPageModule' },
  { path: 'modal2/:id', loadChildren: './paginas/DescripModal/modal.module#ModalPageModule' },
  { path: '', loadChildren: () => import('./paginas/principal/principal.module').then(m => m.PrincipalPageModule) },
  { path: '', loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule) },

  { path: 'sesion', loadChildren: './paginas/sesion/sesion.module#SesionPageModule' },
  // { path: 'iniregion', loadChildren: './paginas/iniregion/iniregion.module#IniregionPageModule' },
  // { path: 'inipokemon', loadChildren: './paginas/inipokemon/inipokemon.module#InipokemonPageModule' },
  // { path: 'centropokemon', loadChildren: './paginas/centropokemon/centropokemon.module#CentropokemonPageModule' },
  // { path: 'equipo', loadChildren: './paginas/equipo/equipo.module#EquipoPageModule' },
  // { path: 'principal', loadChildren: './paginas/principal/principal.module#PrincipalPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
