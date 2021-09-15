import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _apiUrl = `${environment.apiUrl}`;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  getToken() {
    return localStorage.getItem('token');
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  loginUser(user: any) {
    return this.http.post<any>(`${this._apiUrl}/login`, user)
  }

  logOutUser() {
    localStorage.removeItem('token')
    this.router.navigate(['events'])
  }

}
