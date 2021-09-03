import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  DOMAIN: string;
  API_PREFIX: string;
  isProd: boolean;

  constructor(
    public http: HttpClient
  ) {
    const isProd = window.location.origin.includes('herokuapp');
    this.isProd = isProd;
    this.DOMAIN = this.isProd ? 'https://rmw-modern-server.herokuapp.com' : `http://localhost:6700`;
    const apiDomain = this.DOMAIN + '/apps';
    this.API_PREFIX = apiDomain;
    // console.log({ isProd, apiDomain }, this);
  }

  sendRequest<T>(
    route: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: object | FormData | null,
    customHeaders?: HttpHeaders,
    report_progress: boolean = false,
  ): Observable<T> {
    const api_url = this.API_PREFIX + route;
    const jwt = window.localStorage.getItem('rmw-modern-apps-jwt') || '';
    const httpOptions: any = {
      withCredentials: true,
      reportProgress: report_progress,
      headers: customHeaders || new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${jwt}`
      }),
    };
    if (data && data.constructor === Object) {
      httpOptions.headers.set('Content-Type', 'application/json');
    }

    let requestObservable: Observable<T>;

    switch (method) {
      case 'GET': {
        requestObservable = (<any> this.http.get(api_url, httpOptions)) as Observable<T>;
        break;
      }
      case 'POST': {
        requestObservable = (<any> this.http.post(api_url, data, httpOptions)) as Observable<T>;
        break;
      }
      case 'PUT': {
        requestObservable = (<any> this.http.put(api_url, data, httpOptions)) as Observable<T>;
        break;
      }
      case 'DELETE': {
        requestObservable = (<any> this.http.delete(api_url, httpOptions)) as Observable<T>;
        break;
      }
    }

    return requestObservable;
  }
}
