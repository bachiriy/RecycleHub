import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectIsAuthenticated, selectCurrentUser } from '../../auth/store/auth.selectors';
import { User } from '../../models/user.model';
import * as AuthActions from '../../auth/store/auth.actions';

@Component({
  selector: 'app-navbar',
  template: `
    <nav>
      <!-- Show these items when not authenticated -->
      <ng-container *ngIf="!(isAuthenticated$ | async)">
        <a routerLink="/auth/login">Login</a>
        <a routerLink="/auth/register">Register</a>
      </ng-container>

      <!-- Show these items when authenticated -->
      <ng-container *ngIf="isAuthenticated$ | async">
        <a routerLink="/auth/profile">Profile</a>
        <button (click)="onLogout()">Logout</button>
        <!-- Show user info if needed -->
        <span *ngIf="user$ | async as user">
          Welcome, {{user.firstName}}
        </span>
      </ng-container>
    </nav>
  `
})
export class NavbarComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  user$: Observable<User | null>;

  constructor(private store: Store) {
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.user$ = this.store.select(selectCurrentUser);
  }

  onLogout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  ngOnInit(): void {
    // Additional initialization logic if needed
  }
} 