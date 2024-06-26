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
export class StatisticsService {
  constructor(private http: HttpClient) {}

  rootURL = environment.serverUrl + '/Statistics';

  getCommonlyOccuringWordsStats(count: number) {
    return this.http.get(this.rootURL + '/GetRecommendedWords?count=' + count, {
      // withCredentials: true
    });
  }

  getCommonlySearchedWordsStats(count: number) {
    return this.http.get(this.rootURL + '/GetPopularWords?count=' + count, {
      // withCredentials: true
    });
  }

  getSearchSuggestion(query: string, offset: number, limit: number){
    return this.http.get(this.rootURL + '/search-suggestions?query=' + query + '&offset=' + offset + '&limit=' + limit, {
      // withCredentials: true
    });
  }
}
