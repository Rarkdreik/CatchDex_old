import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router, private authService: AuthService) { }

  public async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    await this.authService.cargarSession();
    if (this.auth.isAuthenticated()) {
      if (state.url == '/inises' || state.url == '/registro') { this.router.navigateByUrl('/iniregion'); return false; 
      } else { return true; }
    } else if (!(state.url == '/home' || state.url == '/inises' || state.url == '/registro')) {
      this.router.navigateByUrl('/home');
      return false;
    } else {
      return true;
    }
    
  }

}
