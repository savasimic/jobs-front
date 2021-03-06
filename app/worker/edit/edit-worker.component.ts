import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ToastService } from '../../core/services/toast.service';
import { GlobalValidators } from '../../global-validators';
import { Worker } from '../Worker';
import { PROFESSIONS, CITIES, GENDER_LIST } from '../../global-consts';
import { Option } from '../../global-types';
import { WorkerService } from '../worker.service';
import { Helper } from '../../helper';
import { PictureCropperModal } from '../../shared/picture-cropper/picture-cropper.modal';

@Component({
  moduleId: module.id,
  selector: 'app-edit-worker',
  templateUrl: 'edit-worker.component.html',
  styles: ['.upload-button { width: 200px !important; }']
})

export class EditWorkerComponent implements OnInit {
  worker: Worker;
  genders: Option[] = GENDER_LIST;
  regions: Option[] = CITIES;
  professions: Option[] = PROFESSIONS;
  editForm: FormGroup;
  calendarSettings: Object = {};
  ignoreEmail: string;

  constructor(private workerService: WorkerService, private formBuilder: FormBuilder,
    private router: Router, private toastService: ToastService, private modalService: NgbModal) {
  }

  ngOnInit () {
    this.calendarSettings = {
      maxDate: Helper.datePickerFormat(Helper.subtractYear(18)),
      minDate: Helper.datePickerFormat(Helper.subtractYear(70))
    };
    this.worker = new Worker();
    this.editForm = this.formBuilder.group({
      firstName: this.worker.firstName,
      lastName: this.worker.lastName,
      birthday: this.worker.birthday,
      gender: this.worker.gender,
      phone: this.worker.phone,
      email: [this.worker.email, [GlobalValidators.emailValidator]],
      profession: this.worker.profession,
      region: this.worker.region,
      description: this.worker.description
    });

    this.workerService.getCurrentWorker().subscribe(
      (response) => {
        this.worker = response;
        this.ignoreEmail = this.worker.email;
        Helper.updateForm(this.editForm, this.worker);
      },
      (error) => { console.log(error); }
    );
  }

  save() {
    let worker = Object.assign(new Worker(), this.worker);

    if (Helper.submitForm(this.editForm, worker)) {
      this.workerService.update(worker).subscribe(
        (response) => {
          Object.assign(this.worker, response);
          this.worker.region = response.region.toString().split(',');
          this.router.navigate(['/worker/profile']);
          this.toastService.success('You successfully updated your profile!');
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  openCropModal() {
    let modalSettings = {
      headerText: 'Upload Profile Picture',
      submitText: 'Upload',
      cancelText: 'Cancel'
    };
    let modal = this.modalService.open(PictureCropperModal, {size: 'lg'});

    modal.componentInstance.init(modalSettings);
    modal.result.then(
      (result) => {
        if (result) {
          this.workerService.uploadProfilePicture(result).subscribe(
            (response: any) => { this.worker.imageURL = response; },
            (error) => { console.log(error); }
          );
        }
      },
      (reason) => { }
    );
  }
}
