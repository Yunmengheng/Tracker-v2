import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, delay, map, throwError } from 'rxjs';
import { User, LoginRequest, RegisterRequest } from '../models/user.model';

interface StoredUser extends User {
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private readonly USERS_KEY = 'registered_users';

  constructor() {
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<User> {
    return of(null).pipe(
      delay(800),
      map(() => {
        const users = this.getStoredUsers();
        const user = users.find(u => u.email === credentials.email);

        if (!user) {
          throw new Error('User not found. Please register first.');
        }

        if (user.password !== credentials.password) {
          throw new Error('Invalid password.');
        }

        // Remove password before returning
        const { password, ...userWithoutPassword } = user;
        this.setCurrentUser(userWithoutPassword);
        return userWithoutPassword;
      })
    );
  }

  register(data: RegisterRequest): Observable<User> {
    return of(null).pipe(
      delay(800),
      map(() => {
        const users = this.getStoredUsers();
        
        // Check if user already exists
        if (users.some(u => u.email === data.email)) {
          throw new Error('Email already registered.');
        }

        if (users.some(u => u.username === data.username)) {
          throw new Error('Username already taken.');
        }

        // Create new user
        const newUser: StoredUser = {
          id: Math.random().toString(36).substr(2, 9),
          email: data.email,
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          password: data.password,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`,
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

        // Save to storage
        users.push(newUser);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

        // Return user without password
        const { password, ...userWithoutPassword } = newUser;
        this.setCurrentUser(userWithoutPassword);
        return userWithoutPassword;
      })
    );
  }

  private getStoredUsers(): StoredUser[] {
    const stored = localStorage.getItem(this.USERS_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
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

  private setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private loadUserFromStorage(): void {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch {
        localStorage.removeItem('currentUser');
      }
    }
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
