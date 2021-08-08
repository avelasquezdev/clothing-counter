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
      httpParams = httpParams.append('popularity[]', '1');
    }
    if (filters['isFashion']) {
      httpParams = httpParams.append('popularity[]', '2');
    }
    if (filters['isGood']) {
      httpParams = httpParams.append('popularity[]', '3');
    }
    if (filters['isOk']) {
      httpParams = httpParams.append('popularity[]', '4');
    }
    if (filters['accesorios']) {
      httpParams = httpParams.append('categories.name[]', 'Accesorios');
    }
    if (filters['bañadores']) {
      httpParams = httpParams.append('categories.name[]', 'Bañadores');
    }
    if (filters['bermudas']) {
      httpParams = httpParams.append('categories.name[]', 'Bermudas');
    }
    if (filters['bolsos']) {
      httpParams = httpParams.append('categories.name[]', 'Bolsos');
    }
    if (filters['camisas']) {
      httpParams = httpParams.append('categories.name[]', 'Camisas');
    }
    if (filters['camisetas']) {
      httpParams = httpParams.append('categories.name[]', 'Camisetas');
    }
    if (filters['cazadoras']) {
      httpParams = httpParams.append('categories.name[]', 'Cazadoras');
    }
    if (filters['chaquetas']) {
      httpParams = httpParams.append('categories.name[]', 'Chaquetas');
    } 
    if (filters['gorras']) {
      httpParams = httpParams.append('categories.name[]', 'Gorras');
    }
    if (filters['jeans']) {
      httpParams = httpParams.append('categories.name[]', 'Jeans');
    }
    if (filters['jerseis']) {
      httpParams = httpParams.append('categories.name[]', 'Jerséis');
    }
    if (filters['joggers']) {
      httpParams = httpParams.append('categories.name[]', 'Joggers');
    }
    if (filters['pantalones']) {
      httpParams = httpParams.append('categories.name[]', 'Pantalones');
    }
    if (filters['polos']) {
      httpParams = httpParams.append('categories.name[]', 'Polos');
    }
    if (filters['sudaderas']) {
      httpParams = httpParams.append('categories.name[]', 'Sudaderas');
    }
    if (filters['zapatos']) {
      httpParams = httpParams.append('categories.name[]', 'Zapatos');
    }
    if (filters['sizes'] && filters['sizes'].length > 0) {
      filters['sizes'].forEach(element => {
        httpParams = httpParams.append('sizes[]', String(element).replace('S', 'Small'));
      });
    }
    if (filters['colors'] && filters['colors'].length > 0) {
      filters['colors'].forEach(element => {
        httpParams = httpParams.append('colors[]', element);
      });
    }
    if (filters['brands'] && filters['brands'].length > 0) {
      filters['brands'].forEach(element => {
        httpParams = httpParams.append('brand[]', element);
      });
    }
    if (filters['title']) {
      httpParams = httpParams.set('title', String(filters.title));
    }
    if (filters['order']) {
      httpParams = httpParams.set(`order[${filters.order['value']}]`, filters.order['order']);
    }
    if (filters['isAvailable']) {
      httpParams = httpParams.set('isAvailable', filters.isAvailable);
    }
    if (filters['createdAt']) {
      httpParams = httpParams.set('order[createdAt]', filters.createdAt);
    }

    return this.http
      .get<ClotheCollection>(API_URL + '/clothes', { params: httpParams });
  }

  public getClothesByUserId(profileId: number): Observable<ClotheCollection> {
    return this.http
      .get<ClotheCollection>(API_URL + '/user_profiles/' + profileId + '/favs');
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
