import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Response } from '@angular/http';
import { Router } from '@angular/router';

import { GlobalValidators } from '../../global-validators';
import { WorkerService } from '../../Worker/worker.service';
import { User } from '../../User/User';
import { Worker } from '../../Worker/Worker';
import { GENDER_LIST, CITIES, PROFESSIONS } from '../../global-consts';
import { Option } from '../../global-types';
import { Helper } from '../../helper';
import { AuthorizationService } from '../../Core/Services/authorization.service';

@Component({
  moduleId: module.id,
  selector: 'app-worker-signup',
  templateUrl: 'worker-signup.component.html',
  styleUrls: ['worker-signup.component.css']
})

export class WorkerSignupComponent implements OnInit {
  cities: Option[] = CITIES;
  genders: Option[] = GENDER_LIST;
  professions: Option[] = PROFESSIONS;
  workerForm: FormGroup;
  worker: Worker;
  calendarSettings: Object = {};

  constructor (private formBuilder: FormBuilder, private workerService: WorkerService,
          private authorizationService: AuthorizationService, private router: Router) {
  }

  ngOnInit() {
    this.calendarSettings = {
      maxDate: Helper.datePickerFormat(Helper.subtractYear(18)),
      minDate: Helper.datePickerFormat(Helper.subtractYear(70))
    };

    this.workerForm = this.formBuilder.group({
      firstName: '',
      lastName: '',
      gender: undefined,
      birthday: '',
      phone: '',
      email: ['', [GlobalValidators.emailValidator]],
      username: '',
      passwordGroup: this.formBuilder.group({
        password: '',
        confirmPassword: ''
      }, {validator: GlobalValidators.passwordMatcher('password', 'confirmPassword')}),
      profession: '',
      region: [],
      description: ''
    });
    this.worker = new Worker();
  }

  workerSignup(): void {
    if (!Helper.submitForm(this.workerForm, this.worker))
      return;

    this.workerService.create(this.worker).subscribe(
      (response) => {
        let username = this.workerForm.get('username').value,
            password = this.workerForm.get('passwordGroup').get('password').value;

        this.worker = Object.assign(new Worker(), response);
        this.authorizeAndLogin(username, password);
      }
    );
  }

  authorizeAndLogin(username: string, password: string): void {
    this.authorizationService.authorize(username, password).subscribe(
      (result: any) => {
        this.workerService.getByUsername(username).subscribe(
          (result: any) => { this.router.navigate(['worker/profile']); },
          (error: any) => { console.log(error); }
        );
      },
    );
  }
}
