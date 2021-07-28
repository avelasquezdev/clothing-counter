import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Clothe, ClotheCollection } from './clothe.model';
//import { map } from 'rxjs/operators';


const API_URL = environment.apiUrl;

@Injectable()
export class ClotheService {
  constructor(
    private http: HttpClient
  ) { }

  public postClothe(clothe): Observable<Clothe> {
    return this.http
      .post<Clothe>(API_URL + '/clothes', clothe);
  }

  public getClothe(id: string): Observable<Clothe> {
    return this.http
      .get<Clothe>(API_URL + '/clothes/' + id);
  }

  public getClothes(filters?: any): Observable<ClotheCollection> {
    if (filters === undefined) { filters = {}; }

    let httpParams = new HttpParams();

    if (filters['price']) {
      httpParams = httpParams.set('price[lte]', String(filters.price));
    }
    if (filters['isTrending']) {
      httpParams = httpParams.set('popularity', 'Tendencias');
    }
    if (filters['isFashion']) {
      httpParams = httpParams.set('popularity', 'Moda');
    }
    if (filters['isGood']) {
      httpParams = httpParams.set('popularity', 'Bien');
    }
    if (filters['isOk']) {
      httpParams = httpParams.set('popularity', 'Ok');
    }
    if (filters['isHats']) {
      httpParams = httpParams.append('categories.name[]', 'Gorra');
    }
    if (filters['isShirts']) {
      httpParams = httpParams.append('categories.name[]', 'Camisa');
    }
    if (filters['isHodies']) {
      httpParams = httpParams.append('categories.name[]', 'Sudadera');
    }
    if (filters['isJackets']) {
      httpParams = httpParams.append('categories.name[]', 'Chaqueta');
    }
    if (filters['isPants']) {
      httpParams = httpParams.append('categories.name[]', 'Pantalon');
    }
    if (filters['isShoes']) {
      httpParams = httpParams.append('categories.name[]', 'zapato');
    }

    return this.http
      .get<ClotheCollection>(API_URL + '/clothes', { params: httpParams });
  }

  public deleteClothe(id: string): any {
    return this.http.delete<Clothe>(API_URL + '/clothes/' + id);
  }

  public putClothe(id: string, clothe: Clothe): Observable<Clothe> {
    return this.http
      .put<Clothe>(API_URL + id, clothe);
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

  addImpact(id): Observable<any> {
    return this.http
      .get<Clothe>(API_URL + `/clothes/${id}/add_impact/`);
  }
}
