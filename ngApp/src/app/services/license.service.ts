import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { License } from '../models/license';

@Injectable({
  providedIn: 'root'
})
export class LicenseService {

  private _apiUrl = `${environment.apiUrl}/license`;

  constructor(
    private http: HttpClient
  ) { }

  getLicense(page?: number, pageLength?: number, field?: string, sort?: number, id?: string): Observable<any> {
    if (id) {
      return this.http.get<any>(`${this._apiUrl}/${id}`);
    } else {
      return this.http.get<any>(this._apiUrl + `?page=${page}&pageLength=${pageLength}&field=${field}&sort=${sort}`);
    }
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message);
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
function catchError(errorHandler: any): import("rxjs").OperatorFunction<any, any> {
  throw new Error('Function not implemented.');
}

