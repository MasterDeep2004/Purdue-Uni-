import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class EmailService {
  constructor(private http: HttpClient) {}

  rootURL = environment.serverUrl + '/email';

  sendEmailPFW(content: string) {
    const body = JSON.stringify(content);
    const headerOptions = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(this.rootURL + '/pfw-email', body, {
      headers: headerOptions,
      // withCredentials: true,
    });
  }
  sendEmailNotPFW(content: string, name: string, email: string) {
    const body = JSON.stringify(content);
    const headerOptions = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(
      this.rootURL + '/regular-email/?name=' + name + '&email=' + email,
      body,
      {
        headers: headerOptions,
        // withCredentials: true,
      }
    );
  }
}
