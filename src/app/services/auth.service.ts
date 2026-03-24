import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User, RegisterPayload, LoginPayload, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERS_KEY = 'auth_app_users';
  private readonly CURRENT_USER_KEY = 'auth_app_current_user';
  private readonly TOKEN_KEY = 'auth_app_token';

  private currentUserSubject = new BehaviorSubject<Omit<User, 'password'> | null>(this.loadCurrentUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {}

  private loadCurrentUser(): Omit<User, 'password'> | null {
    try {
      const userData = localStorage.getItem(this.CURRENT_USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  private getUsers(): User[] {
    try {
      const data = localStorage.getItem(this.USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  private generateToken(): string {
    return btoa(`${Date.now()}-${Math.random().toString(36)}`);
  }

  private getAvatarUrl(name: string): string {
    const colors = ['4f46e5', '7c3aed', 'db2777', 'dc2626', 'ea580c', '16a34a', '0891b2'];
    const color = colors[name.charCodeAt(0) % colors.length];
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color}&color=fff&size=128`;
  }

  get currentUser(): Omit<User, 'password'> | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value && !!localStorage.getItem(this.TOKEN_KEY);
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        const users = this.getUsers();

        // Check duplicate email
        if (users.find(u => u.email === payload.email)) {
          observer.next({ success: false, message: 'An account with this email already exists.' });
          observer.complete();
          return;
        }

        // Check duplicate username
        if (users.find(u => u.username === payload.username)) {
          observer.next({ success: false, message: 'Username is already taken. Please choose another.' });
          observer.complete();
          return;
        }

        const newUser: User = {
          id: this.generateId(),
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          username: payload.username,
          password: btoa(payload.password), // Simple encoding for demo
          phone: payload.phone || '',
          bio: payload.bio || '',
          avatar: this.getAvatarUrl(`${payload.firstName} ${payload.lastName}`),
          createdAt: new Date()
        };

        users.push(newUser);
        this.saveUsers(users);

        const { password, ...userWithoutPassword } = newUser;
        const token = this.generateToken();

        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
        localStorage.setItem(this.TOKEN_KEY, token);
        this.currentUserSubject.next(userWithoutPassword);

        observer.next({
          success: true,
          message: 'Registration successful! Welcome aboard.',
          user: userWithoutPassword,
          token
        });
        observer.complete();
      }, 800); // Simulate network delay
    });
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        const users = this.getUsers();
        const user = users.find(u => u.email === payload.email);

        if (!user) {
          observer.next({ success: false, message: 'No account found with this email address.' });
          observer.complete();
          return;
        }

        if (atob(user.password) !== payload.password) {
          observer.next({ success: false, message: 'Incorrect password. Please try again.' });
          observer.complete();
          return;
        }

        const { password, ...userWithoutPassword } = user;
        const token = this.generateToken();

        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
        localStorage.setItem(this.TOKEN_KEY, token);
        this.currentUserSubject.next(userWithoutPassword);

        observer.next({
          success: true,
          message: 'Login successful! Welcome back.',
          user: userWithoutPassword,
          token
        });
        observer.complete();
      }, 800);
    });
  }

  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
  }

  updateProfile(updates: Partial<Omit<User, 'id' | 'password' | 'createdAt'>>): Observable<AuthResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        const currentUser = this.currentUser;
        if (!currentUser) {
          observer.next({ success: false, message: 'Not authenticated.' });
          observer.complete();
          return;
        }

        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);

        if (userIndex === -1) {
          observer.next({ success: false, message: 'User not found.' });
          observer.complete();
          return;
        }

        const updatedUser = { ...users[userIndex], ...updates };
        users[userIndex] = updatedUser;
        this.saveUsers(users);

        const { password, ...userWithoutPassword } = updatedUser;
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
        this.currentUserSubject.next(userWithoutPassword);

        observer.next({
          success: true,
          message: 'Profile updated successfully!',
          user: userWithoutPassword
        });
        observer.complete();
      }, 600);
    });
  }
}
