import {AdminComponent} from './admin/admin.component';
import {HomeComponent} from './home/home.component';

import {BoardUserComponent} from './board-user/board-user.component';
import {ProfileComponent} from './profile/profile.component';
import {SignInComponent} from './signin/signin.component';
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {RegisterByEmailComponent} from './register/register-by-email/register-by-email.component';
import {RegisterByPhoneComponent} from './register/register-by-phone/register-by-phone.component';
import {ContactComponent} from './contact/contact.component';
import {ChatComponent} from './chat/chat.component';
import {AuthGuardService, AuthGuardService as AuthGuard} from './_services/auth-guard.service';
import {RegisterComponent} from './register/register.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {AdminGuardService} from './_services/admin-guard.service';
import {AddPhoneComponent} from './update/add-phone/add-phone.component';
import {AddEmailComponent} from './update/add-email/add-email.component';
import {UpdatePhoneComponent} from './update/update-phone/update-phone.component';
import {A} from '@angular/cdk/keycodes';
import {UpdateEmailComponent} from './update/update-email/update-email.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'home', component: HomeComponent, canActivate: [AuthGuardService]
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
    path: 'admin', component: AdminComponent, canActivate: [AuthGuardService, AdminGuardService]
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
  },
  {
    path: 'forgot-password', component: ForgotPasswordComponent
  },
  {
    path: 'add-phone', component: AddPhoneComponent, canActivate: [AuthGuardService]
  },
  {
    path: 'add-email', component: AddEmailComponent, canActivate: [AuthGuardService]
  },
  {
    path: 'update-phone', component: UpdatePhoneComponent, canActivate: [AuthGuardService]
  },
  {
    path: 'update-email', component: UpdateEmailComponent, canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {

}
