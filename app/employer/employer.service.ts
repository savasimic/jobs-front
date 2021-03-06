import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

import { Employer } from './Employer';
import { BaseService } from '../core/services/base.service';
import { AuthorizationService } from '../core/services/authorization.service';
import { NotificationService } from '../core/services/notification.service';

@Injectable()

export class EmployerService extends BaseService<Employer> {
  private employer: Employer;

  constructor(private http: Http, authorizationService: AuthorizationService,
    notificationService: NotificationService, router: Router) {
    super('employers', http, authorizationService, notificationService, router);
  }

  public getCurrentEmployer(): Observable<Employer> {
    if (!this.options) { this.initOptions(); }
    if (!this.employer) {
      return this.getCurrentByUsername(localStorage.getItem('username'));
    }
    return Observable.of(this.employer);
  }

  public getCurrentByUsername(username: string): Observable<Employer> {
    let routeUrl = '/search/findByUsername?username=' + username;
    this.initOptions();

    return this.http.get(this.apiUrl + routeUrl, this.options)
      .map(
        (response: Response) => {
          this.employer = this.employer || new Employer();
          Object.assign(this.employer, response.json());
          localStorage.setItem('username', this.employer.username);
          return this.employer;
      })
      .catch(
        (error: any) => {
          return this.errorHandler(error);
        }
      );
  }

  public getByUsername(username: string): Observable<Employer> {
    let routeUrl = '/search/findByUsername?username=' + username;

    return this.http.get(this.apiUrl + routeUrl)
      .map(
        (response: Response) => {
          return response.json();
      })
      .catch(
        (error: any) => {
          return this.errorHandler(error);
        }
      );
  }

  public create(user: Employer): Observable<Employer> {
    let options = new RequestOptions({ headers: new Headers({'Content-Type': 'application/json'}) });

    return this.http.post(this.apiUrl, user, options)
      .map(
        (response: Response) => {
          return response.json();
      })
      .catch(
        (error: any) => {
          return this.errorHandler(error);
        }
      );
  }

  public uploadProfilePicture(picture: any): Observable<boolean> {
    let routeUrl = '/profile/image?username=' + this.employer.username;

    this.notificationService.startLoading();
    return this.http.post(this.apiUrl + routeUrl, picture, this.options)
      .map(
        (response: any) => {
          this.notificationService.stopLoading();
          return response['_body'];
        }
      )
      .catch(
        (error: any) => {
          this.notificationService.stopLoading();
          return this.errorHandler(error);
        }
      );
  }

  public logOut() {
    this.employer = null;
    this.clearStorage();
    this.router.navigate(['/user/login']);
  }

  public setEmployer(employer: Employer) {
    this.employer = employer;
  }
}
