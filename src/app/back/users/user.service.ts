import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, UserCollection } from './user.model';
//import { map } from 'rxjs/operators';


const API_URL = environment.apiUrl;

@Injectable()
export class UserService {
  constructor(
    private http: HttpClient
  ) { }

  public postUser(user): Observable<User> {
    return this.http
      .post<User>(API_URL + '/users', user);
  }

  public getUser(id: string): Observable<User> {
    return this.http
      .get<User>(API_URL + '/users/' + id);
  }

  public getUsers(filters?: any): Observable<UserCollection> {
    if (filters === undefined) { filters = {}; }

    let httpParams = new HttpParams();

    return this.http
      .get<UserCollection>(API_URL + '/users', { params: httpParams });
  }

  public deleteUser(id: string): any {
    return this.http.delete<User>(API_URL + id);
  }

  public putUser(id: string, user: User): Observable<User> {
    return this.http
      .put<User>(API_URL + id, user);
  }

}
