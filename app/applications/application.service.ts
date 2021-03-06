import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { BaseService } from '../core/services/base.service';
import { Application } from './Application';
import { AuthorizationService } from '../core/services/authorization.service';
import { NotificationService } from '../core/services/notification.service';

@Injectable()

export class ApplicationService extends BaseService<Application> {
  constructor (private http: Http, authorizationService: AuthorizationService,
    notificationService: NotificationService, router: Router) {
    super('applications', http, authorizationService, notificationService, router);
  }

  getByJobId(jobId: string): Observable<Application> {
    let routeUrl: string = '/search/findByJobId?jobid=' + jobId;
    if (!this.options) { this.initOptions(); }

    return this.httpService.get(this.apiUrl + routeUrl).map(
      (response: Response) => {
        let content = response.json().content[0].workerId ? response.json().content : [];
        return content;
      }
    )
    .catch(
      (error: any) => {
        return this.errorHandler(error, false);
      }
    );
  }

  getByWorkerId(workerId: string): Observable<Application> {
    let routeUrl: string = '/search/findByWorkerId?workerid=' + workerId;
    if (!this.options) { this.initOptions(); }

    return this.httpService.get(this.apiUrl + routeUrl).map(
      (response: Response) => {
        let content = response.json().content[0].workerId ? response.json().content : [];
        return content;
      }
    )
    .catch(
      (error: any) => {
        return this.errorHandler(error, false);
      }
    );
  }
}
