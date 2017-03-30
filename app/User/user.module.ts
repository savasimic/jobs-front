import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { ProfileComponent } from './Profile/profile.component';
import { LoginModule } from '../Login/login.module';
import { SignupModule } from '../Signup/signup.module';
import { LoginComponent } from '../Login/login.component';
import { SignupComponent } from '../Signup/signup.component';
import { EditProfileComponent } from './Edit/edit-profile.component';
import { UserService } from './user.service';
import { UserComponent } from './user.component';

export const userRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'profile', component: UserComponent, children:
  [
    { path: '', component: ProfileComponent },
    { path: 'edit', component: EditProfileComponent }
  ]},
];

@NgModule({
  imports: [ RouterModule.forChild(userRoutes), LoginModule, SignupModule,
    CommonModule ],
  declarations: [ EditProfileComponent, ProfileComponent, UserComponent ],
  providers: [ HttpModule, UserService ]
})

export class UserModule {}