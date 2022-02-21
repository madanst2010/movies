import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private _authService : AuthService, private _router : Router, private httpSerivce: HttpService) {}
  canActivate() : boolean {
    console.log("jk",this._authService.loggedIn());
    console.log("mhj",this.httpSerivce.isAuthenicatedUser());
    
      if (this._authService.loggedIn() && this.httpSerivce.isAuthenicatedUser()) {
        this._router.navigate(['/home'])
        return false
      } else {
        return true
      }
  }
  
}
