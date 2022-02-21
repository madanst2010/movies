import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject, AfterViewChecked } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpService } from '../http.service';
import { SelectPlaylistComponent } from '../select-playlist/select-playlist.component';
import { MatSnackBar } from "@angular/material/snack-bar";
export interface DialogData {
  animal: string;
  title: string;
  Poster: string,
  playlist: any
}
export interface Movie{
  Title : string,
  Year: string,
  Runtime: string,
  Plot : string,
  Poster : string,
  Genre : string,
  Actors : string,
  Director : string,
  Language: string,
  imdbRating : string,
  imdbID: string
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewChecked {
  user:any;
  constructor(private _snackBar: MatSnackBar,public dialog: MatDialog,private router: Router, public _authService : AuthService,private httpService : HttpService) { }
  modalIsOpen: boolean = false;


  showModalDialog(){
    this.modalIsOpen = true;
  }
  ngAfterViewChecked(){
     const buttonModal = document.getElementById("openModalButton")
     console.log('buttonModal', buttonModal)
  }
  animal: string ="";
  title: string ="";
  movie : Movie | undefined 
  choose : boolean = false
  addList : boolean = false 
  publicPlayList : any 
  selfPlayList : any 
  myPlayLists : any
  openDialog(): void {
    const dialogRef = this.dialog.open(PopComponent, {
      width: '250px',
      data: {title: this.title, playlist: this.selfPlayList}

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
    console.log(this.selfPlayList, "hjhjhjhj");
    
  }

  logIn() {
    this.router.navigate(['/login'])
  }
  signUp() {
    this.router.navigate(['/signup'])
  }
  logOut() {
    this.httpService.removeToken()
    this.router.navigate(['/home'])
  }
  
  ngOnInit(): void {
    
    if (localStorage.getItem('access')) {
      this.httpService.verifyToken(localStorage.getItem('access')).subscribe((response)=> {
        this.httpService.getSelfPlayList().subscribe((response: any[])=>{
          this.selfPlayList = response
          console.log(response, "self");
         
        },
        (error: HttpErrorResponse) => {
          console.log(error.status);
        })
      },
      (error: HttpErrorResponse) => {
        console.log(error.status, "staus");
        this.httpService.removeToken()
      })
    } 
    this.httpService.getPublicPlayList().subscribe((response: any[])=>{
      this.publicPlayList = response
      console.log(response);
      
    },
    (error: HttpErrorResponse) => {
      console.log(error.status);
    })
    
  }
  showPlayList(id:any, data: any, d:any) {
    console.log(id);
    console.log("dafa",data);
   let  obj = {
     data: data,
     d:d,
     id:id
   }
   
    this.router.navigate(['/show-playlist'], {state : {data:obj}})
  }
  cancel() {
    this.addList = false
  }
  createList() {
    this.httpService.verifyToken(localStorage.getItem('access')).subscribe((response)=> {
      console.log("you are authorised");
      this.addList = true
    },
    (error: HttpErrorResponse) => {
      this.addList = true
      console.log(error.status, "staus");
      this.httpService.removeToken()
      this.router.navigate(['/login'])
    })
  }
  deleteList(id: any) {
    this.httpService.deletePlayList(id).subscribe((response)=>{
      console.log(response);
      this.ngOnInit()
    },
    (error: HttpErrorResponse) => {
      console.log(error.status, "staus");
    })
  }
  addListfun(data: any) {
    if (data.public == '') {
      data.public = true
    } else {
      data.public = !data.public
    }
    this.httpService.createPlayList(data).subscribe((response)=>{
      console.log(response);
      this.addList = false
      this.ngOnInit()
    },
    (error: HttpErrorResponse) => {
      console.log(error.status, "staus");
    })
    
  }
  onSubmit(value:any) {
    // this.title = value.title 
    // const dialogRef = this.dialog.open(PopComponent, {
    //   width: '250px',
    //   data: {title: this.title}
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   this.animal = result;
    // });   
    this.httpService.getMovie(value).subscribe((respone)=>{
      console.log(respone.Response);
      
      if (respone.Response=='True') {
        console.log("Movie Found", respone);
        this.movie = respone
      } else {
        console.log("No movie found");
        this.movie = undefined
      }
      
    },
    (error: HttpErrorResponse) => {
      console.log(error.status, "ddddd");
      this.movie = undefined
    })
  }
  cancelChoose() {
    this.choose = false
  }
  addToPlayList(movie: Movie) {
    this.httpService.verifyToken(localStorage.getItem('access')).subscribe((response)=> {
      console.log("you are authorised", movie);
      this.choose = true
      this.httpService.getSelfPlayList().subscribe((res)=>{
        console.log(res);
        this.myPlayLists = res
      },
      (error: HttpErrorResponse) => {
        console.log(error.status, "staus");
        this.choose = false
    })
    },
    (error: HttpErrorResponse) => {
      console.log(error.status, "staus");
      this.httpService.removeToken()
      this.router.navigate(['/login'])
    })
  }
  selectPlayList(id: any) {
    console.log(id, this.movie);
    let param = id;
    let data = {
      imdbID : this.movie?.imdbID
    }
    console.log(this.movie);
    
    this.httpService.addMovie(param, data).subscribe((res)=>{
      console.log("movie added successfully");
    },
    (error: HttpErrorResponse) => {
      console.log(error.status, "staus");
    })
  }
  removeMovie(id:any, imdbID:any) {
    this.httpService.delteMovie(id,imdbID).subscribe((res)=>{
      console.log("movie deleted successfully");
    },
    (error: HttpErrorResponse) => {
      console.log(error.status, "staus");
    })
  }
}


// pop-up component 
@Component({
  selector: 'app-pop',
  templateUrl: './pop.component.html'
})
export class PopComponent implements OnInit {

  constructor(
    private httpService : HttpService,
    public dialogRef: MatDialogRef<PopComponent>,
    @Inject(MAT_DIALOG_DATA) public data1: DialogData) {}
    onNoClick(): void {
      console.log(this.data1);
      
      this.dialogRef.close();
    }
    addItem() {
      console.log("okkk");
      
    }
    ngOnInit(): void {
        console.log(this.data1);
        this.httpService.getMovie(this.data1).subscribe((respone)=>{
          console.log(respone, "movie");
          this.data1.Poster = respone.Poster
        },
        (error: HttpErrorResponse) => {
          console.log(error.status, "ddddd");
        })
    }
}