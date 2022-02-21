import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginGuard } from './login.guard';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ShowplaylistComponent } from './showplaylist/showplaylist.component';
import { SignupComponent } from './signup/signup.component';
import { VerifyComponent } from './verify/verify.component';

const routes: Routes = [
  {
    path : '', redirectTo : 'home', pathMatch : 'full'
  }, 
  {
    path : 'home', component : HomeComponent
  },
  {
    path : 'login', component : LoginComponent, canActivate: [LoginGuard]
  },
  {
    path : 'signup', component : SignupComponent, canActivate: [LoginGuard]
  },
  {
    path : 'profile', component : ProfileComponent, canActivate: [AuthGuard]
  },
  {
    path : 'verify', component : VerifyComponent
  },
  {
    path: 'show-playlist', component: ShowplaylistComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
