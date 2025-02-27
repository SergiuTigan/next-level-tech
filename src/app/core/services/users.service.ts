import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  isSignInOpen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isSignInOpenCurrent = this.isSignInOpen$.asObservable();

  constructor() { }

  saveCurrentState(isOpen: boolean): void {
    this.isSignInOpen$.next(isOpen);
  }
}
