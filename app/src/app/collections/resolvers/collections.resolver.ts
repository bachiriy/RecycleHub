import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { tap, filter, take, switchMap, timeout, catchError } from 'rxjs/operators';
import { CollectionRequest } from '../../models/collection-request.model';
import { selectAllCollections } from '../store/collection.selectors';
import * as CollectionActions from '../store/collection.actions';

@Injectable({
  providedIn: 'root'
})
export class CollectionsResolver implements Resolve<boolean> {
  constructor(private store: Store) {}

  resolve(): Observable<boolean> {
    return this.store.select(selectAllCollections).pipe(
      tap(collections => {
        if (!collections.length) {
          this.store.dispatch(CollectionActions.loadUserCollections());
        }
      }),
      filter(collections => !!collections.length), // Only proceed if collections are loaded
      take(1), // Ensure the observable completes after emitting one value
      timeout(15000), // Timeout after 15 seconds
      catchError(() => of(true)), // Handle errors gracefully
      switchMap(() => of(true)) // Return true to allow navigation
    );
  }
}