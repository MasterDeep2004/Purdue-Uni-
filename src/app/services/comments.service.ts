import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Comments } from '../models/comments.model';
import { CommentsExternalCollection } from '../models/comments-external-collection.model';

@Injectable()
export class CommentsService {
  constructor(private http: HttpClient) { }

  rootURL = environment.serverUrl + '/comment';

  getall(offset: number, limit: number, asc: boolean) {
    return this.http.get<CommentsExternalCollection>(
      this.rootURL + '/?offset=' + offset + '&limit=' + limit + '&asc=' + asc
    );
  }

  resolve(id: string, flag: boolean) {
    return this.http.post(
      this.rootURL + '/resolve/' + id + '?flag=' + flag, null
    );
  }

  get(id: string) {
    return this.http.get<Comments[]>(this.rootURL + '/' + id);
  }

  comment(comment: Comments) {
    const body = JSON.stringify(comment);
    const headerOptions = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<Comments>(this.rootURL, body, {
      headers: headerOptions,
    });
  }

  delete(id: string, userSid: string) {
    return this.http.delete(this.rootURL + '/' + id + '?userSid=' + userSid);
  }

  update(id: string, comment: string, userSid: string) {
    return this.http.put(this.rootURL + '/' + id + '?comment=' + comment + '&userSid=' + userSid, {
    });
  }

  like(id: string, userSid: string) {
    return this.http.post(this.rootURL + '/like/' + id + '?userSid=' + userSid, null, {
    });
  }

  disLike(id: string, userSid: string) {
    return this.http.post(this.rootURL + '/like/' + id + '?userSid=' + userSid + '&flag=false', null, {
    });
  }
}
