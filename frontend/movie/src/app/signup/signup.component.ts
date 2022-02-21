import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router, RouterModule, Routes } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpService } from '../http.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  httpOptions = {
    headers: new HttpHeaders().set('Content-Type', 'application/json').set('observe', 'response')
  };
  otpSent : boolean = false
  usernameError : boolean = false
  emailError : boolean = false
  passwordError : boolean = false
  otpError : boolean = false
  email : string = ""
  disableForm : boolean = false
  emailFormatError : boolean = false 
  validateEmail = (email:any) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  formData : any = {}
  constructor(private router: Router, private httpService: HttpService) { }
  checkUser(data: any) {
    this.httpService.checkUserNameExits(data).subscribe((response)=>{
      console.log(response);
      this.usernameError = false
      data.form.controls['username'].setErrors({'incorrect': false});
    },
    (error: HttpErrorResponse) => {
      this.usernameError = true
      console.log(error.status);
      data.form.controls['username'].setErrors({'incorrect': true});
    })
  }
  checkEmail(data: any) {
    let email = data.email
    if (this.validateEmail(email)) {
      this.emailFormatError = false
    } else {
      this.emailFormatError = true
      this.emailError = false
      return 
    }
    this.httpService.checkEmailExits(data).subscribe((response)=>{
      this.emailError = false
      data.form.controls['email'].setErrors({'incorrect': false});
    },
    (error: HttpErrorResponse) => {
      this.emailError = true
      data.form.controls['email'].setErrors({'incorrect': true});
    })
  }
  onSubmit(data: any) { 
    if (data.password != data.cpassword) {
      this.passwordError = true
      return
    } else {
      this.passwordError = false
    }
    if (!this.emailError && !this.passwordError && !this.usernameError && !this.emailFormatError) {
      this.httpService.getOtp(data).subscribe((response)=> {
        this.otpSent = true
        this.email = data.email
        this.formData = {
          email : data.email,
          password : data.password,
          username : data.username 
        }
        this.disableForm = true
      },
      (error: HttpErrorResponse) => {
        console.log(error.status);
        this.otpSent = false
      })
    }
   }

   submitOtp(data : any) {
      this.formData.otp = data.otp
      this.httpService.postOtp(this.formData).subscribe((response)=> {
      this.otpSent = true
      this.otpError = false
      let dataForToken : any = {
        username : this.formData.username,
        password : this.formData.password
      }
      this.httpService.getToken(dataForToken).subscribe((response)=> {
        localStorage.setItem('refresh', response.refresh)
        localStorage.setItem('access', response.access)
        this.router.navigate(['/home']);
      },
      (error: HttpErrorResponse) => {
        this.httpService.removeToken()
      })
    },
    (error: HttpErrorResponse) => {
      console.log(error.status);
      this.otpError = true
      this.otpSent = false
    })
   }
  ngOnInit(): void {
  }

}
