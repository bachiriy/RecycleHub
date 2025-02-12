import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../shared/components/base.component';
import { CollectionRequest } from '../../models/collection-request.model';
import { User } from '../../models/user.model';
import { selectCurrentUser } from '../../auth/store/auth.selectors';
import * as CollectionActions from '../store/collection.actions';
import { selectPendingRequestsCount, selectUserCollections } from '../store/collection.selectors';

@Component({
  selector: 'app-my-collections',
  standalone: false,
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">My Collection Requests</h1>
        <button 
          routerLink="/collections/new"
          class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          [disabled]="((pendingRequestsCount$ | async) ?? 0) >= 3"
        >
          New Collection Request
        </button>
      </div>

      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" class="divide-y divide-gray-200">
          <li *ngFor="let request of myCollections$ | async">
            <div class="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div class="flex items-center justify-between">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-medium text-green-600 truncate">
                      Collection #{{ request.id }}
                    </p>
                    <div class="ml-2 flex-shrink-0">
                      <span [class]="getStatusClass(request.status)">
                        {{ request.status }}
                      </span>
                    </div>
                  </div>
                  <div class="mt-2">
                    <div class="flex items-center text-sm text-gray-500">
                      <span class="truncate">{{ request.collectionAddress }}</span>
                    </div>
                    <div class="mt-2 flex items-center text-sm text-gray-500">
                      <span>{{ request.collectionDate | date }} - {{ request.timeSlot }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-4">
                <div class="flex flex-wrap gap-2">
                  <span *ngFor="let item of request.wasteItems"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {{ item.type }}: {{ item.weight }}kg
                  </span>
                </div>
              </div>

              <div class="mt-4 flex justify-end space-x-3" *ngIf="request.status === 'PENDING'">
                <button
                  (click)="editRequest(request)"
                  class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                >
                  Edit
                </button>
                <button
                  (click)="deleteRequest(request.id)"
                  class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class MyCollectionsComponent extends BaseComponent implements OnInit {
  myCollections$: Observable<CollectionRequest[]>;
  pendingRequestsCount$: Observable<number>;
  currentUser$: Observable<User | null>;

  constructor(private store: Store) {
    super();
    this.currentUser$ = this.store.select(selectCurrentUser);
    this.myCollections$ = this.store.select(selectUserCollections);
    this.pendingRequestsCount$ = this.store.select(selectPendingRequestsCount);
  }

  ngOnInit(): void {
    this.store.dispatch(CollectionActions.loadUserCollections());
  }

  getStatusClass(status: string): string {
    const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full ';
    switch (status) {
      case 'PENDING':
        return baseClasses + 'bg-yellow-100 text-yellow-800';
      case 'OCCUPIED':
        return baseClasses + 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return baseClasses + 'bg-purple-100 text-purple-800';
      case 'VALIDATED':
        return baseClasses + 'bg-green-100 text-green-800';
      case 'REJECTED':
        return baseClasses + 'bg-red-100 text-red-800';
      default:
        return baseClasses + 'bg-gray-100 text-gray-800';
    }
  }

  editRequest(request: CollectionRequest): void {
    // Navigate to edit page with request data
  }

  deleteRequest(id: string): void {
    if (confirm('Are you sure you want to delete this collection request?')) {
      this.store.dispatch(CollectionActions.deleteCollectionRequest({ id }));
    }
  }
} 