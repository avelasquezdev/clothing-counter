import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category, CategoryCollection } from './category.model';
//import { map } from 'rxjs/operators';


const API_URL = environment.apiUrl;

@Injectable()
export class CategoryService {
  constructor(
    private http: HttpClient
  ) { }

  public postCategory(category): Observable<Category> {
    return this.http
      .post<Category>(API_URL + '/categories', category);
  }

  public getCategory(id: string): Observable<Category> {
    return this.http
      .get<Category>(API_URL + '/categories/' + id);
  }

  public getCategories(filters?: any): Observable<CategoryCollection> {
    if (filters === undefined) { filters = {}; }

    let httpParams = new HttpParams();

    return this.http
      .get<CategoryCollection>(API_URL + '/categories', { params: httpParams });
  }

  public deleteCategory(id: string): any {
    return this.http.delete<Category>(API_URL + '/categories/' + id);
  }

  public putCategory(id: string, category: Category): Observable<Category> {
    return this.http
      .put<Category>(API_URL + '/categories/' + id, category);
  }

}
