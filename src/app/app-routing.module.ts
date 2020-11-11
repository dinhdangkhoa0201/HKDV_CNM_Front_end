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

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'board-user', component: BoardUserComponent},
  {path: 'login', component: SignInComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'admin', component: AdminComponent},
  {path: 'register-by-email', component: RegisterByEmailComponent},
  {path: 'register-by-phone', component: RegisterByPhoneComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'chat', component: ChatComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
