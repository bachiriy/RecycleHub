import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../../models/user.model';
import { selectCurrentUser } from '../../../auth/store/auth.selectors';
import * as AuthActions from '../../../auth/store/auth.actions';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="bg-green-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <a routerLink="/" class="text-xl font-bold">RecycleHub</a>
            </div>
            
            <div class="hidden md:block ml-10">
              <div class="flex items-baseline space-x-4">
                <ng-container *ngIf="user$ | async as user">
                  <!-- Common links -->
                  <a routerLink="/dashboard" 
                     routerLinkActive="bg-green-700"
                     class="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                    Dashboard
                  </a>
                  
                  <!-- Particular links -->
                  <ng-container *ngIf="user.role === 'PARTICULAR'">
                    <a routerLink="/collections/new" 
                       routerLinkActive="bg-green-700"
                       class="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                      New Collection
                    </a>
                    <a routerLink="/collections/my" 
                       routerLinkActive="bg-green-700"
                       class="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                      My Collections
                    </a>
                    <a routerLink="/points" 
                       routerLinkActive="bg-green-700"
                       class="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                      My Points
                    </a>
                  </ng-container>
                  
                  <!-- Collector links -->
                  <ng-container *ngIf="user.role === 'COLLECTOR'">
                    <a routerLink="/collections/available" 
                       routerLinkActive="bg-green-700"
                       class="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                      Available Collections
                    </a>
                    <a routerLink="/collections/assigned" 
                       routerLinkActive="bg-green-700"
                       class="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                      My Assigned Collections
                    </a>
                  </ng-container>
                </ng-container>
              </div>
            </div>
          </div>
          
          <div class="hidden md:block">
            <div class="ml-4 flex items-center md:ml-6">
              <ng-container *ngIf="user$ | async as user; else loginButton">
                <div class="relative">
                  <div class="flex items-center">
                    <button (click)="isProfileMenuOpen = !isProfileMenuOpen"
                            class="flex items-center max-w-xs rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-600 focus:ring-white"
                    >
                      <img *ngIf="user.profileImage" 
                           [src]="user.profileImage" 
                           class="h-8 w-8 rounded-full"
                           alt="Profile"
                      />
                      <span class="ml-2">{{ user.firstName }} {{ user.lastName }}</span>
                    </button>
                  </div>
                  
                  <!-- Profile dropdown -->
                  <div *ngIf="isProfileMenuOpen"
                       class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div class="py-1">
                      <a routerLink="/profile"
                         class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Profile
                      </a>
                      <button (click)="logout()"
                              class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </ng-container>
              
              <ng-template #loginButton>
                <a routerLink="/auth/login"
                   class="text-white hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium">
                  Sign in
                </a>
                <a routerLink="/auth/register"
                   class="ml-2 text-white bg-green-700 hover:bg-green-800 px-3 py-2 rounded-md text-sm font-medium">
                  Register
                </a>
              </ng-template>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  user$: Observable<User | null>;
  isProfileMenuOpen = false;

  constructor(
    private store: Store,
    private router: Router
  ) {
    this.user$ = this.store.select(selectCurrentUser);
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
    this.router.navigate(['/auth/login']);
  }
} 