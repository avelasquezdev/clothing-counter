import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Clothing, ClothingCollection } from './clothing.model';
//import { map } from 'rxjs/operators';


const API_URL = environment.apiUrl;

@Injectable()
export class ClothingService {
  constructor(
    private http: HttpClient
  ) { }

  public postClothing(clothing): Observable<Clothing> {
    return this.http
      .post<Clothing>(API_URL + '/clothes', clothing);
  }

  public getClothing(id: string): Observable<Clothing> {
    return this.http
      .get<Clothing>(API_URL + '/clothes/' + id);
  }

  public getClothes(filters?: any): Observable<ClothingCollection> {
    if (filters === undefined) { filters = {}; }

    let httpParams = new HttpParams();

    return this.http
      .get<ClothingCollection>(API_URL + '/clothes', { params: httpParams });
  }

  public deleteClothing(id: string): any {
    return this.http.delete<Clothing>(API_URL + '/clothes/' + id);
  }

  public putClothing(id: string, clothing: Clothing): Observable<Clothing> {
    return this.http
      .put<Clothing>(API_URL + '/clothes/' + id, clothing);
  }

  postMediaClothe(fileItem: File, extraData?: object): Observable<any> {
    const apiCreateEndpoint = `${API_URL}${'/media_objects'}`;
    const formData: FormData = new FormData();

    formData.append('file', fileItem, fileItem.name);
    if (extraData) {
      for (const key in extraData) {
        if (extraData.hasOwnProperty(key)) {
          formData.append(key, extraData[ key ]);
        }
      }
    }
    const req = new HttpRequest('POST', apiCreateEndpoint, formData, {
      reportProgress: true // for progress data
    });
    return this.http.request(req);
  }
}
