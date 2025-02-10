import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CollectionRequest } from '../../models/collection-request.model';
import { User } from '../../models/user.model';
import { selectCurrentUser } from '../../auth/store/auth.selectors';
import * as CollectionActions from '../store/collection.actions';

@Component({
  selector: 'app-available-collections',
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Available Collections in {{ (currentUser$ | async)?.city }}</h1>
      </div>

      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" class="divide-y divide-gray-200">
          <li *ngFor="let request of availableCollections$ | async">
            <div class="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div class="flex items-center justify-between">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-medium text-green-600 truncate">
                      Collection #{{ request.id }}
                    </p>
                    <div class="ml-2 flex-shrink-0">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        PENDING
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
                <p *ngIf="request.notes" class="mt-2 text-sm text-gray-500">
                  Notes: {{ request.notes }}
                </p>
              </div>

              <div class="mt-4 flex justify-end">
                <button
                  (click)="acceptCollection(request.id)"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  Accept Collection
                </button>
              </div>
            </div>
          </li>

          <li *ngIf="(availableCollections$ | async)?.length === 0" class="px-4 py-6 text-center text-gray-500">
            No available collections in your city at the moment.
          </li>
        </ul>
      </div>
    </div>
  `
})
export class AvailableCollectionsComponent implements OnInit {
  availableCollections$: Observable<CollectionRequest[]>;
  currentUser$: Observable<User | null>;

  constructor(private store: Store) {
    this.currentUser$ = this.store.select(selectCurrentUser);
    this.availableCollections$ = this.store.select(selectAvailableCollections);
  }

  ngOnInit(): void {
    this.currentUser$.subscribe(user => {
      if (user) {
        this.store.dispatch(CollectionActions.loadAvailableCollections({ city: user.city }));
      }
    });
  }

  acceptCollection(id: string): void {
    this.currentUser$.subscribe(user => {
      if (user) {
        this.store.dispatch(CollectionActions.acceptCollection({ 
          collectionId: id, 
          collectorId: user.id 
        }));
      }
    });
  }
} 