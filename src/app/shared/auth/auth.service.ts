import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { of as observableOf,  Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { User } from '../../shared/users/user.model';
@Injectable()
export class AuthService {
  private token: string;
  private user: object;
  private refreshToken: string;
  private isAdmin: boolean;

  constructor(private http: HttpClient,
              public router: Router
  ) {
    this.loadFromStorage();
  }

  login(email: string, password: string): Promise<any> {
    const loginUrl = environment.apiUrl + '/login_check';

    return this.http.post(
      loginUrl, {
        username: email,
        password
      }).pipe(
        map((resp: any) => {
          this.saveToStorage(resp);

          return true;
        }))
      .toPromise();
  }

  loginByGoogle(token: string, role) {
    const url = environment.apiUrl + '/login/google';

    return this.http.post(url, {id_token: token, role: role})
      .pipe(map((resp: any) => {
        this.saveToStorage(resp);

        return true;
      }))
    .toPromise();
  }

  // tslint:disable-next-line:ban-types
  loginByFacebook(user: Object, role) {
    const url = environment.apiUrl + '/login/facebook';
    user['role'] = role;
    return this.http.post(url, user)
      .pipe(map((resp: any) => {
        this.saveToStorage(resp);

        return true;
      }))
      .toPromise();
  }

  doRefreshToken(): Observable<string> {
    const data = {
      refresh_token: this.refreshToken
    };
    return this.http.post<any>(environment.apiUrl + '/token/refresh', data).pipe(map(resp => resp.token));
  }

  public register(userId: string, user: User): Observable<User> {
    return this.http
      .put<User>(environment.apiUrl + '/register' + userId, user);
  }

  logout() {
    this.token = '';
    this.user = null;
    this.refreshToken = '';

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refresh_token');

    // this.router.navigate(['/login']);
  }

  isAuthenticated(): Observable<boolean> {
    return observableOf(typeof this.token !== 'undefined' && this.token.length > 5);
  }

  isLoggedIn(): boolean {
    return this.token.length > 5;
  }

  isReallyLoggedIn(): boolean {
    return localStorage.getItem('token') && localStorage.getItem('token').length > 5 && this.isLoggedIn();
  }

  saveToStorage(resp: object) {
    if (resp.hasOwnProperty('token')) {
      localStorage.setItem('token', resp['token']);
      this.token = resp['token'];
    }

    if (resp.hasOwnProperty('user') && resp['user'].hasOwnProperty('id')) {
      localStorage.setItem('user', JSON.stringify(resp['user']));
      this.user = resp['user'];
      this.isAdmin = this.user['roles'].includes('ROLE_ADMIN');
    }

    if (resp.hasOwnProperty('refresh_token')) {
      localStorage.setItem('refresh_token', resp['refresh_token']);
      this.refreshToken = resp['refresh_token'];
    }
  }

  loadFromStorage() {
    if ( localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.user = JSON.parse(localStorage.getItem('user'));
      this.refreshToken = localStorage.getItem('refresh_token');
      this.isAdmin = this.user['roles'].includes('ROLE_ADMIN');
    } else {
      this.token = '';
      this.user = null;
      this.refreshToken = '';
    }
  }

  getToken(): string {
    return this.token;
  }

  getUserId() {
    return this.user['id'];
  }

  getUserEmail() {
    return this.user['email'];
  }

  roles() {
    return JSON.parse(localStorage.getItem('user')).roles;
  }
}
