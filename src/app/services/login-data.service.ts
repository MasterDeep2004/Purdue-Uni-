import { SocialUser } from '@abacritt/angularx-social-login';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class LoginDataService {
  private messageSource = new BehaviorSubject(false);
  currentMessage = this.messageSource.asObservable();

  private viewSource = new BehaviorSubject('table');
  viewMessage = this.viewSource.asObservable();

  private userSource = new BehaviorSubject({} as SocialUser);
  currentUser = this.userSource.asObservable();

  constructor() { }

  setFlag(message: boolean) {
    this.messageSource.next(message);
  }

  getFlag(): boolean {
    return this.messageSource.getValue();
  }

  setView(message: string) {
    this.viewSource.next(message);
  }

  getView(): Observable<string> {
    return this.viewSource.asObservable();
  }

  setCurrentUser(user: SocialUser) {
    this.userSource.next(user);
  }

  getCurrentUser(): Observable<SocialUser> {
    return this.userSource.asObservable();
  }
}
