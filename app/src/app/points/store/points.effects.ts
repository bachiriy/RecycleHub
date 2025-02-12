import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, mergeMap, catchError, withLatestFrom } from 'rxjs/operators';
import { PointsService } from '../services/points.service';
import * as PointsActions from './points.actions';
import { selectCurrentUser } from '../../auth/store/auth.selectors';

@Injectable()
export class PointsEffects {
  redeemPoints$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PointsActions.redeemPoints),
      withLatestFrom(this.store.select(selectCurrentUser)),
      mergeMap(([{ points }, user]) =>
        this.pointsService.redeemPoints(user!.id, points).pipe(
          map((remainingPoints) =>
            PointsActions.redeemPointsSuccess({ points: remainingPoints })
          ),
          catchError((error) =>
            of(PointsActions.redeemPointsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private pointsService: PointsService
  ) {}
}