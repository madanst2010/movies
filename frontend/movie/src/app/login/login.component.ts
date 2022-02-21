import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpService } from '../http.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private router: Router, private _authService: AuthService, private httpService: HttpService) { }
  onSubmit(data: any) { 
    this.httpService.login(data).subscribe((response)=> {
      console.log(response, "response")
      this.httpService.getToken(data).subscribe((response)=> {
        console.log(response, "response")
        localStorage.setItem('refresh', response.refresh)
        localStorage.setItem('access', response.access)
        this.router.navigate(['/home']);
      },
      (error: HttpErrorResponse) => {
        this.httpService.removeToken()
      })
      
    },
    (error: HttpErrorResponse) => {
      this.httpService.removeToken()
    })
    
   }

  ngOnInit(): void {
  }

}
