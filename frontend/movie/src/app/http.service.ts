import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  httpOptions = {
    headers: new HttpHeaders().set('Content-Type', 'application/json').set('observe', 'response')
  };
  url : string ="https://mgsuthar2010.pythonanywhere.com"
  constructor(private http: HttpClient) { }
  getPublicPlayList() : Observable<any> {
    let apiUrl = this.url + "/public-playlist";
    return this.http.get<any>(apiUrl)
  }
  getSelfPlayList() : Observable<any> {
    let apiUrl = this.url + "/self-playlist";
    return this.http.get<any>(apiUrl)
  }
  verifyToken(data:any) :  Observable<any> {
    let obj = {
      token: data
    }
    let apiUrl = this.url + "/verify/";
    return this.http.post<any>(apiUrl, obj, this.httpOptions)
  }
  isAuthenicatedUser() : any{
    let apiUrl = this.url + "/verify/";
    let obj = {
      token: localStorage.getItem('access')
    }
    return this.http.post(apiUrl, obj, this.httpOptions).subscribe(res=>{
      console.log(res, "resss");
      
    })
  }
  removeToken(){
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
  }
  login(data:any) :  Observable<any> {
    let apiUrl = this.url + "/login";
    return this.http.post<any>(apiUrl, data, this.httpOptions)
  }
  getToken(data: any) : Observable<any> {
    let apiUrl = this.url + "/gettoken/";
    return this.http.post<any>(apiUrl, data, this.httpOptions)
  }
  checkUserNameExits(data: any) {
    let apiUrl = this.url + "/check-user";
    let newData : any = {
      username : data.username
    }
    return this.http.post<any>(apiUrl, newData, this.httpOptions)
  }
  checkEmailExits(data: any) {
    let apiUrl = this.url + "/check-email";
    let newData : any = {
      email : data.email
    }
    return this.http.post<any>(apiUrl, newData, this.httpOptions)
  }
  getOtp(data:any) :  Observable<any> {
    let apiUrl = this.url + "/otp";
    let newData :any = {
      email : data.email,
      get: true
    }
    return this.http.post<any>(apiUrl, newData, this.httpOptions)
  }
  postOtp(data:any) :  Observable<any> {
    let apiUrl = this.url + "/otp";
    let newData :any = {
      otp : data.otp,
      email : data.email,
      password : data.password,
      username : data.username
    }
    console.log(newData);
    
    return this.http.post<any>(apiUrl, newData, this.httpOptions)
  }
  
  getMovie(data:any){
    let queryParams = new HttpParams();
    queryParams = queryParams.append("t",data.title);
    queryParams = queryParams.append('apikey', '3392ffe5')
    let apiUrl = `https://www.omdbapi.com/`
    return this.http.get<any>(apiUrl, {params:queryParams})
  }
  getMovieById(id:any) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("i",id);
    queryParams = queryParams.append('apikey', '3392ffe5')
    let apiUrl = `https://www.omdbapi.com/`
    return this.http.get<any>(apiUrl, {params:queryParams})
  }
  addMovie(param : any, data:any) {
    let apiUrl = this.url + `/movie?id=${param}`
    return this.http.post<any>(apiUrl,data,this.httpOptions)
  }
  createPlayList(data: any) {
    let apiUrl = this.url + `/play-list`
    return this.http.post<any>(apiUrl,data,this.httpOptions)
  }
  deletePlayList(id:any) {
    let apiUrl = this.url + `/play-list?id=${id}`
    return this.http.delete<any>(apiUrl)
  }
  delteMovie(id:any, imdbID: any) {
    let apiUrl = this.url + `/movie?id=${id}&imdbID=${imdbID}`
    return this.http.delete<any>(apiUrl)
  }
}
