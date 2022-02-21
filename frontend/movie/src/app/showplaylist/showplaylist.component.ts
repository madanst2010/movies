import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpService } from '../http.service';
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
  selector: 'app-showplaylist',
  templateUrl: './showplaylist.component.html',
  styleUrls: ['./showplaylist.component.scss']
})
export class ShowplaylistComponent implements OnInit {
  data: any = {};
  routeState: any;
  public:boolean = true
  d:any 
  choose : boolean = false
  addList : boolean = false 
  selfPlayList : any 
  myPlayLists : any
  datas : any | undefined | null
  movie: any
  id:any
  mainStr : string = ""
  constructor( private http: HttpClient, private httpService: HttpService, private router: Router,private route: ActivatedRoute, public _authService: AuthService) {
    this.datas = this.router.getCurrentNavigation()?.extras?.state?.data?.data
    this.d = this.router.getCurrentNavigation()?.extras?.state?.data?.d
    this.id = this.router.getCurrentNavigation()?.extras?.state?.data?.id
    console.log(this.d);
    
    if (this.d == 'm') {
      this.public = false
      this.mainStr = "My"
      
    } else {
      this.public = true
      this.mainStr = "Public"
    }
  }
  movies : any = []
 
  async ngOnInit() {
    for (let i = 0; i < this.datas.length; i++) {
      let queryParams = new HttpParams();
      queryParams = queryParams.append("i",this.datas[i].imdbID);
      queryParams = queryParams.append('apikey', '3392ffe5')
      let apiUrl = `https://www.omdbapi.com/`
      await  this.http.get<any>(apiUrl, {params:queryParams})
      .toPromise()
      .then((data) => {
        this.movies.push(data);
        console.log(this.public);
        
      });
    }
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
  addToPlayList(movie: Movie) {
    this.httpService.verifyToken(localStorage.getItem('access')).subscribe((response)=> {
      console.log("you are authorised", movie);
      this.choose = true
      this.movie = movie
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
  cancelChoose() {
    this.choose = false
  }
  deleteMovie(imdbID:any) {
   this.httpService.delteMovie(this.id,imdbID).subscribe((res)=>{
    console.log(res);
  },
  (error: HttpErrorResponse) => {
    console.log(error.status, "staus");
})
  }
} 
