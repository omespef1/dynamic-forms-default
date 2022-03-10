import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SESSION_LS_NAME } from '../utils/const';
import { Session } from '../models/session';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  public SessionObservable: BehaviorSubject<Session> = new BehaviorSubject<Session>(null);

  get session(): Session {    
    const data = localStorage.getItem(SESSION_LS_NAME);
    if (data && data !== '') {
      return JSON.parse(atob(data));
    }
    return null;
  }
  set session(value: Session) {
    if (value) {
      const data = btoa(JSON.stringify(value));
      localStorage.setItem(SESSION_LS_NAME, data);
      this.SessionObservable.next(value);
    }
  }

  constructor(

  ) { }

  clean() {
    if (this.session) {
      localStorage.removeItem(SESSION_LS_NAME);
      this.SessionObservable.next(null);
    }
  }
}
