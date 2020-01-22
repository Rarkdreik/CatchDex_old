import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalPage } from './principal.page';

const routes: Routes = [
  { path: 'main', component: PrincipalPage, children: [
  { path: 'avatar', children: [{path: '', loadChildren: () => import('../avatar/avatar.module').then(m => m.AvatarPageModule)}]},
  { path: 'centropokemon', children: [{path: '', loadChildren: () => import('../centropokemon/centropokemon.module').then(m => m.CentropokemonPageModule) }]},
  { path: 'equipo', children: [{path: '', loadChildren: () => import('../equipo/equipo.module').then(m => m.EquipoPageModule) }]},
  { path: '', redirectTo: '', pathMatch: 'full' }]},
  { path: '', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PrincipalPageRoutingModule {}
