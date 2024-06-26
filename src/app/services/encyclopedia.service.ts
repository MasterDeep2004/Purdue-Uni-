import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MainMinimizedExternalCollection } from '../models/main-minimized-collections.model';
import { Main } from '../models/main.model';
import { MainUpdateModel } from '../models/main-update.model';
import { RelatedPage, RelatedPageCollection } from '../models/related-pages.model';
import { ExternalPage } from '../models/external-page.model';
import { Category } from '../models/category.model';

@Injectable()
export class EncyclopediaService {
  constructor(private http: HttpClient) {}

  rootURL = environment.serverUrl + '/Encylopedia';

  getByQuery(
    offset: number,
    limit: number,
    previewSize: number,
    query: string
  ) {
    return this.http.get<MainMinimizedExternalCollection>(
      this.rootURL +
        '?offset=' +
        offset +
        '&limit=' +
        limit +
        '&previewSize=' +
        previewSize +
        '&query=' +
        query
    );
  }

  getByAlphabet(
    offset: number,
    limit: number,
    previewSize: number,
    alphabet: string
  ) {
    return this.http.get<MainMinimizedExternalCollection>(
      this.rootURL +
        '/alphabet' +
        '?offset=' +
        offset +
        '&limit=' +
        limit +
        '&previewSize=' +
        previewSize +
        '&alphabet=' +
        alphabet
    );
  }

  getByCategory(
    offset: number,
    limit: number,
    previewSize: number,
    category: string
  ) {
    return this.http.get<MainMinimizedExternalCollection>(
      this.rootURL +
        '/category' +
        '?offset=' +
        offset +
        '&limit=' +
        limit +
        '&previewSize=' +
        previewSize +
        '&category=' +
        (category == null ? '' : category)
    );
  }

  getAllCategories() {
    return this.http.get<Category[]>(this.rootURL + '/fetchallcategories');
  }

  getById(id: string | null) {
    return this.http.get<Main>(this.rootURL + '/' + id);
  }

  getRelatedPages(id: string | null) {
    return this.http.get<RelatedPageCollection[]>(this.rootURL + '/related-page/' + id);
  }

  getExternalPages(pageTitle: string | null, startIndex: number) {
    return this.http.get<ExternalPage[]>(this.rootURL + '/external-page/' + pageTitle + '?startIndex=' + startIndex);
  }

  createEntry(main: Main) {
    const body = JSON.stringify(main);
    const headerOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'userName': main.author,
    });
    return this.http.post<string>(this.rootURL, body, {
      headers: headerOptions,
      // withCredentials: true,
    });
  }

  updateEntry(id: string, main: MainUpdateModel) {
    const body = JSON.stringify(main);
    const headerOptions = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put<Main>(this.rootURL + '/' + id, body, {
      headers: headerOptions,
      // withCredentials: true,
    });
  }

  deleteEntry(id: string) {
    return this.http.delete(this.rootURL + '/' + id, {
      // withCredentials: true,
    });
  }

  login() {
    return this.http.get(this.rootURL + '/login', {
      // withCredentials: true,
      responseType: 'text',
    });
  }
}
