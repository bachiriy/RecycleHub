import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateProfile),
      mergeMap(({ user }) =>
        this.authService.updateUser(user).pipe(
          map(updatedUser => AuthActions.updateProfileSuccess({ user: updatedUser })),
          catchError(error => of(AuthActions.updateProfileFailure({ error: error.message })))
        )
      )
    )
  );

  deleteAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.deleteAccount),
      mergeMap(({ userId }) =>
        this.authService.deleteUser(userId).pipe(
          map(() => AuthActions.deleteAccountSuccess()),
          catchError(error => of(AuthActions.deleteAccountFailure({ error: error.message })))
        )
      )
    )
  );

  deleteAccountSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.deleteAccountSuccess),
      tap(() => this.router.navigate(['/auth/login']))
    ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}
} 