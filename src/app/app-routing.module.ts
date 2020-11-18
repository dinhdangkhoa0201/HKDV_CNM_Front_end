import {AdminComponent} from './admin/admin.component';
import {HomeComponent} from './home/home.component';

import {BoardUserComponent} from './board-user/board-user.component';
import {ProfileComponent} from './profile/profile.component';
import {RegisterComponent} from './register/register.component';
import {SignInComponent} from './signin/signin.component';
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {RegisterByEmailComponent} from './register/register-by-email/register-by-email.component';
import {RegisterByPhoneComponent} from './register/register-by-phone/register-by-phone.component';
import {ContactComponent} from './contact/contact.component';
import {ChatComponent} from './chat/chat.component';
import {AuthGuardService, AuthGuardService as AuthGuard} from './_services/auth-guard.service';

const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'home', component: HomeComponent
  },
  {
    path: 'board-user', component: BoardUserComponent, canActivate: [AuthGuardService]
  },
  {
    path: 'login', component: SignInComponent
  },
  {
    path: 'register', component: RegisterComponent
  },
  {
    path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService]
  },
  {
    path: 'admin', component: AdminComponent, canActivate: [AuthGuardService]
  },
  {
    path: 'register-by-email', component: RegisterByEmailComponent
  },
  {
    path: 'register-by-phone', component: RegisterByPhoneComponent
  },
  {
    path: 'contact', component: ContactComponent, canActivate: [AuthGuardService]
  },
  {
    path: 'chat', component: ChatComponent, canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {

}
