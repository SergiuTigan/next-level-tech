import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../shared/models/user.interface';
import { environment } from '../../../assets/environment/environment';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  baseUrl = environment.baseUrl;
  isSignInOpen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isSignInOpenCurrent = this.isSignInOpen$.asObservable();

  constructor(private baseService: BaseService) {
  }

  saveCurrentState(isOpen: boolean): void {
    this.isSignInOpen$.next(isOpen);
  }

  register(user: User): Observable<User> {
    return this.baseService.post<User>(`${this.baseUrl}/users`, user);
  }
  login(user: any): Observable<User> {
    return this.baseService.post<User>(`${this.baseUrl}/users/login`, user);
  }
}
