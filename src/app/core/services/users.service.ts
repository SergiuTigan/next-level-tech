import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, from, Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {User} from '../../shared/models/user.interface';
import {BaseService} from './base.service';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  User as FirebaseUser
} from '@angular/fire/auth';

const COLLECTION = 'users';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  readonly #baseService = inject(BaseService);
  readonly #auth = inject(Auth);

  isSignInOpen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isNotReader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUser$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  isSignInOpenCurrent = this.isSignInOpen$.asObservable();
  isAuthenticatedCurrent = this.isAuthenticated$.asObservable();
  isNotReaderCurrent$ = this.isNotReader.asObservable();

  constructor() {
    // Check for existing session on init
    this.checkAuthState();
  }

  private checkAuthState(): void {
    const storedUser = sessionStorage.getItem('user');
    const storedToken = sessionStorage.getItem('token');
    if (storedUser && storedToken) {
      const user = JSON.parse(storedUser) as User;
      this.currentUser$.next(user);
      this.saveAuthState(true);
      this.saveRole(user.role);
    }
  }

  saveCurrentState(isOpen: boolean): void {
    this.isSignInOpen$.next(isOpen);
  }

  saveAuthState(isAuthenticated: boolean): void {
    this.isAuthenticated$.next(isAuthenticated);
  }

  saveRole(role: string): void {
    if (role === 'Reader' || role === 'reader') {
      this.isNotReader.next(false);
    } else {
      this.isNotReader.next(true);
    }
  }

  register(userData: User): Observable<{ user: User, token: string }> {
    return from(this.registerAsync(userData));
  }

  private async registerAsync(userData: User): Promise<{ user: User, token: string }> {
    // Create Firebase Auth user
    const credential = await createUserWithEmailAndPassword(
      this.#auth,
      userData.email,
      userData.password || ''
    );

    const firebaseUser = credential.user;
    const token = await firebaseUser.getIdToken();

    // Create user document in Firestore
    const user: Partial<User> = {
      id: firebaseUser.uid,
      _id: firebaseUser.uid,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: userData.role || 'reader',
      avatar: '',
      bio: ''
    };

    // Use set with specific ID instead of create (which auto-generates ID)
    await this.#baseService.update<User>(COLLECTION, firebaseUser.uid, user);

    const fullUser = { ...user, id: firebaseUser.uid, _id: firebaseUser.uid } as User;

    // Store in session
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(fullUser));
    this.currentUser$.next(fullUser);
    this.saveAuthState(true);
    this.saveRole(fullUser.role);

    return { user: fullUser, token };
  }

  login(credentials: { email: string; password: string }): Observable<{ user: User, token: string }> {
    return from(this.loginAsync(credentials));
  }

  private async loginAsync(credentials: { email: string; password: string }): Promise<{ user: User, token: string }> {
    // Sign in with Firebase Auth
    const credential = await signInWithEmailAndPassword(
      this.#auth,
      credentials.email,
      credentials.password
    );

    const firebaseUser = credential.user;
    const token = await firebaseUser.getIdToken();

    // Get user document from Firestore
    let user = await this.#baseService.getById<User>(COLLECTION, firebaseUser.uid);

    // If user doesn't exist in Firestore, create a basic profile
    if (!user) {
      user = {
        id: firebaseUser.uid,
        _id: firebaseUser.uid,
        firstName: firebaseUser.displayName?.split(' ')[0] || 'User',
        lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
        email: firebaseUser.email || credentials.email,
        role: 'reader',
        avatar: firebaseUser.photoURL || ''
      };
      await this.#baseService.update<User>(COLLECTION, firebaseUser.uid, user);
    }

    // Store in session
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
    this.currentUser$.next(user);
    this.saveAuthState(true);
    this.saveRole(user.role);

    return { user, token };
  }

  logout(): Observable<void> {
    return from(this.logoutAsync());
  }

  private async logoutAsync(): Promise<void> {
    await signOut(this.#auth);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    this.currentUser$.next(null);
    this.saveAuthState(false);
    this.isNotReader.next(false);
  }

  update(id: string, userData: Partial<User>): Observable<User> {
    return from(this.updateAsync(id, userData));
  }

  private async updateAsync(id: string, userData: Partial<User>): Promise<User> {
    // If password is being updated, update Firebase Auth
    if (userData.newPassword) {
      const currentUser = this.#auth.currentUser;
      if (currentUser) {
        await updatePassword(currentUser, userData.newPassword);
      }
      delete userData.newPassword;
      delete userData.password;
    }

    const updated = await this.#baseService.update<User>(COLLECTION, id, userData);
    sessionStorage.setItem('user', JSON.stringify(updated));
    this.currentUser$.next(updated);
    return updated;
  }

  uploadAvatar(id: string, avatar: File | null): Observable<User> {
    return from(this.uploadAvatarAsync(id, avatar));
  }

  private async uploadAvatarAsync(id: string, avatar: File | null): Promise<User> {
    if (!avatar) throw new Error('No avatar file provided');

    const path = `avatars/${id}/${avatar.name}`;
    const avatarUrl = await this.#baseService.uploadFile(path, avatar);

    return this.updateAsync(id, { avatar: avatarUrl });
  }

  getUserById(id: string): Observable<User> {
    return from(this.#baseService.getById<User>(COLLECTION, id)).pipe(
      map(user => {
        if (!user) throw new Error('User not found');
        return user;
      })
    );
  }
}
