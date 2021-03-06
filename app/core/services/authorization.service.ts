import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';

import { NotificationService } from './notification.service';

const ACCESS_TOKEN_URL: string = 'https://jobsy-kp-api.herokuapp.com/oauth/token';

const HEADERS = new Headers({
  'Content-Type': 'application/x-www-form-urlencoded',
  'Authorization': 'Basic Zm9vOmZvb3NlY3JldA=='
});

@Injectable()
export class AuthorizationService {
  options: RequestOptions = new RequestOptions({headers: HEADERS});

  constructor(private http: Http, private notificationService: NotificationService) {
  }

  public authorize(username: string, password: string): any {
    let data = {
      grant_type: 'password',
      client_id: 'foo',
      client_secret: 'foosecret',
      username: username,
      password: password
    };
    this.notificationService.startLoading();

    return this.http.post(ACCESS_TOKEN_URL, this.encodeUrl(data), this.options)
      .map(
        (response: Response) => {
          this.notificationService.stopLoading();
          return this.getAuthData(response.json());
        }
      )
      .catch(
        (error: any) => {
          this.notificationService.stopLoading();
          return Observable.throw(error);
        }
      );
  }

  public authorizeWithFacebook(username: string, facebookAccessToken: string): any {
    let data = {
      fbId: username,
      fbToken: facebookAccessToken
    };
    const header = new Headers({
      'Content-Type': 'application/json',
    });
    const options = new RequestOptions({ headers: header });

    this.notificationService.startLoading();

    return this.http.post(ACCESS_TOKEN_URL.replace('oauth/token', 'users/facebook/login'), data, options)
      .map(
        (response: any) => {
          this.notificationService.stopLoading();
          return this.getAuthData(response.json());
        }
      )
      .catch(
        (error: any) => {
          this.notificationService.stopLoading();
          return Observable.throw(error);
        }
      );
  }

  public refreshAccessToken(): any {
    let data = {
      grant_type: 'refresh_token',
      client_id: 'foo',
      client_secret: 'foosecret',
      refresh_token: localStorage.getItem('refreshToken')
    };

    return this.http.post(ACCESS_TOKEN_URL, this.encodeUrl(data), this.options)
      .map(
        (response: Response) => {
          return this.getAuthData(response.json());
        }
      );
  }

  public isAuthorized (): boolean {
    return !!localStorage.getItem('accessToken');
  }

  private getAuthData(authData: Object): any {
    localStorage.setItem('accessToken', authData['access_token']);
    localStorage.setItem('refreshToken', authData['refresh_token']);
    localStorage.setItem('tokenType', authData['token_type']);

    return authData;
  }

  private encodeUrl(data: Object): string {
    let encodedUrl: string = '';

    for (let property in data) {
      encodedUrl += property + '=' + data[property] + '&';
    }
    encodedUrl = encodedUrl.length ? encodedUrl.slice(0, encodedUrl.length - 1) : encodedUrl;

    return encodedUrl;
  }
}
