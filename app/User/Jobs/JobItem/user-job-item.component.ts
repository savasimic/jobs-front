import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ToastService } from '../../../toast.service';
import { ConfirmModalComponent } from '../../../Shared/ConfirmModal/confirm-modal.component';
import { Helper } from '../../../helper';
import { JobService } from '../../../Job/job.service';
import { EditJobComponent } from '../Edit/edit-job.component';
import { Job } from '../../../Job/Job';

@Component({
  moduleId: module.id,
  selector: 'app-user-job',
  templateUrl: 'user-job-item.component.html',
  styleUrls: ['user-job-item.component.css']
})

export class UserJobItemComponent {
  @Input() job: Job;
  @Output() onDelete: EventEmitter<string> = new EventEmitter<string>();
  @Output() onEdit: EventEmitter<Job> = new EventEmitter<Job>();

  constructor(private jobService: JobService, private toastService: ToastService, private modalService: NgbModal) {
  }

  openDeleteJobModal(): void {
    let modal = this.modalService.open(ConfirmModalComponent);

    modal.componentInstance.init('Delete Job', 'Are you sure you want to delete this job?', 'Delete');
    modal.result.then(
      (result) => { this.deleteJob(); },
      (reason) => { }
    );
  }

  deleteJob(): void {
    this.jobService.delete(this.job.id).subscribe(
      (response: any) => {
        this.toastService.success('Job is deleted!');
        this.onDelete.emit(this.job.id);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  openEditJobModal(): void {
    let modal = this.modalService.open(EditJobComponent, {size: 'lg'});

    modal.componentInstance.init(this.job);
    modal.result.then(
      (result) => { this.toastService.success('You updated your job!'); },
      (reason) => { }
    );
  }
}
