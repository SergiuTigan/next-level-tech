import {inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../../shared/models/user.interface';
import { environment } from '../../../assets/environment/environment';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  readonly #baseService = inject(BaseService);
  baseUrl = environment.baseUrl;
  isSignInOpen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isNotReader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isSignInOpenCurrent = this.isSignInOpen$.asObservable();
  isAuthenticatedCurrent = this.isAuthenticated$.asObservable();
  isNotReaderCurrent$ = this.isAuthenticated$.asObservable();

  constructor() {
  }

  saveCurrentState(isOpen: boolean): void {
    this.isSignInOpen$.next(isOpen);
  }

  saveAuthState(isAuthenticated: boolean): void {
    this.isAuthenticated$.next(isAuthenticated);
  }

  saveRole(role: string): void {
    if (role === 'Reader') {
      this.isNotReader.next(false);
    } else {
      this.isNotReader.next(true);
    }
  }

  register(user: User): Observable<{ user: User, token: string }> {
    return this.#baseService.post<{ user: User, token: string }>(`${this.baseUrl}/users`, user).pipe(tap((user: { user: User, token: string }) => {
      sessionStorage.setItem('token', user.token);
      sessionStorage.setItem('user', JSON.stringify(user.user));
      this.saveAuthState(true);
      this.saveRole(user.user.role);
    }));
  }

  login(user: any): Observable<{ user: User, token: string }> {
    return this.#baseService.post<{ user: User, token: string }>(`${this.baseUrl}/users/login`, user).pipe(tap((user: { user: User, token: string }) => {
      sessionStorage.setItem('token', user.token);
      sessionStorage.setItem('user', JSON.stringify(user.user));
      this.saveAuthState(true);
      this.saveRole(user.user.role);
    }));
  }

  update(id: string, user: User): Observable<User> {
    return this.#baseService.patch<User>(`${this.baseUrl}/users/${id}`, user).pipe(tap((user: User) => {
      sessionStorage.setItem('user', JSON.stringify(user));
    }));
  }

  uploadAvatar(id: string, avatar: File | null): Observable<User> {
    const formData = new FormData();
    formData.append('avatar', avatar as Blob);
    return this.#baseService.post<User>(`${this.baseUrl}/users/${id}/avatar`, formData).pipe(tap((user: User) => {
      sessionStorage.setItem('user', JSON.stringify(user));
    }));
  }
}
