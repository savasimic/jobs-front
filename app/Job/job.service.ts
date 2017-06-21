import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Job } from './Job';
import { BaseService } from '../Core/Services/base.service';
import { AuthorizationService } from '../Core/Services/authorization.service';
import { NotificationService } from '../Core/Services/notification.service';

@Injectable()
export class JobService extends BaseService<Job> {

  constructor (private http: Http, authorizationService: AuthorizationService,
    notificationService: NotificationService, router: Router) {
    super('jobs', http, authorizationService, notificationService, router);
  }

  create(entity: Job): Observable<Job> {
    return this.httpService.post(this.apiUrl, entity, this.options)
      .map(
        function success (response: Response) {
          return response.json();
        })
      .catch(
        function fail (error: Error) {
          return this.errorHandler(error);
        }.bind(this)
      );
  }

  getByUsername(username: string) {
    let routeUrl = '/search/findByUsername?username=' + username;
    if (!this.options) { this.initOptions(); }

    return this.http.get(this.apiUrl + routeUrl, this.options)
      .map(
        function success (response: Response) {
          let list = response.json().content;

          if (list && list[0] && list[0].collectionValue) // backend can't fix response
            list = [];

          return list;
        })
      .catch(
        function fail (error: any) {
          return this.errorHandler(error);
        }.bind(this)
      );
  }
}
