import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Login } from '../shared/models/login.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  constructor(private http: HttpClient) { }

  // POST
  login(login: Login): Observable<any> {
    return this.http.post('https://vippscaseapi20191011124052.azurewebsites.net/api/auth/login', login,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        responseType: 'json'
      }).pipe(
        data => data,
        error => error
      );
  }
}
