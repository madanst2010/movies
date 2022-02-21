import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  loggedIn() {
    return !!localStorage.getItem('access')
  }
  getToken() {
    return localStorage.getItem('access')
  }
  refreshPage() {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    window.location.reload();
  }
}
