import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { MyDatePickerModule } from 'mydatepicker';
import { SelectModule } from 'ng-select';
import { SharedModule } from '../Shared/shared.module';
import { SignupComponent } from './signup.component';
import { EmployerSignupComponent } from './Employer/employer-signup.component';
import { EmployeeSignupComponent } from './Employee/employee-signup.component';
import { PickRoleComponent } from './PickRole/pick-role.component';

const signupRoutes: Routes = [
  { path: '', component: SignupComponent },
  { path: 'signup', component: SignupComponent},
  { path: 'signup/role', component: PickRoleComponent },
  { path: 'signup/employee', component: EmployeeSignupComponent },
  { path: 'signup/employer', component: EmployerSignupComponent }
];

@NgModule({
  imports: [HttpModule, RouterModule.forChild(signupRoutes), CommonModule, SelectModule,
            MyDatePickerModule, ReactiveFormsModule, SharedModule, FormsModule],
  declarations: [SignupComponent, EmployerSignupComponent, EmployeeSignupComponent,
            PickRoleComponent]
})

export class SignupModule {}
