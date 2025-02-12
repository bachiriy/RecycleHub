import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, mergeMap, catchError, withLatestFrom, tap, filter } from 'rxjs/operators';
import { CollectionService } from '../services/collection.service';
import * as CollectionActions from './collection.actions';
import { selectCurrentUser } from '../../auth/store/auth.selectors';
import { Router } from '@angular/router';

@Injectable()
export class CollectionEffects {
  loadUserCollections$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionActions.loadUserCollections),
      withLatestFrom(this.store.select(selectCurrentUser)),
      filter(([_, user]) => !!user),
      mergeMap(([_, user]) =>
        this.collectionService.getUserCollections(user!.id).pipe(
          map(collections => CollectionActions.loadUserCollectionsSuccess({ collections })),
          catchError(error => of(CollectionActions.loadCollectionsFailure({ error: error.message })))
        )
      )
    )
  );

  loadAvailableCollections$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionActions.loadAvailableCollections),
      mergeMap(({ city }) =>
        this.collectionService.getAvailableCollections(city).pipe(
          map(collections => CollectionActions.loadAvailableCollectionsSuccess({ collections })),
          catchError(error => of(CollectionActions.loadCollectionsFailure({ error: error.message })))
        )
      )
    )
  );

  acceptCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionActions.acceptCollection),
      mergeMap(({ collectionId, collectorId }) =>
        this.collectionService.acceptCollection(collectionId, collectorId).pipe(
          map(collection => CollectionActions.acceptCollectionSuccess({ collection })),
          catchError(error => of(CollectionActions.acceptCollectionFailure({ error: error.message })))
        )
      )
    )
  );

  deleteCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionActions.deleteCollectionRequest),
      mergeMap(({ id }) =>
        this.collectionService.deleteCollection(id).pipe(
          map(() => CollectionActions.deleteCollectionRequestSuccess({ id })),
          catchError(error => of(CollectionActions.deleteCollectionFailure({ error: error.message })))
        )
      )
    )
  );

  createCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionActions.createCollection),
      withLatestFrom(this.store.select(selectCurrentUser)),
      mergeMap(([{ collection }, user]) =>
        this.collectionService.createCollection({
          ...collection,
          userId: user!.id
        }).pipe(
          map(newCollection => CollectionActions.createCollectionSuccess({ collection: newCollection })),
          catchError(error => of(CollectionActions.createCollectionFailure({ error: error.message })))
        )
      )
    )
  );

  createCollectionSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionActions.createCollectionSuccess),
      tap(() => this.router.navigate(['/collections/my']))
    ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private collectionService: CollectionService,
    private router: Router
  ) {}
} 