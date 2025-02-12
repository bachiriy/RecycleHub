import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERS_KEY = 'users';
  private readonly CURRENT_USER_KEY = 'currentUser';
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(
    private router: Router
  ) {
    // Initialize collectors if not exists
    if (!localStorage.getItem(this.USERS_KEY)) {
      const initialCollectors: User[] = [
        {
          id: '1',
          email: 'collector1@recyclehub.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Collector',
          address: '123 Recycling St',
          city: 'Casablanca',
          phone: '0600000000',
          birthDate: new Date('1990-01-01'),
          role: 'COLLECTOR',
          points: 0
        }
        // Add more collectors as needed
      ];
      localStorage.setItem(this.USERS_KEY, JSON.stringify(initialCollectors));
    }

    // Check for current user session
    const savedUser = localStorage.getItem(this.CURRENT_USER_KEY);
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  checkUserExists(email: string): Observable<boolean> {
    const users = this.getUsers();
    return of(users.some(user => user.email === email));
  }

  private getUsers(): User[] {
    const usersJson = localStorage.getItem(this.USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  }

  register(user: Omit<User, 'id' | 'role' | 'points'>): Observable<User | null> {
    const users = this.getUsers();
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      role: 'PARTICULAR',
      points: 0
    };
    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    return of(newUser);
  }

  login(email: string, password: string): Observable<User | null> {
    
    const users: User[] = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
      this.currentUserSubject.next(user);
      this.router.navigate(['/']);
      return of(user);
    }
    return of(null);
  }

  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  updateUser(user: User): Observable<User> {
    console.log('comming user: ', user);
    
    const users: User[] = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      if (this.currentUserSubject.value?.id === user.id) {
        this.currentUserSubject.next(user);
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
      }
    }
    return of(user);
  }

  deleteUser(userId: string): Observable<boolean> {
    const users: User[] = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    const filteredUsers = users.filter(u => u.id !== userId);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(filteredUsers));
    if (this.currentUserSubject.value?.id === userId) {
      this.logout();
    }
    return of(true);
  }

  isAuthenticated(): Observable<boolean> {
    let storageUser: string | null = localStorage.getItem(this.CURRENT_USER_KEY);
    const user: User | null = storageUser !== null ? JSON.parse(storageUser) : null;
    if (user) {
      this.currentUserSubject.next(user);
      return of(true);
    } else return of(false);
  }

}