import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { License } from '../models/license';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LicenseService {

  private _apiUrl = `${environment.apiUrl}/license`;

  constructor(
    private http: HttpClient
  ) { }

  getLicense(page?: number, pageLength?: number, field?: string, sort?: number): Observable<any> {
    return this.http.get<any>(this._apiUrl + `?page=${page}&pageLength=${pageLength}&field=${field}&sort=${sort}`)
      .pipe(
        map(data => {
          console.log(data);
          if (data.docLicenses) {
            for (let i = 0; i < data.docLicenses.length; i++) {
              data.docLicenses[i].isactive = data.docLicenses[i].isactive === 'true' ? true : false;
            }
          }
          return data;
        })
      )
  }

  getLicenseID(id: string): Observable<any> {
    return this.http.get<any>(this._apiUrl + `/${id}`).pipe(
      map(data => {
        data.isactive = data.isactive === 'true' ? true : false;
        return data;
      })
    )
  }

  putLicense(license: License): Observable<any> {
    return this.http.put<any>(`${this._apiUrl}/${license._id}`, license);
  }

  delLicense(id: string): Observable<any> {
    return this.http.delete<any>(`${this._apiUrl}/${id}`);
  }

  postLicense(license: License): Observable<any> {
    return this.http.post<any>(this._apiUrl, license);
  }

}

