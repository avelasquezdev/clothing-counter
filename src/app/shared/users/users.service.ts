import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, UserCollection } from './user.model';
import { map } from 'rxjs/operators';


const API_URL = environment.apiUrl;

@Injectable()
export class UsersService {
  constructor(
    private http: HttpClient
  ) { }

  public postUser(user): Observable<User> {
    return this.http
      .post<User>(API_URL + '/register', user);
  }

  public getUser(id: string): Observable<User> {
    return this.http
      .get<User>(API_URL + '/users/' + id);
  }

  public getUsers(filters?: any): Observable<UserCollection> {
    if (filters === undefined) { filters = {}; }

    let httpParams = new HttpParams();

    if (filters['email']) {
      httpParams = httpParams.set('email', String(filters.email));
    }
    return this.http
      .get<UserCollection>(API_URL + '/users', { params: httpParams });
  }

  public deleteUser(userId: string): any {
    return this.http.delete<User>(API_URL + '/users/' + userId);
  }

  public putUser(userId: string, user: User): Observable<User> {
    return this.http
      .put<User>(API_URL + '/users/' + userId, user);
  }

  forgotPassword(email: any) {
    const url = API_URL + '/users/forgot-password-request';

    return this.http.post(url, email);
  }

  resetPassword(user: User, token: string): Observable<boolean> {
    const url = API_URL + '/users/reset-password';

    return this.http.post(url, user, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(map((resp: any) => {
      return true;
    }));
  }
}
