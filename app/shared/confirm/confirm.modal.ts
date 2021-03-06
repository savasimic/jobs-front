import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  moduleId: module.id,
  selector: 'app-confirm-modal',
  templateUrl: 'confirm.modal.html'
})

export class ConfirmModal {
  headerText: string;
  bodyText: string;
  submitText: string;
  cancelText: string;

  constructor(public activeModal: NgbActiveModal) {
  }

  init (headerText: string = '', bodyText: string = '', submitText: string = 'Ok', cancelText: string = 'Cancel') {
    this.headerText = headerText;
    this.bodyText = bodyText;
    this.submitText = submitText;
    this.cancelText = cancelText;
  }

  submit(): void {
    this.activeModal.close('submit');
  }

  close(): void {
    this.activeModal.dismiss('close');
  }
}
