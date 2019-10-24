import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient) { }

  getItems() {
    const token = localStorage.getItem('id_token');
    const headerDict = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      Authorization: `Bearer ${token}`
    };

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };

    return this.http.get(environment.baseApi + 'api/items', requestOptions);
  }

  getItem() {
    const token = localStorage.getItem('id_token');
    const headerDict = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      Authorization: `Bearer ${token}`
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };

    return this.http.get(environment.baseApi + 'api/items/', requestOptions);
  }

  getOrdersByUserId(userId: number): Observable<any> {
    const token = localStorage.getItem('id_token');
    const headerDict = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      Authorization: `Bearer ${token}`
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };

    return this.http.get(environment.baseApi + `api/orders/getOrdersByUserID/${userId}`, requestOptions);
  }

  newCart(userId: number): Observable<any> {
    const token = localStorage.getItem('id_token');
    console.log(userId);
    
    return this.http.post(environment.baseApi + 'api/orders/newCart', {userId},
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
        Authorization: `Bearer ${token}`
          }),
      responseType: 'json'
    }).pipe(
        data => data,
        error => error
    );
  }

  changeOrderStatus(orderId: number, status: number): Observable<any>{
    const token = localStorage.getItem('id_token');

    return this.http.post(environment.baseApi + 'api/orders/changeOrderStatus', {OrderId: orderId, Status:status},
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
        Authorization: `Bearer ${token}`
          }),
      responseType: 'text'
    }).pipe(
        data => data,
        error => error
    );
  }
}
