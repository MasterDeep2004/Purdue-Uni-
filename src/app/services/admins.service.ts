import { Injectable } from '@angular/core';
import {
    HttpClient,
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Admins } from '../models/admins.model';

@Injectable()
export class AdminsService {
    constructor(private http: HttpClient) { }

    rootURL = environment.serverUrl + '/admins';

    getall() {
        return this.http.get<Admins[]>(
            this.rootURL
        );
    }

    addAdmin(userSid: string) {
        return this.http.get(
            this.rootURL + '/AddAdmin?userSid=' + userSid
        );
    }

    removeAdmin(userSid: string) {
        return this.http.delete(
            this.rootURL + '/RemoveAdmin?userSid=' + userSid
        );
    }

    isAdmin(userSid: string) {
        return this.http.get<boolean>(
            this.rootURL + '/IsAdmin?userSid=' + userSid
        );
    }
}
