import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CategoryDataService {

  private messageSource = new BehaviorSubject('');
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeCategory(message: string) {
    this.messageSource.next(message)
  }

  getCategory(): string{
      return this.messageSource.getValue();
  }
}