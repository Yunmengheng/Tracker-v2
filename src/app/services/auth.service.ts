import { Injectable, signal } from '@angular/core';
import { Observable, of, BehaviorSubject, delay, map } from 'rxjs';
import { User, LoginRequest, RegisterRequest, AuthToken } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    // Check if user is already logged in (from localStorage)
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<User> {
    // Simulated login - in real app, this would call backend API
    const mockUser: User = {
      id: '1',
      email: credentials.email,
      username: credentials.email.split('@')[0],
      firstName: 'John',
      lastName: 'Doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + credentials.email,
      createdAt: new Date(),
      updatedAt: new Date(),
      preferences: {
        currency: 'USD',
        language: 'en',
        theme: 'light',
        notifications: true,
        emailNotifications: true
      }
    };

    return of(mockUser).pipe(
      delay(800), // Simulate network delay
      map(user => {
        this.setCurrentUser(user);
        return user;
      })
    );
  }

  register(data: RegisterRequest): Observable<User> {
    // Simulated registration
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: data.email,
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + data.email,
      createdAt: new Date(),
      updatedAt: new Date(),
      preferences: {
        currency: 'USD',
        language: 'en',
        theme: 'light',
        notifications: true,
        emailNotifications: true
      }
    };

    return of(mockUser).pipe(
      delay(800),
      map(user => {
        this.setCurrentUser(user);
        return user;
      })
    );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  updateProfile(user: Partial<User>): Observable<User> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('No user logged in');
    }

    const updatedUser = { ...currentUser, ...user, updatedAt: new Date() };
    return of(updatedUser).pipe(
      delay(500),
      map(user => {
        this.setCurrentUser(user);
        return user;
      })
    );
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  private setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
  }
}
