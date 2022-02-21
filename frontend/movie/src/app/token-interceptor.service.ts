import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import * as URI from "uri-js";
import { HttpService } from './http.service';
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private injector: Injector, private httpService : HttpService, private router: Router) { }
  doNotAddInter = ['/otp', '/check-user', '/check-email','/login', '/']
  addInterCeptror(url:any) : boolean {
    console.log(url);
    
    for (let item of this.doNotAddInter){
      if (url == '/public-playlist' && localStorage.getItem('access')==null){
        return false
      }
      if (url == item) {
        console.log(url);
        return false
      }
    }
    return true
  }
  
  intercept(req : HttpRequest<any>, next: HttpHandler) {
    let url = req.url
    let a = URI.parse(url)
      if (this.addInterCeptror(a.path)) {
        let authService = this.injector.get(AuthService)
        let tokenizedReq = req.clone({
          setHeaders: {
            Authorization : `Bearer ${authService.getToken()}`
          }
        })
        return next.handle(tokenizedReq)
      } else {
        return next.handle(req)
      }
  }
}
